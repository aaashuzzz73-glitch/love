
import express from "express";
import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";
import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

if (!process.env.MONGODB_URI || !process.env.SESSION_SECRET) {
    throw new Error("MONGODB_URI and SESSION_SECRET are required in .env");
}

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();

const db = client.db(process.env.MONGODB_DB || "romantic_website");
const users = db.collection("users");

await users.createIndex({ email: 1 }, { unique: true });

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:"],
            mediaSrc: ["'self'"],
            connectSrc: ["'self'"],
            objectSrc: ["'none'"],
            baseUri: ["'self'"],
            frameAncestors: ["'none'"]
        }
    }
}));

app.use(express.json({ limit: "10kb" }));

app.use(session({
    name: "romantic.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ client, dbName: process.env.MONGODB_DB || "romantic_website" }),
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10
});

function text(value, max = 200) {
    return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function validEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
        email.length <= 254;
}

function safeUser(user) {
    return {
        name: user.name,
        mood: user.mood,
        okay: user.okay,
        email: user.email
    };
}

app.post("/api/register", limiter, async (req, res, next) => {
    try {
        const name = text(req.body.name, 80);
        const mood = text(req.body.mood);
        const okay = text(req.body.okay);
        const email = text(req.body.email, 254).toLowerCase();
        const password = typeof req.body.password === "string"
            ? req.body.password
            : "";

        if (!name || !mood || !okay || !email || !password) {
            return res.status(400).json({
                message: "Please fill in every field."
            });
        }

        if (!validEmail(email)) {
            return res.status(400).json({
                message: "Enter a valid email address."
            });
        }

        if (password.length < 8 || password.length > 72) {
            return res.status(400).json({
                message: "Password must be 8–72 characters."
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);
        let result;

        try {
            result = await users.insertOne({
                name, mood, okay, email, passwordHash,
                createdAt: new Date()
            });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(409).json({
                    message: "This email already has an account. Please log in."
                });
            }
            throw error;
        }

        req.session.userId = result.insertedId.toString();

        req.session.save((error) => {
            if (error) return next(error);
            res.status(201).json({
                message: "Account created! Welcome, baby! 🩵",
                user: { name, mood, okay, email }
            });
        });
    } catch (error) {
        next(error);
    }
});

app.post("/api/login", limiter, async (req, res, next) => {
    try {
        const email = text(req.body.email, 254).toLowerCase();
        const password = typeof req.body.password === "string"
            ? req.body.password
            : "";

        if (!email || !password) {
            return res.status(400).json({
                message: "Enter your email and password."
            });
        }

        const user = await users.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return res.status(401).json({
                message: "Incorrect email or password."
            });
        }

        req.session.regenerate((error) => {
            if (error) return next(error);

            req.session.userId = user._id.toString();
            req.session.save((saveError) => {
                if (saveError) return next(saveError);
                res.json({
                    message: "Welcome back, baby! 🩵",
                    user: safeUser(user)
                });
            });
        });
    } catch (error) {
        next(error);
    }
});

app.post("/api/date", async (req, res, next) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({
                message: "Please log in again."
            });
        }

        const { date } = req.body;

        if (
            typeof date !== "string" ||
            !/^\d{4}-\d{2}-\d{2}$/.test(date)
        ) {
            return res.status(400).json({
                message: "Please choose a valid date."
            });
        }

        const { ObjectId } = await import("mongodb");
        const userId = new ObjectId(req.session.userId);

        await users.updateOne(
            { _id: userId },
            {
                $set: {
                    plannedDate: date,
                    plannedDateUpdatedAt: new Date()
                }
            }
        );

        res.json({
            message: "Our special date is saved, baby! 💗",
            date
        });
    } catch (error) {
        next(error);
    }
});

app.get("/api/date", async (req, res, next) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({
                message: "Please log in again."
            });
        }

        const { ObjectId } = await import("mongodb");

        const user = await users.findOne(
            { _id: new ObjectId(req.session.userId) },
            { projection: { plannedDate: 1 } }
        );

        if (!user) {
            return res.status(404).json({
                message: "Account not found."
            });
        }

        res.json({ date: user.plannedDate || null });
    } catch (error) {
        next(error);
    }
});


app.get("/api/me", async (req, res, next) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ message: "Not logged in." });
        }

        const { ObjectId } = await import("mongodb");
        const user = await users.findOne({
            _id: new ObjectId(req.session.userId)
        });

        if (!user) {
            return req.session.destroy(() =>
                res.status(401).json({ message: "Please log in again." })
            );
        }

        res.json({ user: safeUser(user) });
    } catch (error) {
        next(error);
    }
});

app.post("/api/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).json({ message: "Could not log out." });
        }

        res.clearCookie("romantic.sid", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        });

        res.json({ message: "Logged out." });
    });
});

// Serve your website files from the public folder.
app.use(express.static(path.join(__dirname, "public")));

app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ message: "Server error. Check the terminal." });
});

app.listen(PORT, () => {
    console.log(`Website running at http://localhost:${PORT}`);
});
