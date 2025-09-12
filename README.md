# movies-weather-backend

## App overview

backend for a **Movies + Weather app**. That allows users to sign up, log in, search for movies, view the weather in their city, and manage their favorite movies.  

## App Features

- **Authentication Feature**
  - Users can **sign up** with name, email, password, and city.  
  - Passwords are **hashed** for security.  
  - Users can **log in** with email and password.  
  - The app generates a **JWT token** for authentication.  

- **Weather Feature**
  - Fetches current weather for the user’s city.  

- **Movies Feature**
  - Users can **search** for movies via **omdb** movie API.  
  - Users can **add** and **remove** movies from their favorites list.  

---

## Tech Stack & Dependencies i used

- **Backend Framework:** Node.js + Express.js  
- **GraphQL Server:** graphql-yoga  
- **Database:** MongoDB (Mongoose ODM)  
- **Authentication:** jsonwebtoken  
- **Password Hashing:** bcryptjs  
- **Other:** Prettier + ESLint for formatting & linting
  