# Motooto

## Description
Motooto is a Full-Stack Web Application that allows users to browse, add, track, and manage vehicle sale offers. The project was inspired by the most popular car marketplace in Poland - Otomoto.

## Features

- Browse and filter vehicle sale listings.
- Upload own listings.
- Add listings to favorites.
- Share listings with others.
- User account management including: setting your email, username, phone number.
- Possibility to reset password via email message.


## Deployed App
https://motooto-frontend.vercel.app/

Due to server issues, it's working quite slow. If something doesn't work, try refreshing page.

## Technologies

* ### Frontend: 
  - <a target="_blank" href="https://react.dev/">React.js</a>
  - <a target="_blank" href="https://mantine.dev/">Mantine</a>
  - <a target="_blank" href="https://www.npmjs.com/package/react-router-dom">react-router-dom</a>
  - <a target="_blank" href="https://www.npmjs.com/package/formik">formik</a>
  - <a target="_blank" href="https://www.npmjs.com/package/yup">yup</a>
  - <a target="_blank" href="https://www.npmjs.com/package/axios">axios</a>

* ### Backend: 
  - <a target="_blank" href="https://nodejs.org/en">Node.js</a>
  - <a target="_blank" href="https://expressjs.com/">Express.js</a>
  - <a target="_blank" href="https://express-validator.github.io/docs">express-validator</a>
  - <a target="_blank" href="https://www.mongodb.com/">MongoDB</a>
  - <a target="_blank" href="https://mongoosejs.com/">mongoose</a>
  - <a target="_blank" href="https://jwt.io/">JSON Web Tokens (JWT)</a>
  - <a target="_blank" href="https://www.npmjs.com/package/bcrypt">bcrypt</a>
  - <a target="_blank" href="https://www.nodemailer.com/">nodemailer</a>
  - <a target="_blank" href="https://www.npmjs.com/package/axios">axios</a>
  - <a target="_blank" href="https://www.npmjs.com/package/multer">multer</a>


## Installation

To install and run the project locally, follow these steps:

1. Clone the repository to your computer:
```
git clone https://github.com/Hek70r/Motooto.git
```
2. Navigate to the project's frontend directory: 
```
cd Motooto/frontend
```
3. Install frontend dependencies:
```
npm install
```

4. Navigate to the backend directory: 
```
cd ../backend
```
5. Install backend dependencies:
```
npm install
```

6. Create a `.env` file inside the backend directory. This file should include necessary environment variables. Here is an example:

```
PORT = 8080
MONGODB_URI = mongodb+srv://<nazwa_użytkownika><hasło>@<cluster>.mongodb.net/motooto
APP_PASSWORD = "asds vdsvsd asda cdscs"
MY_EMAIL = "motootoweb@gmail.com"
```

- `PORT` — The port number for the server (optional, defaults to 3000 if not specified).
- `MONGODB_URI` — Your MongoDB Atlas connection string.
- `APP_PASSWORD` and `MY_EMAIL` — Necessary if you want to use the password resetting feature via email.

Helpful links for setting up your MongoDB Atlas and Google App Password:
- [How to create a MongoDB cluster and get MONGODB_URI](https://www.youtube.com/watch?v=LTKgKt_t1JE&ab_channel=Udayana)
- [How to get APP_PASSWORD](https://www.youtube.com/watch?v=QDIOBsMBEI0&t=639s&ab_channel=WebWizard)

7. Start the backend server: 
```
npm run dev
```

8. Enter http://localhost:3000 in your browser.

