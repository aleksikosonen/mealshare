'use strict';

const url = 'http://localhost:3000';

const username = document.querySelector('#username');
const bio = document.querySelector('#bio');
const avatar = document.querySelector('#avatar');
const photoContainer = document.querySelector('#photoContainer');
const settingsButton = document.querySelector('#userSsettings');
const body = document.querySelector('body');

const getUserInfo = (users) => {
    //done with foreach if in some case would need to handle multiple users
    users.forEach((user) => {
        avatar.src = user.avatar;
        username.innerHTML = user.username;
        bio.innerHTML = user.bio;
    });
}

const getUserImages = (posts, loggedUser) => {
    const userPhotos = posts.filter(user => user.userId === loggedUser[0].userId);
    userPhotos.reverse();
    userPhotos.forEach( async (post) => {
        const profilePhotoGrid = document.createElement('div');
        profilePhotoGrid.className = "profilePhotoGrid";

        const photo = document.createElement("img");
        console.log('tiedostonimi', post.file)
        photo.src = url + '/thumbnails/' + post.file;
        photo.alt = post.caption;
        photo.className = "profilePhotoGridPhoto";
        photoContainer.appendChild(profilePhotoGrid);

        const descriptionBackground = document.createElement("div");
        descriptionBackground.setAttribute('id', 'descBackGround');
        const description = document.createElement('p');
        description.innerHTML = post.caption;

        const likes = document.createElement('p');

        const editButton = document.createElement('button');
        editButton.type = "click";
        editButton.innerHTML = "Edit post";

        const deleteButton = document.createElement('button');
        deleteButton.type = "click";
        deleteButton.innerHTML = "Delete post";

        descriptionBackground.style.height='50px';
        descriptionBackground.style.width='100%';

        try {
            const options = {
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                },
            };
            const response = await fetch(url + '/post/likes/' + post.postId, options);
            const likesAmount = await response.json();
            likes.innerHTML = likesAmount.likes;
        }
        catch (e) {
            console.log(e.message);
        }

        descriptionBackground.appendChild(likes);
        descriptionBackground.appendChild(description);
        descriptionBackground.appendChild(editButton);
        descriptionBackground.appendChild(deleteButton);
        profilePhotoGrid.appendChild(photo);

        profilePhotoGrid.appendChild(descriptionBackground);

        editButton.addEventListener('click',  async () => {
            photoContainer.remove();
            console.log(post.postId);

            const editPostForm = document.createElement('form');
            editPostForm.setAttribute('id', 'editPost');

            const caption = document.createElement('input');
            caption.name = "caption";
            caption.type = "text";
            caption.placeholder = "Add new caption";

            const doneButton = document.createElement('button');
            doneButton.innerHTML ="Done"
            doneButton.type = 'submit';

            body.appendChild(editPostForm);
            editPostForm.appendChild(caption);
            editPostForm.appendChild(doneButton);

            editPostForm.addEventListener('submit', async(evt) => {
                evt.preventDefault()
                const data = serializeJson(editPostForm);
                try {
                    const options = {
                        method: 'PUT',
                        headers: {
                            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data),
                    };
                    await fetch(url + '/post/' + post.postId, options);
                    window.location.href = 'http://localhost:3000/myprofile.html'
                }
                catch (e) {
                    console.log(e.message);
                }
            })
        })

        deleteButton.addEventListener('click', async () => {
            try {
                const options = {
                    method: 'DELETE',
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                    },
                };
                await fetch(url + '/post/' + post.postId, options);
                window.location.href = 'http://localhost:3000/myprofile.html'
            }
            catch (e) {
                console.log(e.message);
            }
        })
    });
}

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

        getUserInfo(users);
        getUserImages(posts, users);
    }
    catch (e) {
        console.log(e.message);
    }
};

const getUserCredentials = async (firstname, lastname, bio) => {
    try {
        const options = {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            },
        };

        const responseUser = await fetch(url + '/user', options);
        const users = await responseUser.json();

        firstname.value = users[0].fname || "";
        lastname.value = users[0].lname || "";
        bio.value = users[0].bio || "";
    }
    catch (e) {
        console.log(e.message);
    }
};

const getLoggedUser = async () => {
    try {
        const options = {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            },
        };
        const responseUser = await fetch(url + '/user', options);
        const users = await responseUser.json();
        console.log('userit', users[0].userId);
        return users[0].userId;
    } catch (e) {
        console.log(e.message);
    }
};

settingsButton.addEventListener('click', async () => {
    photoContainer.remove();
    settingsButton.remove();

    const userUpdateForm = document.createElement('form');
    const firstnameInput = document.createElement('input');
    const lastnameInput = document.createElement('input');
    const bioInput = document.createElement('input');

    const updateUserCredentials = document.createElement('button');
    updateUserCredentials.type = "submit";
    updateUserCredentials.textContent = "Update";

    const uploadAvatar = document.createElement('button');
    uploadAvatar.textContent = "Upload profileimage";
    uploadAvatar.className = "settingButton";

    const changePassword = document.createElement('button');
    changePassword.textContent = "Change password";
    changePassword.className = "settingButton";

    const changeUsername = document.createElement('button');
    changeUsername.textContent = "Change username";
    changeUsername.className = "settingButton";

    const changeEmail = document.createElement('button');
    changeEmail.textContent = "Change email";
    changeEmail.className = "settingButton";

    const cancelButton = document.createElement('button');
    cancelButton.textContent = "Cancel";
    cancelButton.className = "settingButton";

    firstnameInput.type = "input";
    lastnameInput.type = "input";
    bioInput.type = "input";

    firstnameInput.name = "fname";
    lastnameInput.name = "lname";
    bioInput.name = "bio";

    getUserCredentials(firstnameInput, lastnameInput,
        bioInput);

    const formContainer = document.createElement('div');
    formContainer.id = "formContainer";

    body.appendChild(formContainer);

    userUpdateForm.setAttribute("id", "userUpdateForm");
    formContainer.appendChild(userUpdateForm);

    userUpdateForm.appendChild(firstnameInput);
    userUpdateForm.appendChild(lastnameInput);
    userUpdateForm.appendChild(bioInput);
    userUpdateForm.appendChild(updateUserCredentials);

    formContainer.appendChild(uploadAvatar)
    formContainer.appendChild(changeUsername);
    formContainer.appendChild(changeEmail);
    formContainer.appendChild(changePassword);
    formContainer.appendChild(cancelButton);

    cancelButton.addEventListener('click', async () => {
        window.location.href = 'http://localhost:3000/myprofile.html'
    })


    userUpdateForm.addEventListener('submit', async (evt) => {
        evt.preventDefault();
        const data = serializeJson(userUpdateForm);
        console.log(data.username);
        try {
        const fetchOptions = {
            method: 'PUT',
            headers:{
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };
        const response = await fetch(url + '/user/update', fetchOptions);
        console.log(response)
        window.location.href = 'http://localhost:3000/myprofile.html'
        } catch (e) {
            console.error(e.message);
        }
    })

    uploadAvatar.addEventListener('click', async () => {
        changePassword.remove();
        changeUsername.remove();
        changeEmail.remove();
        userUpdateForm.remove();
        uploadAvatar.remove();
        cancelButton.remove();

        const uploadAvatarForm = document.createElement('form');
        uploadAvatarForm.enctype = "multipart/form-data";
        const avatarInput = document.createElement('input');
        avatarInput.type = "file";
        avatarInput.name = "avatar";
        avatarInput.accept = "image/*";
        avatarInput.placeholder="Choose file";

        const uploadAvatarButton = document.createElement('button');
        uploadAvatarButton.textContent = "Upload profilepicture";
        uploadAvatarButton.type = "submit";

        const cancelPicture = document.createElement('button');
        cancelPicture.textContent = "cancel";

        formContainer.appendChild(uploadAvatarForm);
        uploadAvatarForm.appendChild(avatarInput);
        uploadAvatarForm.appendChild(uploadAvatarButton);
        uploadAvatarForm.appendChild(cancelPicture);

        cancelPicture.addEventListener('click', () => {
            uploadAvatarForm.remove();
            refreshForm();
        })

        uploadAvatarForm.addEventListener('submit', async (evt) => {
            evt.preventDefault();
            const data = new FormData(uploadAvatarForm);
            const fetchOptions = {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                },
                body: data,
            };
            await fetch(url + '/user/update/avatar', fetchOptions);
            window.location.href = 'http://localhost:3000/myprofile.html'
        })
    })

    changeUsername.addEventListener('click',  () => {
        changePassword.remove();
        changeUsername.remove();
        changeEmail.remove();
        userUpdateForm.remove();
        uploadAvatar.remove();
        cancelButton.remove();

        const changeUsernameForm = document.createElement('form');
        const usernameInput = document.createElement('input');
        usernameInput.type = "input";
        usernameInput.name = "username";
        usernameInput.placeholder = "New username";

        const changeUsernameButton = document.createElement('button');
        changeUsernameButton.textContent = "Change username";
        changeUsernameButton.type = "submit";

        const cancelUsernameUpdate = document.createElement('button');
        cancelUsernameUpdate.textContent = "cancel";

        formContainer.appendChild(changeUsernameForm);
        changeUsernameForm.appendChild(usernameInput);
        changeUsernameForm.appendChild(changeUsernameButton);
        changeUsernameForm.appendChild(cancelUsernameUpdate);

        cancelUsernameUpdate.addEventListener('click', () => {
            changeUsernameForm.remove();
            refreshForm();
        })

        changeUsernameForm.addEventListener('submit', async (evt) => {
            evt.preventDefault();
            const newUsername = serializeJson(changeUsernameForm);
            const data = {newUsername : newUsername.username};
            try {
                const fetchOptions = {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data),
                };
                const response = await fetch(url + '/user/update/username', fetchOptions);
                console.log('response', response);
                    const json = await response.json();
                    console.log('username change response ', json);
                if (json.error) {
                    alert(json.error);
                }
                window.location.href = 'http://localhost:3000/myprofile.html'
            } catch (e) {
                console.error(e.message);
            }
        })

    })

    changeEmail.addEventListener('click', () => {
        changePassword.remove();
        changeUsername.remove();
        changeEmail.remove();
        userUpdateForm.remove();
        uploadAvatar.remove();
        cancelButton.remove();

        const changeEmailForm = document.createElement('form');
        const emailInput = document.createElement('input');

        emailInput.type = "input";
        emailInput.name = "email";
        emailInput.placeholder = "New email";

        const changeEmailButton = document.createElement('button');
        changeEmailButton.textContent = "Change email";
        changeEmailButton.type = "submit";

        const cancelEmailUpdate = document.createElement('button');
        cancelEmailUpdate.textContent = "cancel";

        formContainer.appendChild(changeEmailForm);
        changeEmailForm.appendChild(emailInput);
        changeEmailForm.appendChild(changeEmailButton);
        changeEmailForm.appendChild(cancelEmailUpdate)

        cancelEmailUpdate.addEventListener('click', () => {
            changeEmailForm.remove();
            refreshForm();
        })

        changeEmailForm.addEventListener('submit', async (evt) => {
            evt.preventDefault();
            const newEmail = serializeJson(changeEmailForm);
            const data = {newEmail : newEmail.email};
            try {
                const fetchOptions = {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data),
                };
                const response = await fetch(url + '/user/update/email', fetchOptions);
                console.log('response', response);
                const json = await response.json();
                console.log('username change response ', json);
                if (json.error) {
                    alert(json.error);
                }
                window.location.href = 'http://localhost:3000/myprofile.html'
            } catch (e) {
                console.error(e.message);
            }
        })
    })

    changePassword.addEventListener('click',  () => {
        changePassword.remove();
        changeUsername.remove();
        changeEmail.remove();
        userUpdateForm.remove();
        uploadAvatar.remove();
        cancelButton.remove();

        const changePasswordForm = document.createElement('form');
        const password = document.createElement('input');

        password.type = "password";
        password.name = "password";
        password.placeholder = "New password";
        password.pattern= "(?=.*[A-Z]).{8,}";

        const verifyPassword = document.createElement('input');
        verifyPassword.type = "password";
        verifyPassword.name = "verify_password";
        verifyPassword.placeholder = "Verify new password";
        verifyPassword.pattern= "(?=.*[A-Z]).{8,}";

        const cancelPasswordUpdate = document.createElement('button');
        cancelPasswordUpdate.textContent = "cancel";


        function validatePassword(){
            if(password.value !== verifyPassword.value) {
                verifyPassword.setCustomValidity("Passwords Don't Match");
            } else {
                verifyPassword.setCustomValidity('');
            }
        }

        password.onchange = validatePassword;
        verifyPassword.onkeyup = validatePassword;

        const changeNewPassword = document.createElement('button');
        changeNewPassword.textContent = "Change password";

        formContainer.appendChild(changePasswordForm);

        changePasswordForm.appendChild(password);
        changePasswordForm.appendChild(verifyPassword);
        changePasswordForm.appendChild(changeNewPassword);
        changePasswordForm.appendChild(cancelPasswordUpdate);

        cancelPasswordUpdate.addEventListener('click', () => {
            changePasswordForm.remove();
            refreshForm();
        })

        changePasswordForm.addEventListener('submit',  async(evt) => {
            evt.preventDefault();
            const data = serializeJson(changePasswordForm);
             try {
                 const fetchOptions = {
                     method: 'POST',
                     headers: {
                         'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                         'Content-Type': 'application/json'
                     },
                     body: JSON.stringify(data),
                 };
                    await fetch(url + '/user/changepassword', fetchOptions);
                 window.location.href = 'http://localhost:3000/myprofile.html'
             } catch (e) {
                 console.error(e.message);
             }
        });
    });
    const refreshForm = () => {
        formContainer.appendChild(userUpdateForm);

        userUpdateForm.appendChild(firstnameInput);
        userUpdateForm.appendChild(lastnameInput);
        userUpdateForm.appendChild(bioInput);
        userUpdateForm.appendChild(updateUserCredentials);

        formContainer.appendChild(uploadAvatar)
        formContainer.appendChild(changeUsername);
        formContainer.appendChild(changeEmail);
        formContainer.appendChild(changePassword);
        formContainer.appendChild(cancelButton);
    }
});

getMyProfile();

// to hide login && signup
// for some reason cant use logout.js with these files,,, url doesnt work
if (sessionStorage.getItem('token')) {
    logIn.style.display = 'none';
    signUp.style.display = 'none';
    logOut.style.display = 'flex';
}else{
    logOut.style.display = 'none';
}
