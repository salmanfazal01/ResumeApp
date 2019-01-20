$(document).ready(function () {

    //Initialize smooth scroll
    var scroll = new SmoothScroll('a[href*="#"]');

    $('#message_form').on('submit', function (event) {
        event.preventDefault();
        $('#message_form').trigger("reset");
        $("#sent_message").show().delay(3000).fadeOut();
    });

});


//When scroll (of 20px) occurs:
window.onscroll = function () {
    if (document.body.scrollTop > 60 || document.documentElement.scrollTop > 60) {
        document.getElementById("topButton").style.display = "block";
        document.getElementById("navbar").style.background = "rgba(52,58,64,0.8)";
    } else {
        document.getElementById("topButton").style.display = "none";
        document.getElementById("navbar").style.background = "transparent";
        document.getElementById("navbar").style.transition = "background 2s";
        document.getElementById("navbar").style['-webkit-transition'] = "background 1400ms";
        document.getElementById("navbar").style['-ms-transition'] = "background 1400ms";
    }
};

//check if both passwords match
function match_registration_passwords() {
    var password = document.getElementById("registration_password");
    var password_confirm = document.getElementById("registration_password_confirm");

    if (password.value != password_confirm.value) {
        password_confirm.setCustomValidity("Passwords do not match!");
        return false;
    } else {
        password_confirm.setCustomValidity("");
        return true;
    }
}