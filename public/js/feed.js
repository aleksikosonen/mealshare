'use strict';

const showMoreBtn = document.getElementById('showMoreBtn');
const url = 'http://localhost:3000';
//some global variables so we can get certain info from out of functions to other functions
const loggedUser = [];
const likedPosts = [];
const listOfLikes = [];

let retrieved = 0;

//function to find the logged user so we can render deletebuttons accordingly
const findLoggedUser = (async () => {
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const responseUser = await fetch(url + '/user', options);
    const users = await responseUser.json();
    loggedUser.push(users);

    const fetchOptions = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const resLikes = await fetch(url + '/user/likes', fetchOptions);
    const likes = await resLikes.json()
    likedPosts.push(likes);
  } catch (e) {
      console.error(e.message);
  }
});

findLoggedUser();

const loadData = (posts, comments, workphases, recipeIngredients, likeList) => {
//function for rendering the feed
  posts.forEach( post => {
    const commentlist = document.querySelectorAll('#commentList');
    //here we write the backbone of the posts that we display on the page
    const html = `
      <li class="post" data-postid=${post.postId}>
        <article id="topCard">
          <h2 id="${post.postId}">
            <img src="${post.avatar || "icons/def-avatar.png"}" alt="" id="avatar">
            <a>${post.username}</a>
          </h2>
          <figure id="postImage">
            <img src="${url + '/thumbnails/' + post.file}" alt="${post.caption}">
          </figure>
           <article id="bottomCard">
          
          <div id="postLikesAmount">
            <button id="likeBtn${post.postId}">
              <img id="likeImg${post.postId}" alt="heart">
            </button>
            <p id="likeAmount${post.postId}"></p>
          </div>
          
          <div id="postCaptionTitle">
            <p id="postCaption">${post.caption}</p>
          </div>
         
          <div class="buttonHolder">
            <button id="commentButton" onclick="showComments('${(commentlist.length)}')"> Comments </button>
            <button id="recipeButton" onclick="showRecipes('${(commentlist.length)}')"> Recipe </button>
          </div>
          <form id="commentForm">
            <div id="commentFormInput">
              <input class="light-border" type="text" placeholder="Comment" name="comment"/>
              <button class="light-border" id="formButton" type="submit">Comment</button>
            </div>
          </form>
          <ul id="commentList"></ul>
          <div id="recipeDiv">
            <p id="recipeIngredientsTopic"> Ingredients </p>
          </div>
          
          </article>
        </article>
      </li>
      `;
    feedContainer.innerHTML += html;

    const likes = likeList.filter(e => e.postId === post.postId);
    const likesAmount = document.getElementById(`likeAmount${post.postId}`);
    const likeImage = document.getElementById(`likeImg${post.postId}`);
    const likeButton = document.getElementById(`likeBtn${post.postId}`);
    //here we render the likes, if the post has likes in it, it renders the number of likes, if it doesn't
    //it renders "Be the first to like this"
    if(likes.length != 0){
      likesAmount.innerHTML = `${likes[0].likes} likes this`;
    }else{
      likesAmount.innerHTML = 'Be the first to like this';
    }

    //here we render the like button, depending on whether the logged in user has liked that particular post
    //or not
    const userLikes = [];
    likedPosts[0].forEach(e => userLikes.push(e.postId));
    if(userLikes.includes(post.postId)){
      likeImage.src = '../icons/like-2.png';
      likeImage.className = 'alreadyLiked';
      likeButton.className = 'alreadyLiked';
    }else{
      likeImage.src ='../icons/like-1.png';
      likeImage.className = 'notLiked';
      likeButton.className = 'notLiked';
    }

    //if the logged in user is an admin, we render the delete buttons for the posts
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
      for(let i = 0; i < comment.length; i++){
      //here we render the comments for the posts
        if(comment[i].postId === post.postId){
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
          commentRender.dataset.commentid = comment[i].commentId;

        //here we render the comment delete buttons, if the logged user is admin or if the
        //comment in question is the logged in users comment
          if(loggedUser[0][0].admin === 1 || loggedUser[0][0].userId === comment[i].userId){
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
          commenterName.innerHTML = comment[i].username;

          const commentAvatar = document.createElement('img');
          commentAvatar.id = 'commentAvatar';
          commentAvatar.src = comment[i].avatar || "icons/def-avatar.png";
          commentAvatar.alt = 'avatar';
          commenterInfo.appendChild(commentAvatar);
          userAndComment.appendChild(commenterName);

          const commentCaption = document.createElement('p');
          commentCaption.id = "postComment";
          commentCaption.innerHTML= comment[i].comment;
          userAndComment.appendChild(commentCaption);
      }
    }
    });

    const recipeDiv = document.querySelectorAll('#recipeDiv');
    recipeDiv[(recipeDiv.length - 1)].style.display = 'none';

    //here we render the recipes for the posts

    recipeIngredients.forEach((ingredient) => {
      for(let i = 0; i < ingredient.length; i++){
        if(ingredient[i].postId === post.postId){
          const recipeDiv = document.querySelectorAll('#recipeDiv');

          const ingredientsDiv = document.createElement('div');
          ingredientsDiv.id = 'ingredientsDiv';
          recipeDiv[(recipeDiv.length - 1)].appendChild(ingredientsDiv);

          const ingredientText = document.createElement('p');
          ingredientText.id = 'ingredientText';
          ingredientText.innerHTML = ingredient[i].ingredient;

          const ingredientAmount = document.createElement('p');
          ingredientAmount.id = 'ingredientAmount';
          ingredientAmount.innerHTML = ingredient[i].amount;

          const ingredientUnit = document.createElement('p');
          ingredientUnit.id = 'ingredientUnit';
          ingredientUnit.innerHTML = ingredient[i].unit;

          ingredientsDiv.appendChild(ingredientText);
          ingredientsDiv.appendChild(ingredientAmount);
          ingredientsDiv.appendChild(ingredientUnit);
          recipeDiv[(recipeDiv.length - 1)].style.display = 'none';
        }
      }
    });
    //and here we render the workphases related to the recipes
    workphases.forEach((workphase) => {
      if(workphase[0].postId === post.postId){
        const recipeDiv = document.querySelectorAll('#recipeDiv');

        const workphaseTopic = document.createElement('p');
        workphaseTopic.id = 'recipeWorkPhaseTopic';
        workphaseTopic.innerHTML = 'Work Phases'

        const workphaseText = document.createElement('p');
        workphaseText.id = 'recipeWorkPhases';
        workphaseText.innerHTML = workphase[0].phases;

        recipeDiv[(recipeDiv.length - 1)].appendChild(workphaseTopic);
        recipeDiv[(recipeDiv.length - 1)].appendChild(workphaseText);
        recipeDiv[(recipeDiv.length - 1)].style.display = 'none';
      }
    });
  });
};

  //large function where we get all the infos needed for the post
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

    const postIds = [];

    posts.forEach(post => {
      postIds.push(post.postId);
    });

    //first we get the posts
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

    //then the comments
    const wpOptions = {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postIds),
    };
    const wpResponse = await fetch(url + `/post/recipe/allworkphases`,wpOptions);
    const workphases = await wpResponse.json();
    //then the workphases

    const recipeOptions = {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postIds),
    };
    const recipeResponse = await fetch(url + `/post/recipe/allingredientsfeed/`,recipeOptions);
    const recipeIngredients = await recipeResponse.json();
    //then the recipe ingredients
    
    const likeOptions = {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(posts),
    };
    const likesResponse = await fetch(url + '/post/likes', likeOptions);
    const likesAmount = await likesResponse.json();
    listOfLikes.push(likesAmount);
    //then the likes
    loadData(posts, comments, workphases, recipeIngredients, likesAmount);
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


let comment = true;

const showComments = (i) =>{
  const commentlist = document.querySelectorAll('#commentList');
  const recipeDiv = document.querySelectorAll('#recipeDiv');
  commentlist[i].style.display = 'block';
  recipeDiv[i].style.display = 'none';
}

const showRecipes = (i) => {
  const commentlist = document.querySelectorAll('#commentList');
  const recipeDiv = document.querySelectorAll('#recipeDiv');
  commentlist[i].style.display = 'none';
  recipeDiv[i].style.display = 'block';
}

//hamburger for the nav bar
const hamburger = document.querySelector('.hamburger');
hamburger.addEventListener('click', () => {
  const x = document.getElementById("topNav");
  if (x.className === "topNav") {
    x.className += " responsive";
  } else {
    x.className = "topNav";
  }
});

//monstrous eventListener for all buttons in feedContainer
feedContainer.addEventListener('click', async (e) => {
  const postId = e.target.closest('.post').dataset.postid;

  if(loggedUser[0][0].admin === 1){
    if (e.target.matches('.deleteButton') || e.target.matches('.deleteContainer')){
      //the admin deletebutton
      if(confirm('Do you want to delete this post?')){
        try{
          const fetchOptions = {
            method: 'DELETE',
            headers: {
              'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            }
          };
          await fetch(url + '/post/' + postId , fetchOptions);
          window.location.href = 'http://localhost:3000/index.html';
        }catch(er){
          console.error(e.message);
        }
      }
    }
  }

  if (e.target.matches('.commentDeleteButton') || e.target.matches('.commentDeleteContainer')){
    //the admin and the user deletebuttons
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
    //commenting form button
    e.preventDefault();
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
      const response = await fetch(url + `/post/com/${postId}`, options);
    }catch(e){
      console.error(e.message);
    }
  }

  if(e.target.matches('.notLiked')){
    e.preventDefault();
    //the like button
    try {

      const options = {
        method:'POST',
        headers: {
          'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },
      };
      const like = await fetch(url + '/post/feed/like/' + postId, options);

      const likeImage = document.getElementById(`likeImg${postId}`);
      const likeButton = document.getElementById(`likeBtn${postId}`);
      const fetchOptions = {
        headers: {
          'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },
      };
      const resLike = await fetch(url + '/post/feed/like/' + postId, fetchOptions);

      const likes = await resLike.json();
      const likesAmount = document.getElementById(`likeAmount${postId}`);
      //once user has liked, re render the likes and change buttons class
      likeImage.src = '../icons/like-2.png';
      likeImage.className = 'alreadyLiked';
      likeButton.className = 'alreadyLiked';
      likesAmount.innerHTML = `${likes[0].likes} likes this`;
    }
    catch (e) {
      console.error(e.message);
    }
  }else if(e.target.matches('.alreadyLiked')){
    e.preventDefault();
    //the like button once your logged in user has liked, in which case its remove like button
    try {
      const options = {
        method:'DELETE',
        headers: {
          'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },
      };
      const like = await fetch(url + '/post/feed/like/' + postId, options);

      const fetchOptions = {
        headers: {
          'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },
      };
      const resLike = await fetch(url + '/post/feed/like/' + postId, fetchOptions);

      const likes = await resLike.json();

      const likeImage = document.getElementById(`likeImg${postId}`);
      const likeButton = document.getElementById(`likeBtn${postId}`);
      const likesAmount = document.getElementById(`likeAmount${postId}`);
      //once the user has removed the likes, re-render and change the button class
      likeImage.src = '../icons/like-1.png';
      likeImage.className = 'notLiked';
      likeButton.className = 'notLiked';
      if(likes[0].likes > 0){
        likesAmount.innerHTML = `${likes[0].likes} likes this`;
      }else{
        likesAmount.innerHTML = 'Be the first to like this';
      }
    }catch(e){
      console.error(e.message);
    }
  }
});