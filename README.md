# Mealshare
Team project for Metropolia UAD Web technologies course.

Authors Aleksi Kytö, Niko Lindborg and Aleksi Kosonen. 

# Installation 

1. Clone repo
```
https://github.com/aleksikosonen/mealshare.git
```
2. Switch branch (this branch will not be ready for assingment deadline, but will be added asap)
```
git checkout testlocalhost
```
3. Create your database 
```
Use the 'mealshare-sql.sql'-file to create your database
```
4. Create .env file
```
DB_HOST= <your database host>
DB_USER= <your dbuser>
DB_PASS= <your dbpassword>
DB_NAME= <your dbname>
```
5. Install NPM packages
```
npm install
```

6. Run the app!
```
nodemon app.js
```

# About Mealshare

Mealshare is a webpage for viewing and uploading food related media and recipes. 

A registered user can login in from the landpage and a new user can follow the link to signup-page.

Once user is logged in, the feed is shown to user. Here user can browse posts, the post's recipes and comment them. User can also make own posts wich contain a picture and an caption. User can also upload a recipe related to that post. Posts can be deleted on user's own profile. Site also has admin-accounts which can delete posts from feed directly. Other user-account related settings and credentials can be edited via My Profile page.

Site has a search feature where user can search content by usernames or hashtags from the post's captions, for example #neapolitan or #pizza.
