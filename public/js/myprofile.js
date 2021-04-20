'use strict';

const url = 'http://localhost:3000';

const username = document.querySelector('#username');
const bio = document.querySelector('#bio');

const loggedId = 3; // at this point this info is hardcoded

const getUserInfo = (users) => {
    users.forEach((user) => {
        username.innerHTML = user.username;
        bio.innerHTML = user.bio;
    });
}

const getUsers = async () => {
    try {
        const response = await fetch(url + '/user/');
        const users = await response.json();
        console.log(users);
        getUserInfo(users);
    }
    catch (e) {
        console.log(e.message);
    }
};

const getLoggedUser = async () => {
    try {
        const response = await fetch(url + '/user/' + loggedId);
        const users = await response.json();
        console.log(users);
        getUserInfo(users);
    }
    catch (e) {
        console.log(e.message);
    }
};

//getUsers();
getLoggedUser();