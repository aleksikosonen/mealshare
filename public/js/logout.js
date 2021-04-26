const logIn = document.querySelector('#logIn');
const logOut = document.querySelector('#logOut');
const signUp = document.querySelector('#signUp');
const landContainer = document.querySelector('#landContainer');
const feedContainer = document.querySelector('#feedContainer')
const body = document.querySelector('body');
const layer = document.querySelector('#layer')
const url = 'http://localhost:3000';

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
    landContainer.style.display = 'flex';
    feedContainer.style.display = 'none';
    layer.style.height = '100%';
  }
  catch (e) {
    console.log('logout error' + e.message);
  }
});

//if logged in hide log in and signup
if (sessionStorage.getItem('token')) {
  logIn.style.display = 'none';
  signUp.style.display = 'none';
  logOut.style.display = 'flex';
  landContainer.style.display = 'none';
  feedContainer.style.display = 'flex';
  layer.style.height = 'auto';
}else{
  logOut.style.display = 'none';
  feedContainer.style.display ='none';
}



