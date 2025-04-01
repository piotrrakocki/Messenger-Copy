# Messenger Copy

## Table of Contents

- [Description](#description)
- [Technologies](#technologies)
- [Features](#features)
- [How to Run](#how-to-run)
- [Author](#author)

## Description

Messenger Copy is a messaging application inspired by popular platforms. It offers a secure and intuitive environment for real-time communication, supporting both one-on-one chats and group conversations. 
With a focus on delivering a smooth user experience, Messenger Copy integrates modern technologies to ensure scalability, performance, and data security.

## Technologies

Backend:
- Java 23
- Spring Boot 3
- Spring Data JPA
- Spring Security
- Spring Boot Mail
- Spring Web
- JSON Web Tokens (JWT)
- MySQL
- Project Lombok
- DevTools
- Maven

Frontend:
- React 18.3.1
- Typescript 4.9.5
- CSS

## Features

- ##### User Authentication and Registration:
  - Registration with Email Confirmation.
  - Login with JWT token.

- ##### Messaging:
  - One-on-One Chat.
  - Send Text Messages.
  - Send Images, Videos, Documents, and Voice Messages.
  - Group Chats.
  - Create and Manage Group Conversations.
  - Add and Remove Participants.

- ##### Media and Reactions:
  - Reactions and Emojis.
  - Stickers and GIFs.
  
- ##### Chat History and Search:
  - Archive Conversations.
  - Search within Chat History.

- ##### Security and Privacy:
  - Block Users.

## How to Run

### Requirements:
- Java 23 or newer
- Node.js (v14 or above) with npm or yarn
- MySQL
- Maven

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone <REPOSITORY_URL>
   cd MessengerCopy/backend
   ```

2. Configure the Database: Update the MySQL connection settings in src/main/resources/application.properties:

  ```bash
  spring.datasource.url=jdbc:mysql://localhost:3306/your_database_name
  spring.datasource.username=your_username
  spring.datasource.password=your_password
  ```
    
3. Build and Run the Backend:

  ```bash
  mvn clean install
  mvn spring-boot:run
  ```

The backend server will typically start on port 8080.

Frontend Setup
1. Navigate to the frontend directory:
  ```bash
  cd ../frontend
  ```

2. Install Dependencies:
  ```bash
  npm install
  ```
or
  ```bash
  yarn install
  ```

3. Run the Frontend Application:
  ```bash
  npm start
  ```
or
  ```bash
  yarn start
  ```

The application will run in your browser at http://localhost:3000.

## Author

The project was created by Piotr Rakocki.
