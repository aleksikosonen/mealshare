'use strict';
const url = 'http://localhost:3000';
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
  console.log(data);
  const response = await fetch(url + '/auth/register', fetchOptions);
  const json = await response.json();
  
  if(!json.user) {
    alert(json.message);
  } else {
    sessionStorage.setItem('token', json.token);
    window.location.href = 'http://localhost:3000/index.html';
  }
});

password.onchange = validatePassword;
verify_password.onkeyup = validatePassword;