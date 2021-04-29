'use strict';

const url = 'http://localhost:3000';
const addForm = document.querySelector('#add-post-form');
const latestUpload = document.querySelector('#latestUpload');
const captionText = document.querySelector('#captionText');
const postedBy = document.querySelector('#postedBy');
const fromWrapper = document.querySelector('.form-wrapper');

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
  await fetch(url + '/post', fetchOptions);

  addForm.remove();

  const addRecipe = document.createElement('button');
  addRecipe.setAttribute("id", "addRecipe");
  addRecipe.className = "light-border";
  addRecipe.type = "submit";
  addRecipe.innerHTML = "Add recipe?";

  const noRecipe = document.createElement('button');
  noRecipe.setAttribute("id", "dontAddRecipe");
  noRecipe.className = "light-border";
  noRecipe.type = "submit";
  noRecipe.innerHTML = "Don't add and post!?";

  fromWrapper.appendChild(addRecipe);
  fromWrapper.appendChild(noRecipe);

  noRecipe.addEventListener('click', () => {
    window.location.href = 'http://localhost:3000/post.html'
  });

  addRecipe.addEventListener('click', (evt) => {
    evt.preventDefault();
    addRecipe.remove();
    noRecipe.remove();

    const ingredientForm = document.createElement('form');
    ingredientForm.setAttribute("id","add-ingredient-form");

    createIngredientInputRow(ingredientForm);

    fromWrapper.appendChild(ingredientForm);

    const addIngredientBtn = document.createElement('button');
    addIngredientBtn.setAttribute('id', 'addIngredient');
    addIngredientBtn.type = 'submit';
    addIngredientBtn.innerHTML = "Add ingredient";

    ingredientForm.appendChild(addIngredientBtn);

    const recipeIngredients = document.createElement('p');
    recipeIngredients.innerHTML = "";

    ingredientForm.addEventListener('submit', async (evt) => {
      evt.preventDefault();
      const data = serializeJson(ingredientForm);
      await addIngredient(data);
      clearInputs(ingredientForm);
      await getRecipeIngredients(recipeIngredients);
    });

    const doneButton = document.createElement('button');
    doneButton.setAttribute('id', 'doneButton');
    doneButton.innerHTML = "Done";

    ingredientForm.appendChild(doneButton);
    ingredientForm.appendChild(recipeIngredients);

    doneButton.addEventListener('click', () => {
      window.location.href = 'http://localhost:3000/post.html'
    })

  });
});

const createIngredientInputRow = (ingredientForm) => {
  const ingredient = document.createElement('input');
  ingredient.name = 'ingredient';
  ingredient.placeholder = "ingredient";
  ingredient.type = "text";

  const amount = document.createElement('input');
  amount.placeholder = "amount";
  amount.name = "amount";
  amount.type = "number";

  const unit = document.createElement('input');
  unit.placeholder = "unit";
  unit.name = "unit";
  unit.type = "text";

  ingredientForm.appendChild(ingredient);
  ingredientForm.appendChild(amount);
  ingredientForm.appendChild(unit);
}

const clearInputs = (form) => {
  form.reset();
};

const addIngredient = async (data) =>{
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };

    const responseUser = await fetch(url + '/user', options);
    const users = await responseUser.json();

    const responsePost = await fetch(url + '/post', options);
    const posts = await responsePost.json();

    const latestPostByLoggedUser = posts.filter(user => user.userId === users[0].userId).pop().postId;

    const fetchOptions = {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    };
    await fetch(url + '/post/ingredient/' + latestPostByLoggedUser, fetchOptions);
  }
  catch (e) {
    console.log(e.message);
  }
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
    await getUsers();
  }
  catch (e) {
    console.log(e.message);
  }
};

const getPostInfo = (posts) => {
  const index = posts.length - 1;
  console.log('posteri', posts[index].Poster);
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

const getRecipeIngredients = async (recipeText) => {
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };

    const responseUser = await fetch(url + '/user', options);
    const users = await responseUser.json();

    const responsePost = await fetch(url + '/post', options);
    const posts = await responsePost.json();

    const latestPostByLoggedUser = posts.filter(user => user.userId === users[0].userId).pop().postId;

    await getRecipeIngredient(latestPostByLoggedUser, recipeText);
  }
  catch (e) {
    console.log(e.message);
  }
};

const getRecipeIngredient = async (id, recipeText) => {
  const fetchOptions = {
    headers: {
      'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
    }
  };
  const response = await fetch(url + '/post/recipe/ingredients/' + id, fetchOptions);
  const json = await response.json();
  recipeText.innerHTML += json.ingredient + '\n';
};

getLatestPost();

// to hide login && signup
// for some reason cant use logout.js with these files,,, url doesnt work
if (sessionStorage.getItem('token')) {
  logIn.style.display = 'none';
  signUp.style.display = 'none';
  logOut.style.display = 'flex';
}else{
  logOut.style.display = 'none';
}