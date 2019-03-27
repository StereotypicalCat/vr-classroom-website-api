# vr-classroom-website-api
A website api for a vr-classroom app I'm building for my final school project
## What?
For my final project in IT, I was in a group of 3 people, where I was charged mainly with building a website API for a course-base website. The API should cover login, listing and loggin the courses upon creation, getting information such as server load from the Game Server, and do ecommerce.
## Setup guide
This setup was developed while running docker. The only real requirement for running this code is to install docker and run the following command:
docker run --name accounts-mariadb -e MYSQL_ROOT_PASSWORD=AccountPSWD -e MYSQL_DATABASE=users -p 3310:3306 -d mariadb
Change the password of the database in the docker run statement and in the Accounts file.
