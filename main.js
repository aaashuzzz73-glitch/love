
let selectedChoice = "";
let selectedDate = "";
let confirmedDate = "";

// Save the current page
function saveCurrentPage(pageId) {
    localStorage.setItem("lastVisitedPage", pageId);
}

// Show the selected page
function showPage(pageId) {
    const pages = [
    "mainPage",
    "secondPage",
    "thirdPage",
    "calendarPage",
    "songPage"
];

    pages.forEach(id => {
        const page = document.getElementById(id);
        if (!page) return;

        if (id === "calendarPage") {
            page.hidden = id !== pageId;
        } else {
            page.style.display = id === pageId ? "block" : "none";
        }
    });

    saveCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Restore the last visited page
function restoreLastPage() {
    const pages = ["mainPage", "secondPage", "thirdPage", "calendarPage","songPage"];
    const lastPage = localStorage.getItem("lastVisitedPage");
    const pageToShow = pages.includes(lastPage) ? lastPage : "mainPage";

    pages.forEach(id => {
        const page = document.getElementById(id);
        if (!page) return;

        if (id === "calendarPage") {
            page.hidden = id !== pageToShow;
        } else {
            page.style.display = id === pageToShow ? "block" : "none";
        }
    });
}

// REQUEST button
function showmessage() {
    selectedChoice = "REQUEST";

    document.getElementById("message").textContent =
        "Oh, you chose: REQUEST 😚❤️";

    document.getElementById("requestMedia").style.display = "flex";
    document.getElementById("commandMedia").style.display = "none";
    document.getElementById("warningMessage").textContent = "";
}

// COMMAND button
function showmessage2() {
    selectedChoice = "COMMAND";

    document.getElementById("message").textContent =
        "Oh, you chose: COMMAND 😈💗";

    document.getElementById("requestMedia").style.display = "none";
    document.getElementById("commandMedia").style.display = "flex";
    document.getElementById("warningMessage").textContent = "";
}

// First page -> Second page
function nextPage() {
    const warning = document.getElementById("warningMessage");

    if (!selectedChoice) {
        warning.textContent = "Ponna, choose REQUEST or COMMAND first! 😭❤️";
        warning.className = "warning-popup";
        warning.style.display = "block";
        return;
    }

    warning.textContent = "";
    showPage("secondPage");
}

// Date options
const dateOptions = {
    temple: {
        title: "Our Temple Date 🛕🩵",
        image: "./image/image.png",
        description: "PEACEFULLY അമ്പലത്തിൽ പോകാം? 🩵"
    },
    tea: {
        title: "Our Tea Date ☕💕",
        image: "./image/tea.jpg",
        description: "BAA ചായ കുടിക്കാൻ പോകാം.. 🥹🩵"
    },
    beach: {
        title: "Our Beach Date 🌊🩵",
        image: "./image/beach.jpg",
        description: "എന്നെ ഒന്ന് കടൽ കാണിച്ച് തരുമോ? 🩵"
    },
    ride: {
        title: "Our Ride Date 🛵🩵",
        image: "./image/ride.jpg",
        description: "ഞാൻ വണ്ടി ഓടിക്കാം, വരുന്നോ കൂടെ? 😚🩵"
    },
    shopping: {
        title: "Our Shopping Date 🎀🩵",
        image: "./image/shopping.jpg",
        description: "ഷോപ്പിംഗിന് പോയാലോ? 🎀🩵"
    },
    movie: {
        title: "Our Movie Date 🎬🍿",
        image: "./image/movie.jpg",
        description: "സിനിമ കാണാൻ മൂഡ് ഉണ്ടോ? 🍿🩵"
    },
    naranga: {
        title: "Our Narangavellam Date 🍋🩵",
        image: "./image/narangavellam.jpg",
        description: "നാരങ്ങ വെള്ളം കുടിക്കാൻ പോകാം 🥹🩵"
    }
};

// Open date popup
function openDate(date) {
    const details = dateOptions[date];
    if (!details) return;

    selectedDate = date;

    document.getElementById("popupTitle").textContent = details.title;
    document.getElementById("popupImage").src = details.image;
    document.getElementById("popupDescription").textContent = details.description;
    document.getElementById("datePopup").style.display = "flex";
}

// Close date popup
function closeDate() {
    document.getElementById("datePopup").style.display = "none";
}

// Confirm selected date
function confirmDate() {
    if (!selectedDate) return;

    const details = dateOptions[selectedDate];
    confirmedDate = selectedDate;

    closeDate();

    const celebration = document.createElement("div");
    celebration.className = "celebration";
    document.body.appendChild(celebration);

    const colours = [
        "#ff4d88", "#ffcc00", "#a855f7",
        "#42c6ff", "#ff85a1", "#7ee081"
    ];

    for (let i = 0; i < 100; i++) {
        const piece = document.createElement("span");
        piece.className = "confetti";
        piece.style.left = Math.random() * 100 + "%";
        piece.style.backgroundColor =
            colours[Math.floor(Math.random() * colours.length)];
        piece.style.animationDelay = Math.random() * 0.8 + "s";
        piece.style.animationDuration = 2 + Math.random() * 2 + "s";
        celebration.appendChild(piece);
    }

    const hearts = ["💙", "🩵", "🤍"];

    for (let i = 0; i < 25; i++) {
        const heart = document.createElement("span");
        heart.className = "heart-pop";
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + "%";
        heart.style.animationDelay = Math.random() * 1.5 + "s";
        celebration.appendChild(heart);
    }

    const message = document.createElement("div");
    message.className = "celebration-message";
    message.innerHTML =
        `YAYYYYY BABYYYY! 😭🩵<br><br>${details.title}<br><br>It's a date, ponnaahhh! 😚🩵`;

    document.body.appendChild(message);

    setTimeout(() => {
        celebration.remove();
        message.remove();
    }, 3000);
}

// Second page -> Third page
function thirdPage() {
    const warning = document.getElementById("dateWarning");

    if (!confirmedDate) {
        warning.style.display = "block";
        warning.textContent = "Ponna, you forgot to choose a date! 😭🩵";
        return;
    }

    warning.style.display = "none";
    showPage("thirdPage");
}

// Move NO button
function moveNoButton() {
    const noButton = document.getElementById("noButton");
    if (!noButton) return;

    const maxX = Math.max(0, window.innerWidth - noButton.offsetWidth - 20);
    const maxY = Math.max(0, window.innerHeight - noButton.offsetHeight - 20);

    noButton.style.position = "fixed";
    noButton.style.left = Math.random() * maxX + "px";
    noButton.style.top = Math.random() * maxY + "px";
    noButton.style.zIndex = "999";
}

// YES button
function sayYes() {
    document.getElementById("loveQuestion").style.display = "none";
    document.getElementById("loveButtons").style.display = "none";
    document.getElementById("loveAnswer").style.display = "block";
}

// CALENDAR ELEMENTS
const nextCalendarBtn = document.getElementById("nextCalendarBtn");
const calendarPage = document.getElementById("calendarPage");
const dateChoice = document.getElementById("dateChoice");
const selectedDateMessage = document.getElementById("selectedDateMessage");
const saveDateBtn = document.getElementById("saveDateBtn");
const dateDetailsForm = document.getElementById("dateDetailsForm");
const dateTime = document.getElementById("dateTime");
const datePlace = document.getElementById("datePlace");
const dateType = document.getElementById("dateType");
const confirmOurDateBtn = document.getElementById("confirmOurDateBtn");
const backToLoveBtn = document.getElementById("backToLoveBtn");

// OPEN CALENDAR PAGE
nextCalendarBtn?.addEventListener("click", () => {
    const dateTypeMap = {
        temple: "Temple Date",
        tea: "Tea Date",
        beach: "Beach Date",
        ride: "Ride Date",
        shopping: "Shopping Date",
        movie: "Movie Date",
        naranga: "Narangavellam Date"
    };

    if (confirmedDate && dateTypeMap[confirmedDate]) {
        dateType.value = dateTypeMap[confirmedDate];

        selectedDateMessage.textContent =
            `Our ${dateTypeMap[confirmedDate]} is chosen! 💗`;
    }

    showPage("calendarPage");
});
// SAVE DATE SELECTION AND SHOW DETAILS
saveDateBtn?.addEventListener("click", () => {
    if (!dateChoice.value) {
selectedDateMessage.textContent =
    `Date chosen: ${dateChoice.value} 💗 Now fill in our date details!`;
        return;
    }

    dateDetailsForm.hidden = false;

    selectedDateMessage.textContent =
        "Date selected! Now fill in our little date details 💌";
});

// BACK TO LOVE PAGE
backToLoveBtn?.addEventListener("click", () => {
    showPage("thirdPage");
});

// CONFIRM DATE DETAILS
confirmOurDateBtn?.addEventListener("click", async () => {
    if (
        !dateChoice.value ||
        !dateTime.value ||
        !datePlace.value.trim() ||
        !dateType.value
    ) {
        selectedDateMessage.textContent =
            "Please fill in all our date details, baby! 🥹❤️";
        return;
    }

    selectedDateMessage.textContent =
        "Saving our date and sending your email... 💌";

    try {
        const response = await fetch("/api/date", {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                date: dateChoice.value,
                time: dateTime.value,
                place: datePlace.value.trim(),
                dateType: dateType.value
            })
        });

        const result = await response.json();

        if (!response.ok) {
            selectedDateMessage.textContent =
                result.message || "Couldn't save our date.";
            return;
        }

        const formattedDate = new Date(
            result.date + "T12:00:00"
        ).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });

        selectedDateMessage.textContent =
            `Our date is fixed for ${formattedDate} at ${result.time}, ${result.place} 💗 Email sent!`;

    } catch (error) {
        console.error(error);

        selectedDateMessage.textContent =
            "Connection problem. Please try again, baby. 🥹";
    }
});
// LOAD SAVED DATE DETAILS FROM MONGODB
async function loadSavedDate() {
    try {
        const response = await fetch("/api/date", {
            credentials: "same-origin"
        });

        if (!response.ok) return;

        const result = await response.json();

        if (result.date) {
            dateChoice.value = result.date;
            dateTime.value = result.time || "";
            datePlace.value = result.place || "";
            dateType.value = result.dateType || "";

            dateDetailsForm.hidden = false;

            selectedDateMessage.textContent =
                "Your saved date details are loaded 💗";
        }
    } catch (error) {
        console.error("Could not load saved date:", error);
    }
}

loadSavedDate();
// BUTTON EVENT LISTENER
document.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;

    const action = button.dataset.action;

    if (action === "request") {
        showmessage();
    } else if (action === "command") {
        showmessage2();
    } else if (action === "next-page") {
        nextPage();
    } else if (action === "third-page") {
        thirdPage();
    } else if (action === "close-date") {
        closeDate();
    } else if (action === "confirm-date") {
        confirmDate();
    } else if (action === "say-yes") {
        sayYes();
    } else if (action === "move-no") {
        moveNoButton();
    }

    if (button.dataset.date) {
        openDate(button.dataset.date);
    }
});

// NO button hover
document.getElementById("noButton")?.addEventListener(
    "mouseenter",
    moveNoButton
);

document.getElementById("kissYes")?.addEventListener("click", () => {
    showPage("songPage");
});

document.getElementById("kissNo")?.addEventListener("click", () => {
    showPage("thirdPage");
});
// Play or pause song when blue heart is clicked
const blueHeartBtn = document.getElementById("blueHeartBtn");
const ourSong = document.getElementById("ourSong");

blueHeartBtn?.addEventListener("click", async () => {
    if (!ourSong) return;

    if (ourSong.paused) {
        try {
            await ourSong.play();
            blueHeartBtn.classList.add("playing");
        } catch (error) {
            console.error("Song playback failed:", error);
        }
    } else {
        ourSong.pause();
        blueHeartBtn.classList.remove("playing");
    }
});

ourSong?.addEventListener("ended", () => {
    blueHeartBtn?.classList.remove("playing");
});

const noBtn = document.getElementById("noBtn");

function moveNoButton() {
  const maxX = window.innerWidth - noBtn.offsetWidth;
  const maxY = window.innerHeight - noBtn.offsetHeight;

  noBtn.style.position = "fixed";
  noBtn.style.left = Math.random() * Math.max(0, maxX) + "px";
  noBtn.style.top = Math.random() * Math.max(0, maxY) + "px";
}

noBtn.addEventListener("pointerenter", moveNoButton);
noBtn.addEventListener("touchstart", (event) => {
  event.preventDefault();
  moveNoButton();
}, { passive: false });
