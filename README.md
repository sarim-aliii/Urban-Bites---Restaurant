# Urban Bites 🍔

Urban Bites is a modern and user-friendly website for a restaurant that also offers home delivery services.

## ✨ Features

*   Browse the restaurant's menu.
*   User registration and login.
*   Place food orders for home delivery.
*   User authentication and session management.
*   Flash notifications for user actions.

## 🛠️ Technologies Used

*   **Frontend**: EJS, Tailwind CSS
*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB with Mongoose
*   **Authentication**: Passport.js (local strategy)
*   **Other Dependencies**:
    *   `connect-flash` for flash messages.
    *   `dotenv` for environment variables.
    *   `express-session` for session management.
    *   `nodemailer` for sending emails (e.g., for order confirmation).
    *   `nodemon` for automatic server restarts during development.

## ⚙️ Installation and Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/urban-bites-restaurant.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd urban-bites-restaurant
    ```
3.  **Install the dependencies:**
    ```bash
    npm install
    ```
4.  **Create a `.env` file** in the root directory and add the following environment variables. Replace the values with your actual configuration.
    ```
    PORT=3000
    MONGO_URI=your_mongodb_connection_string
    SESSION_SECRET=a_strong_session_secret
    ```
5.  **Build the Tailwind CSS file:**
    ```bash
    npm run tailwind:build
    ```

## 🚀 Usage

To run the application in a development environment, use the following command:

```bash
npm start

This will start the server, and you can access the website at http://localhost:3000

 Project Structure
.
├── controllers         # Handles incoming requests and business logic
├── models              # Defines the database schemas
├── node_modules        # Contains all the installed dependencies
├── public              # Static assets like CSS, images
├── util                # Utility functions
├── views               # EJS templates for the UI
├── .env                # Environment variables
├── middleware.js       # Custom middleware functions
├── package-lock.json   # Exact versions of dependencies
├── package.json        # Project metadata and dependencies
└── server.js           # The main entry point of the application


Check out website - https://urban-bites-restaurant.onrender.com
