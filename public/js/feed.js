'use strict';

const showMoreBtn = document.getElementById('showMoreBtn');
const likeButton = document.querySelectorAll('#likeBtn');
const loggedUser = [];

let retrieved = 0;

const findLoggedUser = (async () => {
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
});

findLoggedUser();

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
          <h2 id="${post.postId}">
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
              <button class="light-border" id="formButton" type="submit">Comment</button>
            </div>
          </form>

          <ul id="commentList"></ul>
          
          </article>
        </article>
      </li>
      `;
    feedContainer.innerHTML += html;

    if(loggedUser[0][0].admin === 1){
      const topCard = document.getElementById(post.postId);
      const adminDeleteButton = document.createElement('button');
      const deleteImage = document.createElement('img');

      deleteImage.className = 'deleteButton';
      adminDeleteButton.className = 'deleteContainer';
      deleteImage.src = '../icons/delete.png';
      topCard.appendChild(adminDeleteButton);
      adminDeleteButton.appendChild(deleteImage);
    }

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
        commentRender.dataset.commentid = comment.commentId;

        if(loggedUser[0][0].admin === 1 || loggedUser[0][0].userId === comment.userId){
          const adminDeleteButton = document.createElement('button');
          const deleteImage = document.createElement('img');

          deleteImage.className = 'commentDeleteButton';
          adminDeleteButton.className = 'commentDeleteContainer';
          deleteImage.src = '../icons/delete.png';
          commentRender.appendChild(adminDeleteButton);
          adminDeleteButton.appendChild(deleteImage);
        }

        const commenterName = document.createElement('a');
        commenterName.id = 'commenterName';
        commenterName.innerHTML = comment.username;

        const commentAvatar = document.createElement('img');
        commentAvatar.id = 'commentAvatar';
        commentAvatar.src = comment.avatar;
        commentAvatar.alt = 'avatar';
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
  if (x.className === "topNavs") {
    x.className = "responsive";
  } else {
    x.className = "topNavs";
  }
});

feedContainer.addEventListener('click', async (e) => {
  e.preventDefault();
  console.log(e.target)
  if(loggedUser[0][0].admin === 1){
    if (e.target.matches('.deleteButton') || e.target.matches('.deleteContainer')){
      if(confirm('Do you want to delete this post?')){
        const id = e.target.closest('.post').dataset.postid;
        console.log(id);
        try{
          const fetchOptions = {
            method: 'DELETE',
            headers: {
              'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            }
          };
          await fetch(url + '/post/' + id , fetchOptions);
          window.location.href = 'http://localhost:3000/index.html';
        }catch(er){
          console.error(e.message);
        }
      }
    }
  }
  if (e.target.matches('.commentDeleteButton') || e.target.matches('.commentDeleteContainer')){
    const commentId = e.target.closest('#commentRender').dataset.commentid;
    if(confirm('Do you want to delete this comment?')){
      try{
        const fetchOptions = {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
          }
        };
        await fetch(url + '/post/comment/' + commentId , fetchOptions);
        window.location.href = 'http://localhost:3000/index.html';
      }catch(er){
        console.error(e.message);
      }
    }
  }

  if(e.target.matches('#formButton')){
    e.preventDefault(); 
    console.log('commenting')
    const id = e.target.closest('.post').dataset.postid;
    const data = serializeJson(e.target.closest('#commentForm'));
    try{
      const options = {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },
        body: JSON.stringify(data),
      };
      const response = await fetch(url + `/post/com/${id}`, options);
      const json = await response.json();
    }catch(e){
      console.error(e.message);
    }
  }
});