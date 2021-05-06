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
  const postResponse = await fetch(url + '/post', fetchOptions);
  const post = await postResponse.json();

  addForm.remove();

  const addRecipe = document.createElement('button');
  addRecipe.setAttribute("id", "addRecipe");
  addRecipe.className = "add-recipe";
  addRecipe.type = "submit";
  addRecipe.innerHTML = "Add recipe?";

  const noRecipe = document.createElement('button');
  noRecipe.setAttribute("id", "dontAddRecipe");
  noRecipe.className = "add-recipe";
  noRecipe.type = "submit";
  noRecipe.innerHTML = "Don't add and post!";

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

    const workphaseForm = document.createElement('form');
    ingredientForm.setAttribute("id","workphase-form");

    createIngredientInputRow(ingredientForm);

    fromWrapper.appendChild(ingredientForm);
    fromWrapper.appendChild(workphaseForm);

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
      await addIngredient(data, post.postId);
      clearInputs(ingredientForm);
      await getRecipeIngredient(post.postId, recipeIngredients);
    });

    const doneButton = document.createElement('button');
    doneButton.setAttribute('id', 'doneButton');
    doneButton.className = "addPostButton";
    doneButton.innerHTML = "Done";

    const workphaseInput = document.createElement('input');
    workphaseInput.name = 'workphases';
    workphaseInput.id = 'workphaseInput';
    workphaseInput.placeholder = 'Add ingredients first then write the workspaces here';

    const donePost = document.createElement('button');
    donePost.setAttribute('id', 'addPhases');
    donePost.className = "addPostButton";
    donePost.innerHTML = "Post!";

    ingredientForm.appendChild(recipeIngredients);
    workphaseForm.appendChild(workphaseInput);
    workphaseForm.appendChild(donePost);

    workphaseForm.addEventListener('submit', async (evt) => {
      evt.preventDefault();
      const data = serializeJson(workphaseForm);
      if (data.workphases !== "") {
        await addWorkphases(data, post.postId);
      }
      window.location.href = 'http://localhost:3000/'

    });
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

const addIngredient = async (data, post) =>{
  try {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    };
    await fetch(url + '/post/ingredient/' + post, fetchOptions);
  }
  catch (e) {
    console.log(e.message);
  }
};

const addWorkphases = async (data, post) =>{
  try {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    };
    await fetch(url + '/post/workphases/' + post, fetchOptions);
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

const renderWorkphases = async (id, workphaseText) => {
  const fetchOptions = {
    headers: {
      'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
    }
  };
  const response = await fetch(url + '/post/recipe/workphases/' + id, fetchOptions);
  const json = await response.json();
  workphaseText.innerHTML += json.phases + '</br>';
};

const getRecipeIngredient = async (id, recipeText) => {
  const fetchOptions = {
    headers: {
      'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
    }
  };
  const response = await fetch(url + '/post/recipe/ingredients/' + id, fetchOptions);
  const json = await response.json();

  const ingredientWrapper = document.createElement('div');
  ingredientWrapper.id = "ingredientWrapper";

  const workphaseForm = document.querySelector("#workphase-form");

  workphaseForm.appendChild(ingredientWrapper);

  const text = document.createElement('p');
  text.innerHTML = json.ingredient + ' ' + json.amount + ' ' + json.unit;

  ingredientWrapper.appendChild(text);

  const deleteIngredientBtn = document.createElement('btn');
  deleteIngredientBtn.id = "deleteIngredientBtn";

  deleteIngredientBtn.addEventListener('click', async() => {
    const fetchOptions = {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      }
    };
    await fetch(url + '/post/delete/ingredient/' + json.addOrder, fetchOptions);
    text.innerHTML = "";
    deleteIngredientBtn.remove();
  });

  ingredientWrapper.appendChild(deleteIngredientBtn);

};

getLatestPost();

// to hide login && signup
// for some reason cant use logout.js with these files,,, url doesnt work

/*if (sessionStorage.getItem('token')) {
  logOut.style.display = 'flex';
}else{
  logOut.style.display = 'none';
}*/
/*
const hamburger = document.querySelector('.hamburger');
hamburger.addEventListener('click', () => {
  const x = document.getElementById("topNav");
  console.log('clicked');
  if (x.className === "topNav") {
    x.className += " responsive";
  } else {
    x.className = "topNav";
  }
});*/