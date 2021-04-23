'use strict';

const url = 'http://localhost:3000';

const addForm = document.querySelector('#add-post-form');
const ingredientForm = document.querySelector('#add-ingredient-form');
const latestUpload = document.querySelector('#latestUpload');
const captionText = document.querySelector('#captionText');
const postedBy = document.querySelector('#postedBy');
const addRecipe = document.querySelector('#addRecipe');
const uploadRecipe = document.querySelector('#uploadRecipe');


addForm.addEventListener('submit', async (evt) => {
  console.log('add post form');
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
  //window.location.href = 'http://localhost:3000/post.html'
});

ingredientForm.addEventListener('submit', async (evt) => {
  console.log('recipe form');
  evt.preventDefault();

  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const responseRecipe = await fetch(url + '/post/recipe', options);
    const recipes = await responseRecipe.json();

    const responseUser = await fetch(url + '/user', options);
    const users = await responseUser.json();

    const responsePost = await fetch(url + '/post', options);
    const posts = await responsePost.json();

    const latestPostByLoggedUser = posts.filter(user => user.userId === users[0].userId).pop().postId;
    const latestRecipeByLoggedUser = recipes.filter(recipe => recipe.postId === latestPostByLoggedUser).pop().recipeId

    console.log('latest recipe', latestRecipeByLoggedUser);

    const data = serializeJson(ingredientForm);

    const fetchOptions = {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    };
    console.log(data);
    const response = await fetch(url + '/post/ingredient/' + latestRecipeByLoggedUser, fetchOptions);
    console.log('response ', response);
    const json = await response.json();
    console.log('lisätty ainesosa', json);
  }
  catch (e) {
    console.log(e.message);
  }
});

addRecipe.addEventListener('click', (evt) => {
  evt.preventDefault();
  getMyProfile();
});

const setRecipeToPost = async (posts, logged) => {
  const latestPost = posts.filter(user => user.userId === logged[0].userId).pop();
  console.log(latestPost.postId);
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
    }
  };
  const response = await fetch(url + '/post/recipe/' + latestPost.postId, fetchOptions);
  const json = await response.json();
  console.log(json);
};

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

const getPostInfo = (posts) => {
    const index = posts.length - 1;
    postedBy.innerHTML = posts[index].Poster;
}

const getUsers = async () => {
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const responsePost = await fetch(url + '/post/postedBy', options);
    const posts = await responsePost.json();
    getPostInfo(posts);
  }
  catch (e) {
    console.log(e.message);
  }
};

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

    setRecipeToPost(posts, users);
  }
  catch (e) {
    console.log(e.message);
  }
};

getLatestPost();

