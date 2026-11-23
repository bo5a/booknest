// ===== BookNest - External JavaScript file =====
// CPIS 358 - Assignment 2 (group: Dinosaurs)

/* =========================================================
   1) Code that runs on EVERY page (master page)
   ========================================================= */

// Show the current year in the footer of every page
function showYear() {
    var yearSpan = document.getElementById("Year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

// Dark mode: change the CSS style of the whole page with a class
function toggleTheme() {
    var body = document.body;
    var btn = document.getElementById("themeBtn");

    body.classList.toggle("dark");

    if (body.classList.contains("dark")) {
        btn.textContent = "Light mode";
        saveTheme("dark");
    } else {
        btn.textContent = "Dark mode";
        saveTheme("light");
    }
}

// Remember the theme when the user moves to another page
function saveTheme(value) {
    try {
        localStorage.setItem("booknestTheme", value);
    } catch (e) {
        // storage is not available, the theme just will not be remembered
    }
}

function loadTheme() {
    var saved = null;
    try {
        saved = localStorage.getItem("booknestTheme");
    } catch (e) {
        saved = null;
    }
    if (saved === "dark") {
        document.body.classList.add("dark");
        var btn = document.getElementById("themeBtn");
        if (btn) {
            btn.textContent = "Light mode";
        }
    }
}

// "Back to top" button: appears only after the user scrolls down
function checkScroll() {
    var topBtn = document.getElementById("topBtn");
    if (!topBtn) {
        return;
    }
    if (window.scrollY > 300) {
        topBtn.style.display = "block";
    } else {
        topBtn.style.display = "none";
    }
}

function goToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

/* =========================================================
   2) Home page - Dynamic picture & text (Book of the Day)
   ========================================================= */

var books = [
    {
        title: "Database System Concepts",
        author: "Silberschatz",
        image: "images/book-database.svg",
        text: "The main textbook for database courses. Learn about tables, SQL and how data is stored."
    },
    {
        title: "Systems Analysis and Design",
        author: "Dennis",
        image: "images/book-analysis.svg",
        text: "Explains how to study a problem and design an information system step by step."
    },
    {
        title: "HTML and CSS",
        author: "Jon Duckett",
        image: "images/book-html.svg",
        text: "A very visual book that teaches how to build and style web pages from zero."
    },
    {
        title: "Principles of Marketing",
        author: "Kotler",
        image: "images/book-marketing.svg",
        text: "Covers customers, markets and the marketing mix. Useful for business students."
    }
];

var currentBook = 0;
var slideTimer = null;

// Show the book with the given number (changes the picture and the text)
function showBook(index) {
    var img = document.getElementById("bookImg");
    if (!img) {
        return; // we are not on the home page
    }

    // keep the number inside the array (go around in a circle)
    if (index >= books.length) {
        index = 0;
    } else if (index < 0) {
        index = books.length - 1;
    }
    currentBook = index;

    img.src = books[index].image;
    img.alt = books[index].title + " cover";
    document.getElementById("bookTitle").textContent = books[index].title;
    document.getElementById("bookAuthor").textContent = "by " + books[index].author;
    document.getElementById("bookText").textContent = books[index].text;

    // update the small dots under the picture
    var dots = document.getElementsByClassName("dot");
    for (var i = 0; i < dots.length; i++) {
        if (i === index) {
            dots[i].style.backgroundColor = "#e07a5f";
        } else {
            dots[i].style.backgroundColor = "#ccc";
        }
    }
}

function nextBook() {
    showBook(currentBook + 1);
    restartSlideshow();
}

function prevBook() {
    showBook(currentBook - 1);
    restartSlideshow();
}

// Create one dot for every book (dynamic elements)
function createDots() {
    var dotBox = document.getElementById("dots");
    if (!dotBox) {
        return;
    }
    for (var i = 0; i < books.length; i++) {
        var dot = document.createElement("span");
        dot.className = "dot";
        dot.title = books[i].title;
        dot.setAttribute("data-index", i);
        dot.onclick = function () {
            showBook(Number(this.getAttribute("data-index")));
            restartSlideshow();
        };
        dotBox.appendChild(dot);
    }
}

// Change the book automatically every 4 seconds
function startSlideshow() {
    slideTimer = setInterval(function () {
        showBook(currentBook + 1);
    }, 4000);
}

function restartSlideshow() {
    clearInterval(slideTimer);
    startSlideshow();
}

/* =========================================================
   3) Home page - Search the books table
   ========================================================= */

function filterBooks() {
    var search = document.getElementById("searchBox").value.toLowerCase().trim();
    var category = document.getElementById("categoryFilter").value;
    var rows = document.getElementById("booksTable").getElementsByTagName("tr");
    var shown = 0;

    // start from 1 to skip the header row
    for (var i = 1; i < rows.length; i++) {
        var title = rows[i].cells[0].textContent.toLowerCase();
        var author = rows[i].cells[1].textContent.toLowerCase();
        var rowCategory = rows[i].cells[2].textContent;

        var matchText = title.indexOf(search) !== -1 || author.indexOf(search) !== -1;
        var matchCategory = (category === "all" || rowCategory === category);

        if (matchText && matchCategory) {
            rows[i].style.display = "";
            shown++;
        } else {
            rows[i].style.display = "none";
        }
    }

    var result = document.getElementById("searchResult");
    if (shown === 0) {
        result.className = "error";
        result.textContent = "No books found. Try another title or author.";
    } else {
        result.className = "";
        result.textContent = "Showing " + shown + " of " + (rows.length - 1) + " books.";
    }
}

/* =========================================================
   4) Home page - Reservation list (dynamic elements)
   ========================================================= */

var MAX_RESERVATIONS = 3;

function reserveBook(button) {
    var row = button.parentNode.parentNode;
    var title = row.cells[0].textContent;
    var list = document.getElementById("reserveList");
    var items = list.getElementsByTagName("li");
    var msg = document.getElementById("reserveMsg");

    // check if the book is already in the list (repetition)
    for (var i = 0; i < items.length; i++) {
        if (items[i].getAttribute("data-title") === title) {
            msg.className = "error";
            msg.textContent = "\"" + title + "\" is already in your list.";
            return;
        }
    }

    // a student can reserve only 3 books
    if (items.length >= MAX_RESERVATIONS) {
        msg.className = "error";
        msg.textContent = "You can reserve only " + MAX_RESERVATIONS + " books at a time.";
        return;
    }

    // create the new list item
    var li = document.createElement("li");
    li.setAttribute("data-title", title);
    li.className = "reserve-item";

    var pickup = new Date();
    pickup.setDate(pickup.getDate() + 2);
    li.textContent = title + " - pick up before " + pickup.toDateString() + " ";

    var removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.className = "small-btn";
    removeBtn.onclick = function () {
        cancelReservation(li, button);
    };
    li.appendChild(removeBtn);
    list.appendChild(li);

    // change the button and the row style
    button.textContent = "Reserved";
    button.disabled = true;
    row.className = "reserved-row";

    msg.className = "success";
    msg.textContent = "\"" + title + "\" was added to your reservations.";
    updateReserveCount();
}

function cancelReservation(li, button) {
    var row = button.parentNode.parentNode;
    li.parentNode.removeChild(li);
    button.textContent = "Reserve";
    button.disabled = false;
    row.className = "";

    var msg = document.getElementById("reserveMsg");
    msg.className = "";
    msg.textContent = "Reservation removed.";
    updateReserveCount();
}

function updateReserveCount() {
    var count = document.getElementById("reserveList").getElementsByTagName("li").length;
    document.getElementById("reserveCount").textContent = count;
    document.getElementById("emptyText").style.display = (count === 0) ? "block" : "none";
}

/* =========================================================
   5) Login page - Form validation
   ========================================================= */

// Give the field a red or green border
function markField(field, isValid) {
    if (isValid) {
        field.style.borderColor = "#2e7d32";
        field.style.backgroundColor = "";
    } else {
        field.style.borderColor = "#c0392b";
        field.style.backgroundColor = "#fdecea";
    }
}

function validateLogin() {
    var idField = document.getElementById("loginId");
    var passField = document.getElementById("loginPass");
    var id = idField.value.trim();
    var pass = passField.value;
    var msg = document.getElementById("loginMsg");

    msg.className = "error";

    if (id === "" || pass === "") {
        markField(idField, id !== "");
        markField(passField, pass !== "");
        msg.textContent = "Please enter your student ID and password.";
        return false;
    }
    if (!/^[0-9]{7}$/.test(id)) {
        markField(idField, false);
        msg.textContent = "Student ID must be 7 digits.";
        return false;
    }
    markField(idField, true);

    if (pass.length < 6) {
        markField(passField, false);
        msg.textContent = "Password must be at least 6 characters.";
        return false;
    }
    markField(passField, true);

    msg.className = "success";
    msg.textContent = "Welcome back, student " + id + "! You are logged in.";
    return false; // static website: we do not send the form to a server
}

// Warn the user when Caps Lock is on (keyboard event)
function checkCaps(event) {
    var warning = document.getElementById("capsWarning");
    if (event.getModifierState && event.getModifierState("CapsLock")) {
        warning.style.display = "block";
    } else {
        warning.style.display = "none";
    }
}

/* =========================================================
   6) Sign up page - Form validation
   ========================================================= */

function validateSignup() {
    var msg = document.getElementById("signupMsg");
    var errors = [];

    // check all required fields with a loop
    var required = ["fullName", "studentId", "email", "password", "confirmPass"];
    for (var i = 0; i < required.length; i++) {
        var field = document.getElementById(required[i]);
        var empty = field.value.trim() === "";
        markField(field, !empty);
        if (empty && errors.length === 0) {
            errors.push("Please fill in all the required fields.");
        }
    }

    var nameField = document.getElementById("fullName");
    var idField = document.getElementById("studentId");
    var emailField = document.getElementById("email");
    var passField = document.getElementById("password");
    var confirmField = document.getElementById("confirmPass");

    if (nameField.value.trim() !== "" && !/^[A-Za-z\s]{3,}$/.test(nameField.value.trim())) {
        markField(nameField, false);
        errors.push("Name must have letters only (at least 3).");
    }
    if (idField.value.trim() !== "" && !/^[0-9]{7}$/.test(idField.value.trim())) {
        markField(idField, false);
        errors.push("Student ID must be 7 digits.");
    }
    if (emailField.value.trim() !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim())) {
        markField(emailField, false);
        errors.push("Please enter a valid email, like name@stu.kau.edu.sa.");
    }
    if (passField.value !== "" && passField.value.length < 6) {
        markField(passField, false);
        errors.push("Password must be at least 6 characters.");
    }
    if (confirmField.value !== "" && passField.value !== confirmField.value) {
        markField(confirmField, false);
        errors.push("Passwords do not match.");
    }
    if (!document.getElementById("terms").checked) {
        errors.push("You must accept the library borrowing rules.");
    }

    // show all the errors as a list (dynamic elements)
    msg.innerHTML = "";
    if (errors.length > 0) {
        msg.className = "error";
        var ul = document.createElement("ul");
        for (var j = 0; j < errors.length; j++) {
            var li = document.createElement("li");
            li.textContent = errors[j];
            ul.appendChild(li);
        }
        msg.appendChild(ul);
        return false;
    }

    msg.className = "success";
    msg.textContent = "Account created for " + nameField.value.trim() + ". You can now log in.";
    return false;
}

// Password strength bar: changes width, color and text while typing
function checkStrength() {
    var pass = document.getElementById("password").value;
    var bar = document.getElementById("strengthBar");
    var label = document.getElementById("strengthText");
    var score = 0;

    if (pass.length >= 6) { score++; }
    if (pass.length >= 10) { score++; }
    if (/[A-Z]/.test(pass)) { score++; }
    if (/[0-9]/.test(pass)) { score++; }
    if (/[^A-Za-z0-9]/.test(pass)) { score++; }

    switch (score) {
        case 0:
        case 1:
            bar.style.width = "20%";
            bar.style.backgroundColor = "#c0392b";
            label.textContent = "Weak";
            break;
        case 2:
        case 3:
            bar.style.width = "60%";
            bar.style.backgroundColor = "#f39c12";
            label.textContent = "Medium";
            break;
        default:
            bar.style.width = "100%";
            bar.style.backgroundColor = "#2e7d32";
            label.textContent = "Strong";
    }
    if (pass.length === 0) {
        bar.style.width = "0";
        label.textContent = "";
    }
}

// Clear the colors and messages when the user presses "Clear"
function resetForm(form, msgId) {
    var inputs = form.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].style.borderColor = "";
        inputs[i].style.backgroundColor = "";
    }
    document.getElementById(msgId).innerHTML = "";
    var bar = document.getElementById("strengthBar");
    if (bar) {
        bar.style.width = "0";
        document.getElementById("strengthText").textContent = "";
    }
}

// Show / hide password
function togglePassword(fieldId) {
    var field = document.getElementById(fieldId);
    field.type = (field.type === "password") ? "text" : "password";
}

/* =========================================================
   7) About us page - FAQ built with JavaScript
   ========================================================= */

var faqs = [
    { q: "Who can use BookNest?", a: "Any KAU student with a 7-digit student ID can sign up and use it." },
    { q: "How many books can I reserve?", a: "You can reserve up to 3 books at the same time." },
    { q: "How long is a reservation kept?", a: "Two days. If you do not pick up the book, it becomes available again." },
    { q: "Is BookNest free?", a: "Yes. It is a free service for university students." }
];

function buildFaq() {
    var box = document.getElementById("faqList");
    if (!box) {
        return;
    }
    for (var i = 0; i < faqs.length; i++) {
        var question = document.createElement("button");
        question.className = "faq-q";
        question.textContent = "+ " + faqs[i].q;

        var answer = document.createElement("p");
        answer.className = "faq-a";
        answer.textContent = faqs[i].a;
        answer.style.display = "none";

        question.onclick = function () {
            var ans = this.nextSibling;
            if (ans.style.display === "none") {
                ans.style.display = "block";
                this.textContent = this.textContent.replace("+ ", "- ");
                this.style.backgroundColor = "#e07a5f";
            } else {
                ans.style.display = "none";
                this.textContent = this.textContent.replace("- ", "+ ");
                this.style.backgroundColor = "";
            }
        };

        box.appendChild(question);
        box.appendChild(answer);
    }
}

/* =========================================================
   8) Start everything when the page finishes loading
   ========================================================= */

window.onload = function () {
    showYear();
    loadTheme();
    buildFaq();

    if (document.getElementById("bookImg")) {
        createDots();
        showBook(0);
        startSlideshow();
        filterBooks();
        updateReserveCount();
    }
};

window.onscroll = checkScroll;
