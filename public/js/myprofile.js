'use strict';

const url = 'http://localhost:3000';

const username = document.querySelector('#username');
const bio = document.querySelector('#bio');
const photoContainer = document.querySelector('#photoContainer');

const getUserInfo = (users) => {
    //done with foreach if in some case would need to handle multiple users
    users.forEach((user) => {
        username.innerHTML = user.username;
        bio.innerHTML = user.bio;
    });
}

const getUserImages = (posts, loggedUser) => {
    const userPhotos = posts.filter(user => user.userId === loggedUser[0].userId);
    userPhotos.reverse();
    userPhotos.forEach((post) => {
        const photo = document.createElement("img");
        photo.src = post.file;
        photo.alt = post.caption;
        photo.className = "profilePhotoGrid";
        photoContainer.appendChild(photo);
    });
}

const getMyProfile = async () => {
    try {
        const options = {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            },
        };
        const responsePost = await fetch(url + '/post', options);
        const posts = await responsePost.json();

        const responseUser = await fetch(url + '/user', options);
        const users = await responseUser.json();

        getUserInfo(users);
        getUserImages(posts, users);
    }
    catch (e) {
        console.log(e.message);
    }
};

getMyProfile();