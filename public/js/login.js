const loginWrapper = document.querySelector('#login-wrapper');
const loginForm = document.querySelector('#login-form');
const url = 'http://localhost:3000';

// login
loginForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const data = serializeJson(loginForm);
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  const response = await fetch(url + '/auth/login', fetchOptions);
  const json = await response.json();
  console.log('login response', json);
  if (!json.user) {
    alert(json.message);
  } else {
    sessionStorage.setItem('token', json.token);
    loginWrapper.style.display = 'none';
    console.log(`Hello ${json.user.fname}`);
  }
});

