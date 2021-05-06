const searchBar = document.querySelector('#searchBar');
const datalist = document.querySelector('#matches');
let users = [];
let tags = [];
let userMatches = [];
let tagMatches = [];
let userInput = "";


// listen to input, if user presses any key, show options related to input
searchBar.addEventListener('keyup', (evt) => {
  if(evt.target.value.length >= 1){
    //add all found users to datalist
    users.forEach((user)=>{
      if(!userMatches.includes(user.username)){
        userMatches.push(user.username);
        let optionElement = document.createElement("option");
        optionElement.value = user.username;
        datalist.appendChild(optionElement);
      }
    });
    //add all found tags to datalist
    tags.forEach((tag)=>{
      if(!tagMatches.includes(tag.tag)){
        tagMatches.push(tag.tag);
        let optionElement = document.createElement("option");
        optionElement.value = tag.tag;
        datalist.appendChild(optionElement);
      }
    });
    if(evt.keyCode === 13){
      evt.preventDefault();
      document.getElementById("searchBtn").click();
    }
  }
});

//on click get posts related to input in feed
document.querySelector('#searchBtn').addEventListener('click', (evt) => {
  evt.preventDefault();
  userInput = searchBar.value;
  if(tagMatches.includes(userInput)){
    getTagRelatedPosts();
    showMoreBtn.style.display = 'none';
  }
  if(userMatches.includes(userInput)){
    getUserRelatedPosts();
    showMoreBtn.style.display = 'none';
  }
})

//load all users for datalist to help users find others.
const loadUsers = async () => {
  try {
    const options = {
      method:'POST',
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/user/username', options);
    users = await response.json();
  }
  catch (e) {
    console.log(e.message);
  }
};

//load all hashtags for datalist to help users find others.
const loadHashtags = async () => {
  try {
    const options = {
      method:'POST',
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/post/tag', options);
    tags = await response.json();
  }
  catch (e) {
    console.log(e.message);
  }
};

loadUsers();
loadHashtags();

//get all posts found by inputted tag
const getTagRelatedPosts = async () => {
  const data = {userInput : userInput};
  try {
    const options = {
      method:'POST',
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(url + '/post/tagmatches/', options);
    const tagRelatedPosts = await response.json();

    //if found any posts clear feed from posts and add selected posts there
    //using postId to find right comments, recipes etc..
    if(tagRelatedPosts.length >= 1){
      feedContainer.innerHTML = "";

      const postIds = [];

      tagRelatedPosts.forEach(post => {
        postIds.push(post.postId);
      });

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
        body: JSON.stringify(postIds),
      };
      const wpResponse = await fetch(url + `/post/recipe/allworkphases`,wpOptions);
      const workphases = await wpResponse.json();

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

      const likeOptions = {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tagRelatedPosts),
      };
      const likesResponse = await fetch(url + '/post/likes', likeOptions);
      const likesAmount = await likesResponse.json();
      listOfLikes.push(likesAmount);

      loadData(tagRelatedPosts, comments, workphases, recipeIngredients, likesAmount);
    }else{
      alert(`Didn't find any posts`);
    }
  }
  catch (e) {
    console.log(e.message);
  }
};

//get all posts found by inputted username
const getUserRelatedPosts = async () => {
  const data = {userInput : userInput};
  try {
    const options = {
      method:'POST',
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(url + '/post/usermatches/', options);
    const userRelatedPosts = await response.json();

    //if found any posts clear feed from posts and add selected posts there
    //using postId to find right comments, recipes etc..
    if(userRelatedPosts.length >= 1){
      feedContainer.innerHTML = "";

      const postIds = [];

      userRelatedPosts.forEach(post => {
        postIds.push(post.postId);
      });

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
        body: JSON.stringify(postIds),
      };
      const wpResponse = await fetch(url + `/post/recipe/allworkphases`,wpOptions);
      const workphases = await wpResponse.json();

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

      const likeOptions = {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userRelatedPosts),
      };
      const likesResponse = await fetch(url + '/post/likes', likeOptions);
      const likesAmount = await likesResponse.json();
      listOfLikes.push(likesAmount);

      loadData(userRelatedPosts, comments, workphases, recipeIngredients, likesAmount);
    }else{
      alert(`Didn't find any posts`);
    }
  }
  catch (e) {
    console.log(e.message);
  }
};

//hide / show datalist if user either clicks on it or out of it
searchBar.addEventListener('focus', () =>{
  datalist.style.visibility = 'visible';
});

searchBar.addEventListener('focusout', () =>{
  datalist.style.visibility = 'hidden';
});








