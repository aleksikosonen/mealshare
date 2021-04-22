'use strict';

const url = 'http://localhost:3000';

const addForm = document.querySelector('#add-post-form');
const latestUpload = document.querySelector('#latestUpload');
const captionText = document.querySelector('#captionText');
const postedBy = document.querySelector('#postedBy');

addForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const fd = new FormData(addForm);
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
    },
    body: fd,
  };
  const response = await fetch(url + '/post', fetchOptions);
  const json = await response.json();
});

const updateImage = (posts) => {
    const index = posts.length - 1;
    latestUpload.src = posts[index].file; //hardcoded to show latest upload
    captionText.innerHTML = posts[index].caption;
    postedBy.innerHTML = posts[index].userId;
}

const getLatestPost = async () => {
  try {
    const options = {
    headers: {
      'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
    },
  };
    const response = await fetch(url + '/post', options);
    const posts = await response.json();
    updateImage(posts);
    getUsers();
  }
  catch (e) {
    console.log(e.message);
  }
};

const getUserInfo = (users) => {
  users.forEach((user) => {
    postedBy.innerHTML = user.username;
  });
}

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

getLatestPost();

