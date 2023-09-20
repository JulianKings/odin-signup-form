// basic declarations
const inputs = document.querySelectorAll(".form-input-content input");
const takenNames = ["Max", "Jhon", "Mark", "Lucy", "Nynaeve"];
const takenMails = ["a@b.c", "yo@yo.com", "amazing@gmail.com", "taco@hotmail.es"];

// bar management
const strengthFirstBar = document.querySelector("#firstBar");
const strengthSecondBar = document.querySelector("#secondBar");
const strengthThirdBar = document.querySelector("#thirdBar");
const strengthFourthBar = document.querySelector("#fourthBar");
const strengthCaption = document.querySelector(".form-input-password-strength-caption");
const strengthDiv = document.querySelector(".form-input-password-strength");

// password lock management
const passwordLock = document.querySelector("#formPasswordLock");
const passwordInput = document.querySelector("#password");
let lockStatus = true;

inputs.forEach((input) => {
    // register all Handlers
    input.addEventListener("change", (event) => {
        onInputChange(event, input, input.parentElement.nextElementSibling);
    });

    // password handler
    if(input.id === "password")
    {
        input.addEventListener('input', (event) => {
            onFastInputChange(event, input, input.parentElement.nextElementSibling);
        });
        input.addEventListener('propertychange', (event) => {
            onFastInputChange(event, input, input.parentElement.nextElementSibling);
        }); // for IE8

        // small handler for the password strength check
        input.addEventListener('focus', (event) => {
            if(strengthDiv.style["display"] !== "flex")
            {
                strengthDiv.style["display"] = "flex";
            }

        });

        input.addEventListener('focusout', (event) => {
            if(strengthDiv.style["display"] !== "none")
            {
                strengthDiv.style["display"] = "none";
            }

        });

    }

});

// register lock status handler
passwordLock.addEventListener('click', (event) => {
    swapLock();
    lockStatus = !lockStatus;
    passwordInput.setAttribute("type", (lockStatus) ? "password" : "text");
    
    // refresh, since it lost focus on click
    if(strengthDiv.style["display"] !== "flex")
    {
        strengthDiv.style["display"] = "flex";
    }
});


// Handlers
function onFastInputChange(inputEvent, input, prevSibling)
{
    let inputValue = inputEvent.target.value;
    // apply/remove required flag
    if(input.getAttribute("required") !== null && inputValue !== undefined 
    && inputValue !== "")
    {
        input.setAttribute("wasRequired", true);
        input.removeAttribute("required");
    } else if(input.getAttribute("wasRequired") !== null && inputValue === undefined ||
    input.getAttribute("wasRequired") !== null && inputValue === "")
    {
        input.setAttribute("required", "");
        input.removeAttribute("wasRequired");

        // cleanup errors since its empty
        if(input.classList.contains("error"))
        {
            input.classList.remove("error");
            prevSibling.textContent = "";
        }

        setNeutralPassword();
        cleanUpLock();
    }    

    if(inputValue !== "" && inputValue !== undefined)
    {
        enableLock();

        let validRegexVeryStrong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%"'()*?&]{8,}$/;
        let validRegexStrong = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%"'()*#?&]{8,}$/;
        let validRegexSecondaryStrong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        let validRegexAverage = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if(validRegexVeryStrong.test(inputValue))
        {
            setVeryStrongPassword();
        } else if(validRegexStrong.test(inputValue) || validRegexSecondaryStrong.test(inputValue)) {
            setStrongPassword();
        } else if(validRegexAverage.test(inputValue)) {
            setAveragePassword();
        } else {
            setWeakPassword();
        }
    }
            
}

function onInputChange(inputEvent, input, prevSibling)
{
    let inputValue = inputEvent.target.value;

    // apply/remove required flag
    if(input.getAttribute("required") !== null && inputValue !== undefined 
    && inputValue !== "")
    {
        input.setAttribute("wasRequired", true);
        input.removeAttribute("required");
    } else if(input.getAttribute("wasRequired") !== null && inputValue === undefined ||
    input.getAttribute("wasRequired") !== null && inputValue === "")
    {
        input.setAttribute("required", "");
        input.removeAttribute("wasRequired");
    }

    //clean up
    if(input.classList.contains("error"))
    {
        input.classList.remove("error");
        // cleanup error notif
        prevSibling.textContent = "";
    }

    if(input.classList.contains("valid"))
    {
        input.classList.remove("valid");
    }

    if(inputValue !== undefined && inputValue !== "")
    {
        // Handle each input
        if(input.id === "userName")
        {
            // Handle names and inform of any errors
            if(takenNames.includes(inputValue)) {
                input.classList.add("error");
                prevSibling.textContent = "This name is already taken";
            } else if(inputValue.length < 3) {
                input.classList.add("error");
                prevSibling.textContent = "Name minimum length is 3 characters";
            } else {
                input.classList.add("valid");
            }
        } else if(input.id === "lastName")
        {
            if(inputValue.length < 3) {
                input.classList.add("error");
                prevSibling.textContent = "Last name minimum length is 3 characters";
            } else {
                input.classList.add("valid");
            }
        } else if(input.id === "email")
        {
            let validRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
            if(takenMails.includes(inputValue)) {
                input.classList.add("error");
                prevSibling.textContent = "This email is already taken";
            } else if(!validRegex.test(inputValue)) {
                input.classList.add("error");
                prevSibling.textContent = "Invalid email address";
            } else {
                input.classList.add("valid");
            }
        } else if(input.id === "phoneNumber")
        {
            let validRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3,6}$/;
            if(!validRegex.test(inputValue)) {
                input.classList.add("error");
                prevSibling.textContent = "Invalid phone number";
            } else {
                input.classList.add("valid");
            }
        } else if(input.id === "password")
        {
            // reset lock status
            cleanUpLock();
            enableLock();

            if(inputValue.length < 6) {
                input.classList.add("error");
                prevSibling.textContent = "Password minimum length is 6 characters";
                moveLock();
            } else {
                input.classList.add("valid");
                moveLock();
            }
        } else if(input.id === "confirmPassword")
        {
            if(inputValue === passwordInput.value)
            {
                input.classList.add("valid");
            } else {
                input.classList.add("error");
                prevSibling.textContent = "Password doesn't match";
                
            }
        }
    }

    console.log(inputEvent.target.value);

}

// Strength check helpers
function setWeakPassword()
{
    strengthFirstBar.style["background-color"] = "#500000";
    strengthSecondBar.style["background-color"] = "#868686";
    strengthThirdBar.style["background-color"] = "#868686";
    strengthFourthBar.style["background-color"] = "#868686";
    strengthCaption.textContent = "Weak";
    strengthCaption.style["color"] = "#500000";
}

function setAveragePassword()
{
    strengthFirstBar.style["background-color"] = "orange";
    strengthSecondBar.style["background-color"] = "orange";
    strengthThirdBar.style["background-color"] = "#868686";
    strengthFourthBar.style["background-color"] = "#868686";
    strengthCaption.textContent = "Average";
    strengthCaption.style["color"] = "orange";
}

function setStrongPassword()
{
    strengthFirstBar.style["background-color"] = "#23ad5c";
    strengthSecondBar.style["background-color"] = "#23ad5c";
    strengthThirdBar.style["background-color"] = "#23ad5c";
    strengthFourthBar.style["background-color"] = "#868686";
    strengthCaption.textContent = "Strong";
    strengthCaption.style["color"] = "#23ad5c";
}

function setVeryStrongPassword()
{
    strengthFirstBar.style["background-color"] = "#007435";
    strengthSecondBar.style["background-color"] = "#007435";
    strengthThirdBar.style["background-color"] = "#007435";
    strengthFourthBar.style["background-color"] = "#007435";
    strengthCaption.textContent = "Very Strong";
    strengthCaption.style["color"] = "#007435";
}

function setNeutralPassword()
{
    strengthFirstBar.style["background-color"] = "#868686";
    strengthSecondBar.style["background-color"] = "#868686";
    strengthThirdBar.style["background-color"] = "#868686";
    strengthFourthBar.style["background-color"] = "#868686";
    strengthCaption.textContent = "Strength";
    strengthCaption.style["color"] = "#868686";
}

// password lock helpers
function cleanUpLock()
{
    if(passwordLock.classList.contains("form-input-password-lock"))
    {
        passwordLock.classList.remove("form-input-password-lock");
    }

    if(passwordLock.classList.contains("form-input-password-lock-disabled"))
    {
        passwordLock.classList.remove("form-input-password-lock-disabled");
    }

    if(passwordLock.classList.contains("form-input-password-lock-2"))
    {
        passwordLock.classList.remove("form-input-password-lock-2");
    }

    if(passwordLock.classList.contains("form-input-password-lock-disabled-2"))
    {
        passwordLock.classList.remove("form-input-password-lock-disabled-2");
    }
}

function moveLock()
{
    if(passwordLock.classList.contains("form-input-password-lock"))
    {
        passwordLock.classList.remove("form-input-password-lock");
        passwordLock.classList.add("form-input-password-lock-2");
    } else if(passwordLock.classList.contains("form-input-password-lock-disabled"))
    {
        passwordLock.classList.remove("form-input-password-lock-disabled");
        passwordLock.classList.add("form-input-password-lock-disabled-2");
    } else if(passwordLock.classList.contains("form-input-password-lock-2"))
    {
        passwordLock.classList.remove("form-input-password-lock-2");
        passwordLock.classList.add("form-input-password-lock");
    } else if(passwordLock.classList.contains("form-input-password-lock-disabled-2"))
    {
        passwordLock.classList.remove("form-input-password-lock-disabled-2");
        passwordLock.classList.add("form-input-password-lock-disabled");
    }
}

function swapLock()
{
    if(passwordLock.classList.contains("form-input-password-lock"))
    {
        passwordLock.classList.remove("form-input-password-lock");
        passwordLock.classList.add("form-input-password-lock-disabled");
    } else if(passwordLock.classList.contains("form-input-password-lock-disabled"))
    {
        passwordLock.classList.remove("form-input-password-lock-disabled");
        passwordLock.classList.add("form-input-password-lock");
    } else if(passwordLock.classList.contains("form-input-password-lock-2"))
    {
        passwordLock.classList.remove("form-input-password-lock-2");
        passwordLock.classList.add("form-input-password-lock-disabled-2");
    } else if(passwordLock.classList.contains("form-input-password-lock-disabled-2"))
    {
        passwordLock.classList.remove("form-input-password-lock-disabled-2");
        passwordLock.classList.add("form-input-password-lock-2");
    }
}

function enableLock()
{
    if(lockStatus)
    {
        if(!passwordLock.classList.contains("form-input-password-lock"))
        {
            passwordLock.classList.add("form-input-password-lock");
        }
    } else {
        if(!passwordLock.classList.contains("form-input-password-lock-disabled"))
        {
            passwordLock.classList.add("form-input-password-lock-disabled");
        }
    }
}