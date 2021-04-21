'use strict';

const url = 'http://localhost:3000';

const username = document.querySelector('#username');
const bio = document.querySelector('#bio');

const loggedId = 4; // at this point this info is hardcoded

const getUserInfo = (users) => {
    //done with foreach if in some case would need to handle multiple users
    users.forEach((user) => {
        username.innerHTML = user.username;
        bio.innerHTML = user.bio;
    });
}

const getUsers = async () => {
    //If is needed to handle multiple users
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

const getUsers = async () => {
    try {
        const options = {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            },
        };
        const response = await fetch(url + '/user', options);
        const users = await response.json();
        getUserInfo(users);
    }
    catch (e) {
        console.log(e.message);
    }
};

//getUsers();
//getLoggedUser();
//getUsers(); //should work when logged in successfully