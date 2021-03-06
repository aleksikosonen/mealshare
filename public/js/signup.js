/**
 * Js-file for signup function
 *
 * Validates password and user.
 *
 * @Author Aleksi Kytö, Niko Lindborg, Aleksi Kosonen
 * */

'use strict';
const url = 'https://10.114.32.16/app';
const addUserForm = document.getElementById('add-user-form');

//check if passwords match
const password = document.getElementById("password")
    , verify_password = document.getElementById("verify_password");
  
function validatePassword(){
  if(password.value !== verify_password.value) {
    verify_password.setCustomValidity("Passwords Don't Match");
  } else {
    verify_password.setCustomValidity('');
  }
};

addUserForm.addEventListener('submit', async (evt) =>{
  evt.preventDefault();
  const data = serializeJson(addUserForm);
  const fetchOptions = {
    method: 'POST',
    headers:{
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };
  const response = await fetch(url + '/auth/register', fetchOptions);
  const json = await response.json();
  
  if(!json.user) {
    alert(json.message);
  } else {
    sessionStorage.setItem('token', json.token);
    window.location.href = `${url}/index.html`;
  }
});
password.onfocus = function() {
  document.getElementById("PopUp").style.display = "block";
}

// When the user clicks outside of the password field, hide the message box
password.onblur = function() {
  document.getElementById("PopUp").style.display = "none";
}

password.onchange = validatePassword;
verify_password.onkeyup = validatePassword;