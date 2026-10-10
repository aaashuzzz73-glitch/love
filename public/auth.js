
const authPage = document.getElementById("authPage");
const websiteContent = document.getElementById("websiteContent");
const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const toggleAuth = document.getElementById("toggleAuth");
const authSubtitle = document.getElementById("authSubtitle");
const authMessage = document.getElementById("authMessage");

let loginMode = false;

function showMessage(message) {
    authMessage.textContent = message;
}

function showWebsite() {
    authPage.style.display = "none";
    websiteContent.hidden = false;
}

function showRegisterForm() {
    loginMode = false;
    registerForm.hidden = false;
    loginForm.hidden = true;

    authSubtitle.textContent = "Create your little account 💌";
    toggleAuth.textContent = "Already have an account? Login";
    showMessage("");
}

function showLoginForm() {
    loginMode = true;
    registerForm.hidden = true;
    loginForm.hidden = false;

    authSubtitle.textContent = "Welcome back, baby! 🩵";
    toggleAuth.textContent = "New here? Create an account";
    showMessage("");
}

toggleAuth.addEventListener("click", () => {
    if (loginMode) {
        showRegisterForm();
    } else {
        showLoginForm();
    }
});

async function submitForm(url, data) {
    showMessage("One moment, baby... 🩵");

    try {
        const response = await fetch(url, {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            showMessage(result.message || "Something went wrong.");
            return;
        }

        showMessage(result.message || "Success! 💙");
        showWebsite();
    } catch (error) {
        console.error("Authentication error:", error);
        showMessage(
            "Cannot connect to the server. Check server.js and MongoDB."
        );
    }
}

// REGISTER
registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!registerForm.reportValidity()) return;

    const data = {
        name: document.getElementById("signupName").value.trim(),
        mood: document.getElementById("signupMood").value.trim(),
        okay: document.getElementById("signupOkay").value.trim(),
        email: document.getElementById("signupEmail").value.trim(),
        password: document.getElementById("signupPassword").value
    };

    await submitForm("/api/register", data);
});

// LOGIN
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!loginForm.reportValidity()) return;

    const data = {
        email: document.getElementById("loginEmail").value.trim(),
        password: document.getElementById("loginPassword").value
    };

    await submitForm("/api/login", data);
});

// CHECK EXISTING LOGIN WHEN PAGE LOADS OR REFRESHES
async function checkExistingLogin() {
    // Show the authentication page while checking the session.
    authPage.style.display = "flex";
    websiteContent.hidden = true;

    try {
        const response = await fetch("/api/me", {
            method: "GET",
            credentials: "same-origin",
            cache: "no-store"
        });

        if (response.ok) {
            showWebsite();
        } else {
            showRegisterForm();
            authPage.style.display = "flex";
            websiteContent.hidden = true;
        }
    } catch (error) {
        console.error("Session check error:", error);
        showRegisterForm();
        authPage.style.display = "flex";
        websiteContent.hidden = true;
        showMessage("Cannot check login. Please check the server.");
    }
}

// IMPORTANT: Keep this line at the bottom.
checkExistingLogin();
