const searchBar = document.querySelector('#searchBar');
const datalist = document.querySelector('#matches');
let users = [];
let tags = [];
let userMatches = [];
let tagMatches = [];
let userInput = "";

// if user focuses out on search - datalist wont work anymore

searchBar.addEventListener('keyup', (evt) => {
  if(evt.target.value.length >= 1){
    users.forEach((user)=>{
      if(!userMatches.includes(user.username)){
        userMatches.push(user.username);
        let optionElement = document.createElement("option");
        optionElement.value = user.username;
        datalist.appendChild(optionElement);
      }
    });
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

document.querySelector('#searchBtn').addEventListener('click', (evt) => {
  evt.preventDefault();
  userInput = searchBar.value;
  if(tagMatches.includes(userInput)){
    getTagRelatedPosts();
  }
  if(userMatches.includes(userInput)){
    getUserRelatedPosts();
  }
})

//for datalist
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
//for datalist
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
    if(tagRelatedPosts.length >= 1){
      feedContainer.innerHTML = "";
      loadData(tagRelatedPosts);
    }else{
      alert(`Didn't find any posts`);
    }
  }
  catch (e) {
    console.log(e.message);
  }
};

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
    if(userRelatedPosts.length >= 1){
      feedContainer.innerHTML = "";
      loadData(userRelatedPosts);
    }else{
      alert(`Didn't find any posts`);
    }
  }
  catch (e) {
    console.log(e.message);
  }
};

// if user focuses out on - search datalist wont work anymore
searchBar.addEventListener('focus', () =>{
  datalist.style.display = 'block';
});

searchBar.addEventListener('focusout', () =>{
  datalist.style.display = 'none';
});








