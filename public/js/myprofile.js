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
    userPhotos.forEach((post) => {
        const photo = document.createElement("img");
        photo.src = post.file;
        photo.alt = post.caption;
        photo.className = "profilePhotoGrid";
        photoContainer.appendChild(photo);
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

    const userUpdateForm = document.createElement('form');
    const firstnameInput = document.createElement('input');
    const lastnameInput = document.createElement('input');
    const bioInput = document.createElement('input');

    const updateUserCredentials = document.createElement('button');
    updateUserCredentials.type = "submit";
    updateUserCredentials.textContent = "Update";

    const uploadAvatar = document.createElement('button');
    uploadAvatar.textContent = "Upload profileimage";

    const changePassword = document.createElement('button');
    changePassword.textContent = "Change password";

    const changeUsername = document.createElement('button');
    changeUsername.textContent = "Change username";

    const changeEmail = document.createElement('button');
    changeEmail.textContent = "Change email";

    firstnameInput.type = "input";
    lastnameInput.type = "input";
    bioInput.type = "input";

    firstnameInput.name = "fname";
    lastnameInput.name = "lname";
    bioInput.name = "bio";

    getUserCredentials(firstnameInput, lastnameInput,
        bioInput);

    userUpdateForm.setAttribute("id", "userUpdateForm");
    body.appendChild(userUpdateForm);

    userUpdateForm.appendChild(firstnameInput);
    userUpdateForm.appendChild(lastnameInput);
    userUpdateForm.appendChild(bioInput);
    userUpdateForm.appendChild(updateUserCredentials);

    body.appendChild(uploadAvatar)
    body.appendChild(changeUsername);
    body.appendChild(changeEmail);
    body.appendChild(changePassword);

    userUpdateForm.addEventListener('submit', async (evt) => {
        evt.preventDefault();
        const data = serializeJson(userUpdateForm);
        const loggedUser = await getLoggedUser();
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
        const response = await fetch(url + '/auth/update/' + loggedUser, fetchOptions);
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

        body.appendChild(uploadAvatarForm);
        uploadAvatarForm.appendChild(avatarInput);
        uploadAvatarForm.appendChild(uploadAvatarButton);

        uploadAvatarForm.addEventListener('submit', async (evt) => {
            evt.preventDefault();
            const loggedUser = await getLoggedUser()
            const data = new FormData(uploadAvatarForm);
            //const data = {loggedUser : loggedUser, newAvatar : newAvatar.avatar};
            console.log('daatta', data);
            const fetchOptions = {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                },
                body: data,
            };
            const response = await fetch(url + '/auth/update/avatar/' + loggedUser, fetchOptions);
        })
    })

    changeUsername.addEventListener('click', async () => {
        changePassword.remove();
        changeUsername.remove();
        changeEmail.remove();
        userUpdateForm.remove();
        uploadAvatar.remove();

        const changeUsernameForm = document.createElement('form');
        const usernameInput = document.createElement('input');
        usernameInput.type = "input";
        usernameInput.name = "username";
        usernameInput.placeholder = "New username";

        const changeUsernameButton = document.createElement('button');
        changeUsernameButton.textContent = "Change username";
        changeUsernameButton.type = "submit";

        body.appendChild(changeUsernameForm);
        changeUsernameForm.appendChild(usernameInput);
        changeUsernameForm.appendChild(changeUsernameButton);

        changeUsernameForm.addEventListener('submit', async (evt) => {
            evt.preventDefault();
            const loggedUser = await getLoggedUser()
            const newUsername = serializeJson(changeUsernameForm);
            const data = {loggedUser : loggedUser, newUsername : newUsername.username};
            try {
                const fetchOptions = {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data),
                };
                const response = await fetch(url + '/auth/update/username/', fetchOptions);
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

    changeEmail.addEventListener('click', async () => {
        changePassword.remove();
        changeUsername.remove();
        changeEmail.remove();
        userUpdateForm.remove();
        uploadAvatar.remove();

        const changeEmailForm = document.createElement('form');
        const emailInput = document.createElement('input');

        emailInput.type = "input";
        emailInput.name = "email";
        emailInput.placeholder = "New email";

        const changeEmailButton = document.createElement('button');
        changeEmailButton.textContent = "Change email";
        changeEmailButton.type = "submit";

        body.appendChild(changeEmailForm);
        changeEmailForm.appendChild(emailInput);
        changeEmailForm.appendChild(changeEmailButton);

        changeEmailForm.addEventListener('submit', async (evt) => {
            evt.preventDefault();
            const loggedUser = await getLoggedUser()
            const newEmail = serializeJson(changeEmailForm);
            const data = {loggedUser : loggedUser, newEmail : newEmail.email};
            try {
                const fetchOptions = {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data),
                };
                const response = await fetch(url + '/auth/update/email/', fetchOptions);
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

    changePassword.addEventListener('click', async () => {
        changePassword.remove();
        changeUsername.remove();
        changeEmail.remove();
        userUpdateForm.remove();
        uploadAvatar.remove();

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

        body.appendChild(changePasswordForm);

        changePasswordForm.appendChild(password);
        changePasswordForm.appendChild(verifyPassword);
        changePasswordForm.appendChild(changeNewPassword);

        changePasswordForm.addEventListener('submit',  async(evt) => {
            evt.preventDefault();
            const loggedUser = await getLoggedUser()
            const data = serializeJson(changePasswordForm);
             try {
                 const fetchOptions = {
                     method: 'POST',
                     headers: {
                         'Authorization': 'Bearer ' +
                             sessionStorage.getItem('token'),
                         'Content-Type': 'application/json'
                     },
                     body: JSON.stringify(data),
                 };
                    await fetch(url + '/auth/changepassword/' + loggedUser, fetchOptions);
                 window.location.href = 'http://localhost:3000/myprofile.html'
             } catch (e) {
                 console.error(e.message);
             }
        });
    });
});

getMyProfile();
