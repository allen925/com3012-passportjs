# Revoke Authentication Project with express

A simple web application using Express, EJS, and Passport.js for authentication system. 

Supports both local authentication and GitHub OAuth login. 

It's mainly designed as a demonstration of how admin can revoke user logged in sessions to cancel one's ability to view user's private content. 

## Basic Intro:

- **Local Authentication**: Username and password-based authentication.
- **GitHub OAuth Login**: Allows users to authenticate using their GitHub accounts. (using github OAuth, need your own github id and secret in .env)
- **Roles**:
  - **User**: login without other feature. 
  - **Admin**: login to revoke user sessions.

<br>

- **Session Management**: Sessions are managed with `express-session`.
- **EJS Templating**: Server-rendered views using EJS and Express layouts.

## Run the Code

Install dependencies:
```
npm install
```

Running the application:
```
npm run start
```

To make Github login eligible you need to have a .env file at root of repo and contain 
```
GITHUB_CLIENT_ID=<your github id>
GITHUB_CLIENT_SECRET=<your github secret>
```

## Usage

Once the application is running, navigate to http://localhost:8000 or port you specified in .env to access the site. 

<br><br><br>
side node: It's initial purpose is for
com3012-passportjs
BCIT react course comp 3012's passport js practice
