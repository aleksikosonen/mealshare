'use strict';
const showMoreBtn = document.getElementById('showMoreBtn');
const likeButton = document.querySelectorAll('#likeBtn');

let retrieved =  0;

const loadData = (posts) => {

  posts.forEach((post) => {
    const html = `<div class="post">
                    <article>
                    <h2>
                        <img src="${post.avatar}" alt="" id="avatar">
                        <a>${post.username}</a>
                    </h2>
                    <figure>
                       <img src="${post.file}" alt="${post.caption}">
                    </figure>
                    <a>${post.caption} &emsp;&emsp;&emsp;&emsp;&emsp; <button id="likeBtn" onclick="getLikeUser('${post.postId}')">❤️</button></a><br>
                    <a>Comments:</a>
                    </article>
                 </div>`;
    feedContainer.innerHTML += html;
  });
};

const getPosts = async () => {
  console.log('feed.js ' + retrieved);
  try {
    const options = {
      method:'POST',
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/post/feed/' + retrieved, options);
    const posts = await response.json();
    loadData(posts);
  }
  catch (e) {
    console.log(e.message);
  }
};

getPosts();

showMoreBtn.addEventListener('click',()=>{
  retrieved += 6;
  getPosts();
})

const likePost = async (postId, userId) => {
  try {
    const options = {
      method:'POST',
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    await fetch(url + '/post/feed/like/' + postId + '/' + userId, options);
  }
  catch (e) {
    console.log(e.message);
  }
};

const getLikeUser = async (postId) => {
  try {
    const options = {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const responseUser = await fetch(url + '/user', options);
    const users = await responseUser.json();

    await likePost(postId, users[0].userId);

  } catch (e) {
      console.log(e.message);
    }
}


















