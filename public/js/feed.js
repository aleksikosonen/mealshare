'use strict';

const showMoreBtn = document.getElementById('showMoreBtn');
const likeButton = document.querySelectorAll('#likeBtn');

let retrieved = 0;

const loadData = (posts, comments) => {
  const merged = [].concat.apply([], comments)
  console.log('loadData, ', posts);
  posts.forEach((post, i) => {
    const comment = merged.filter(e => e.postId === post.postId)
    const html = `
      <li class="post" data-postid=${post.postId}>
        <article id="topCard">
          <h2>
            <img src="${post.avatar}" alt="" id="avatar">
            <a>${post.username}</a>
          </h2>
          <figure id="postImage">
            <img src="${url + '/thumbnails/' + post.file}" alt="${post.caption}">
          </figure>
           <article id="bottomCard">
          
          <div id="postCaptionTitle">
            <p id="postCaption">${post.caption}</p>
            <button id="likeBtn" onclick="getLikeUser('${post.postId}')">❤️</button>
          </div>
          
          <form id="commentForm">
            <div id="commentFormInput">
              <input class="light-border" type="text" placeholder="Comment" name="comment"/>
              <button class="light-b<order" type="submit">Comment</button>
            </div>
          </form>
          
          <ul id="commentList"></ul>
          
        </article>
          </article>
      </li>
      `;
    feedContainer.innerHTML += html;
    const elements = document.querySelectorAll('#commentList');
    const commentList = elements[i];

    comment.forEach((e) => {
      
      const commentRender = document.createElement('div');
      commentRender.id = "commentRender";
      commentList.appendChild(commentRender);

      const commenter = document.createElement('div');
      commenter.id ="commenterInfo"
      commentRender.appendChild(commenter);

      const comment = document.createElement('div');
      comment.id = "userAndComment";

      commentRender.appendChild(comment);

      const commenterName = document.createElement('a');
      commenterName.innerHTML = e.username;

      const commenterAvatar = document.createElement('img');
      commenterAvatar.id = 'commentAvatar';
      commenterAvatar.src = e.avatar;
      commenter.appendChild(commenterAvatar);
      comment.appendChild(commenterName);

      const commentCaption = document.createElement('p');
      commentCaption.id = "postComment";
      commentCaption.innerHTML= e.comment;
      comment.appendChild(commentCaption)
    });
  });
  
};

feedContainer.addEventListener('submit', async (e) => {
  e.preventDefault(); 

  const id = e.target.closest('.post').dataset.postid;
  const data = serializeJson(e.target.closest('#commentForm'));
  const loggedUser = [];
  try {
    const options = {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const responseUser = await fetch(url + '/user', options);
    const users = await responseUser.json();
    loggedUser.push(users);
  } catch (e) {
      console.error(e.message);
  }
  try{
    const options = {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(url + `/post/com/${id}/${loggedUser[0][0].userId}`, options);
    const json = await response.json();
  }catch(e){
    console.error(e.message);
  }
});
const getPosts = async () => {
  try {
    const options = {
      method:'POST',
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/post/feed/' + retrieved, options);
    const posts = await response.json();

    const postIds = []
    posts.forEach(e => {postIds.push(e.postId)});
    const fetchoptions = {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postIds),
    };
    const res = await fetch(url + `/post/comm`,fetchoptions);
    const comments = await res.json(); 

    loadData(posts, comments);      
  }
  catch (e) {
    console.error(e.message);
  }
};

getPosts();
showMoreBtn.addEventListener('click',()=>{
  retrieved += 6;
  getPosts();
});

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
    console.error(e.message);
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
      console.error(e.message);
    }
}