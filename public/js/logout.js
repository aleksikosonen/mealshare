/**
 * Js-file for log out function
 *
 * Log user out and remove token.
 * also hide / show selected elements depending on
 * is user logged in or our
 *
 * @Author Aleksi Kytö, Niko Lindborg, Aleksi Kosonen
 * */

'use strict';

const logOut = document.querySelector('#logOut');
const showMore = document.querySelector('#showMoreBtn');
const landContainer = document.querySelector('#landContainer');
const feedContainer = document.querySelector('#feedContainer')
const topnav = document.querySelector('.topNav');
const hexas = document.querySelector('#hexas');

//logout when clicked logout button
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

    // remove token
    sessionStorage.removeItem('token');
    alert('You have logged out');
    window.location.href = 'http://localhost:3000/index.html'
  }
  catch (e) {
    console.log('logout error' + e.message);
  }
});

//if logged in/out hide/show selected items
if (sessionStorage.getItem('token')) {
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
