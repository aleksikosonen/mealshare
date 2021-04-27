'use strict';
const showMoreBtn = document.getElementById('showMoreBtn');

let retrieved =  0;

const loggedUser = window.addEventListener('load', () => {

})

const loadData = (posts) => {

  posts.forEach((post) => {
    const html = `<li class="post" data-postid=${post.postId}>
                    <article>
                      <h2>
                        <img src="${post.avatar}" alt="" id="avatar">
                        <a>${post.username}</a>
                    </h2>
                    <figure>
                       <img src="${post.file}" alt="${post.caption}">
                    </figure>
                    <a>${post.caption} &emsp;&emsp;&emsp;&emsp;&emsp; <button id="likeBtn">❤️</button></a><br>
                    <form id="commentForm">
                      <div>
                        <input class="light-border" type="text" placeholder="Comment" name="comment"/>
                      </div>
                      <div>
                        <button class="light-border" type="submit">Comment</button>
                      </div>
                    </form>
                    </article>
                 </li`;
    feedContainer.innerHTML += html;
  });
  
  feedContainer.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = e.target.closest('.post').dataset.postid;
    const data = serializeJson(e.target.closest('#commentForm'));
    const loggedUser = [];
    console.log(id);
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
        console.log(e.message);
    }
    console.log(loggedUser[0][0])
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

};

const getLoggedUser = async () => {
  
}


const getPosts = async () => {
  console.log('feed.js ' + retrieved);
  try {
    const options = {
      method:'POST',
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/post/feed/' + retrieved, options);
    const posts = await response.json();
    loadData(posts);
  }
  catch (e) {
    console.log(e.message);
  }
};

getPosts();
showMoreBtn.addEventListener('click',()=>{
  retrieved += 6;
  getPosts();
});
















