'use strict';

const showMoreBtn = document.getElementById('showMoreBtn');
const likeButton = document.querySelectorAll('#likeBtn');


let retrieved = 0;

const loadData = (posts, comments) => {

  let likes = "";
  posts.forEach( async (post) => {
    //get likeamounts
    try {
      const options = {
        headers: {
          'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },
      };
      const response = await fetch(url + '/post/likes/' + post.postId, options);
      const likesAmount = await response.json();
      likes = likesAmount.likes;
    }
    catch (e) {
      console.log(e.message);
    }

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
          
          <div id="postLikesAmount">
            <button id="likeBtn" onclick="getLikeUser('${post.postId}')">❤️</button>
            <p id="likeAmount"> ${likes} likes this </p>
          </div>
          
          <div id="postCaptionTitle">
            <p id="postCaption">${post.caption}</p>
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

    comments.forEach((comment) => {
      if(comment.postId === post.postId){

        const commentRender = document.createElement('div');
        commentRender.id = 'commentRender';
        const commentlist = document.querySelectorAll('#commentList');
        commentlist[(commentlist.length - 1)].appendChild(commentRender);

        const commenterInfo = document.createElement('div');
        commenterInfo.id = 'commenterInfo';
        commentRender.appendChild(commenterInfo);

        const userAndComment = document.createElement('div');
        userAndComment.id = 'userAndComment';
        commentRender.appendChild(userAndComment);

        const commenterName = document.createElement('a');
        commenterName.id = 'commenterName';
        commenterName.innerHTML = comment.username;

        const commentAvatar = document.createElement('img');
        commentAvatar.id = 'commentAvatar';
        commentAvatar.src = comment.avatar;
        commentAvatar.alt = "commentAvatar";
        commenterInfo.appendChild(commentAvatar);
        userAndComment.appendChild(commenterName);

        const commentCaption = document.createElement('p');
        commentCaption.id = "postComment";
        commentCaption.innerHTML= comment.comment;
        userAndComment.appendChild(commentCaption);
      }
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

    const fetchoptions = {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
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

const hamburger = document.querySelector('.hamburger');
hamburger.addEventListener('click', () => {
  const x = document.getElementById("myTopNav");
  console.log('clicked');
  if (x.className === "topNavs") {
    x.className = "responsive";
  } else {
    x.className = "topNavs";
  }
});
