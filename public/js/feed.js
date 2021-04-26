'use strict';
const showMoreBtn = document.getElementById('showMoreBtn');

let retrieved =  1;

const loadData = (posts) => {
  posts.forEach((post) => {
    const html = `<div class="post">
                    <article>
                    <h2>${post.userId}</h2>
                    <figure>
                       <img src="${post.file}" alt="${post.caption}">
                    </figure>
                    <a>${post.caption} &emsp;&emsp;&emsp;&emsp;&emsp; ❤️:xxx</a><br>
                    <a>Comments:</a>
                    </article>
                 </div>`;
    feedContainer.innerHTML += html;
  });
};

const getLatestPosts = async () => {
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

getLatestPosts();

showMoreBtn.addEventListener('click',(evt)=>{
  retrieved += 6;
  getLatestPosts();
})
















