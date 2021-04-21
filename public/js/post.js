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
  console.log('add response', json);
});

const updateImage = async (posts) => {
    const index = posts.length - 1;
    latestUpload.src = posts[index].file; //hardcoded to show latest upload
    captionText.innerHTML = posts[index].caption;
    console.log('postindex', posts[index]);
    postedBy.innerHTML = posts[index].userId;
}

const getLatestPost = async () => {
  try { const options = {
    headers: {
      'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
    },
  };
    console.log(options);
    const response = await fetch(url + '/post', options);
    const posts = await response.json();
    console.log('posts', posts);
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
    console.log(options);
    const response = await fetch(url + '/user', options);
    const users = await response.json();
    console.log(options);
    getUserInfo(users);
  }
  catch (e) {
    console.log(e.message);
  }
};

getLatestPost()

