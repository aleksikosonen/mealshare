
//check if passwords match
const password = document.getElementById("password")
    , verify_password = document.getElementById("verify_password");

function validatePassword(){
  if(password.value !== verify_password.value) {
    verify_password.setCustomValidity("Passwords Don't Match");
  } else {
    verify_password.setCustomValidity('');
  }
}

password.onchange = validatePassword;
verify_password.onkeyup = validatePassword;