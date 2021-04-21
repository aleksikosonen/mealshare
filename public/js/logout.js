const logIn = document.querySelector('#logIn');
const logOut = document.querySelector('#logOut');
const signUp = document.querySelector('#signUp');
const url = 'http://localhost:3000';

//if logged in hide log in and signup
if (sessionStorage.getItem('token')) {
  logIn.style.display = 'none';
  signUp.style.display = 'none';
  logOut.style.display = 'block';
}else{
  logOut.style.display = 'none';
}

//logout
logOut.addEventListener('click', async (evt) => {
  evt.preventDefault();
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/auth/logout', options);
    const json = await response.json();

    console.log('logout json response', json);

    // remove token
    sessionStorage.removeItem('token');
    alert('You have logged out');
    logIn.style.display = 'flex';
    signUp.style.display = 'flex';
    logOut.style.display = 'none';
  }
  catch (e) {
    console.log(e.message);
  }
});