// ===== BookNest - External JavaScript file =====

// Show the current year in the footer of every page
function showYear() {
    var yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

// Validate the login form
function validateLogin() {
    var id = document.getElementById("loginId").value.trim();
    var pass = document.getElementById("loginPass").value;
    var msg = document.getElementById("loginMsg");

    if (id === "" || pass === "") {
        msg.className = "error";
        msg.textContent = "Please enter your student ID and password.";
        return false;
    }
    if (!/^[0-9]{7}$/.test(id)) {
        msg.className = "error";
        msg.textContent = "Student ID must be 7 digits.";
        return false;
    }

    msg.className = "success";
    msg.textContent = "Welcome back! You are logged in.";
    return false; // static website: we do not send the form to a server
}

// Validate the sign up form
function validateSignup() {
    var name = document.getElementById("fullName").value.trim();
    var id = document.getElementById("studentId").value.trim();
    var email = document.getElementById("email").value.trim();
    var pass = document.getElementById("password").value;
    var confirmPass = document.getElementById("confirmPass").value;
    var terms = document.getElementById("terms").checked;
    var msg = document.getElementById("signupMsg");

    msg.className = "error";

    if (name === "" || id === "" || email === "" || pass === "") {
        msg.textContent = "Please fill in all the required fields.";
        return false;
    }
    if (!/^[0-9]{7}$/.test(id)) {
        msg.textContent = "Student ID must be 7 digits.";
        return false;
    }
    if (email.indexOf("@") === -1) {
        msg.textContent = "Please enter a valid email.";
        return false;
    }
    if (pass.length < 6) {
        msg.textContent = "Password must be at least 6 characters.";
        return false;
    }
    if (pass !== confirmPass) {
        msg.textContent = "Passwords do not match.";
        return false;
    }
    if (!terms) {
        msg.textContent = "You must accept the library rules.";
        return false;
    }

    msg.className = "success";
    msg.textContent = "Account created for " + name + ". You can now log in.";
    return false;
}

// Show / hide password
function togglePassword(fieldId) {
    var field = document.getElementById(fieldId);
    field.type = (field.type === "password") ? "text" : "password";
}

window.onload = showYear;
