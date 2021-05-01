const logIn = document.querySelector('#logIn');
const logOut = document.querySelector('#logOut');
const showMore = document.querySelector('#showMoreBtn');
const signUp = document.querySelector('#signUp');
const landContainer = document.querySelector('#landContainer');
const feedContainer = document.querySelector('#feedContainer')
const layer = document.querySelector('#layer')
const topnav = document.querySelector('.topNav');
const hexas = document.querySelector('#hexas');
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
    //logIn.style.display = 'block';
    signUp.style.display = 'flex';
    logOut.style.display = 'none';
    topnav.style.display = 'none';
    landContainer.style.display = 'flex';
    feedContainer.style.display = 'none';
    layer.style.height = '100%';
    window.location.href = 'http://localhost:3000/index.html'
  }
  catch (e) {
    console.log('logout error' + e.message);
  }
});

//if logged in hide log in and signup
if (sessionStorage.getItem('token')) {
  signUp.style.display = 'none';
  logOut.style.display = 'flex';
  landContainer.style.display = 'none';
  feedContainer.style.display = 'flex';
  layer.style.height = 'auto';
  hexas.style.display = 'none';
}else{
  showMore.style.display='none';
  logOut.style.display = 'none';
  topnav.style.display = 'none';
  feedContainer.style.display ='none';
  landContainer.style.display ='flex';
}



