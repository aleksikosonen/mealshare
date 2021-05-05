'use strict';

const showMoreBtn = document.getElementById('showMoreBtn');


let retrieved = 0;

const loadData = (posts, comments, workphases, recipeIngredients) => {

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

    const commentlist = document.querySelectorAll('#commentList');

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
         
          <div class="buttonHolder">
            <button id="commentButton" onclick="showComments('${(commentlist.length)}')"> Comments </button>
            <button id="recipeButton" onclick="showRecipes('${(commentlist.length)}')"> Recipe </button>
          </div>
          <form id="commentForm">
            <div id="commentFormInput">
              <input class="light-border" type="text" placeholder="Comment" name="comment"/>
              <button class="light-b<order" type="submit">Comment</button>
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
        commenterInfo.appendChild(commentAvatar);
        userAndComment.appendChild(commenterName);

        const commentCaption = document.createElement('p');
        commentCaption.id = "postComment";
        commentCaption.innerHTML= comment.comment;
        userAndComment.appendChild(commentCaption);
      }
    });

    recipeIngredients.forEach((ingredient) => {
      if(ingredient.postId === post.postId){
        const recipeDiv = document.querySelectorAll('#recipeDiv');

        const ingredientsDiv = document.createElement('div');
        ingredientsDiv.id = 'ingredientsDiv';
        recipeDiv[(recipeDiv.length - 1)].appendChild(ingredientsDiv);

        const ingredientText = document.createElement('p');
        ingredientText.id = 'ingredientText';
        ingredientText.innerHTML = ingredient.ingredient;

        const ingredientAmount = document.createElement('p');
        ingredientAmount.id = 'ingredientAmount';
        ingredientAmount.innerHTML = ingredient.amount;

        const ingredientUnit = document.createElement('p');
        ingredientUnit.id = 'ingredientUnit';
        ingredientUnit.innerHTML = ingredient.unit;

        ingredientsDiv.appendChild(ingredientText);
        ingredientsDiv.appendChild(ingredientAmount);
        ingredientsDiv.appendChild(ingredientUnit);
        recipeDiv[(recipeDiv.length - 1)].style.display = 'none';
      }
    });

    workphases.forEach((workphase) => {
      if(workphase.postId === post.postId){
          const recipeDiv = document.querySelectorAll('#recipeDiv');

          const workphaseTopic = document.createElement('p');
          workphaseTopic.id = 'recipeWorkPhaseTopic';
          workphaseTopic.innerHTML = 'Work Phases'

          const workphaseText = document.createElement('p');
          workphaseText.id = 'recipeWorkPhases';
          workphaseText.innerHTML = workphase.phases;

          recipeDiv[(recipeDiv.length - 1)].appendChild(workphaseTopic);
          recipeDiv[(recipeDiv.length - 1)].appendChild(workphaseText);
          recipeDiv[(recipeDiv.length - 1)].style.display = 'none';
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

    const wpOptions = {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
    };
    const wpResponse = await fetch(url + `/post/recipe/allworkphases`,wpOptions);
    const workphases = await wpResponse.json();

    const recipeOptions = {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
    };
    const recipeResponse = await fetch(url + `/post/recipe/allingredientsfeed/`,recipeOptions);
    const recipeIngredients = await recipeResponse.json();


    loadData(posts, comments, workphases, recipeIngredients);
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

const hamburger = document.querySelector('.hamburger');
hamburger.addEventListener('click', () => {
  const x = document.getElementById("topNav");
  console.log('clicked');
  if (x.className === "topNav") {
    x.className += " responsive";
  } else {
    x.className = "topNav";
  }
});

