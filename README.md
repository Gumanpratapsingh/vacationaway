# VacationAway

VacationAway is a Node.js web application designed to automate email responses for users while they are on vacation. It offers an interface for users to set their out-of-office messages and preferences. The application integrates with the Gmail API to send automated responses based on the user's selection.

## Features

- **Gmail Integration**: Authenticate with the Gmail API to manage email responses.
- **Email Autoresponder**: Set up automated replies to incoming emails when on vacation.
- **Customizable Messages**: Choose from predefined messages or create a custom auto-reply.
- **Responsive UI**: A mobile-friendly web interface for easy configuration.
- **Environmentally Friendly**: Utilizes `.env` for secure and flexible configuration.

## Technologies Used

- **Node.js**: The runtime environment for backend logic.
- **Express.js**: The server framework for creating web applications.
- **EJS**: A templating language for generating HTML with JavaScript.
- **@google-cloud/local-auth**: Handles OAuth 2.0 authentication with Google APIs.
- **dotenv**: Manages environment variables for project configuration.
- **CSS3**: Ensures a modern and responsive style for the web interface.

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:

   git clone https://github.com/Gumanpratapsingh/vacationaway.git
2.Install the required packages:
   npm install express ejs @google-cloud/local-auth dotenv googleapis body-parser

3.Create a .env file in the root directory with the following contents:
   PORT=4002
   GOOGLE_CREDENTIALS_FILE='path/to/your/credentials.json'
   LABEL_NAME='Vacation-Mails'

4. Start the server by:
   node app.js

After starting the server, navigate to the /config endpoint to access the configuration interface.
Here you can set your vacation message preferences. The application will handle the rest, automatically replying to your emails with your selected message.

**Potential Enhancements**
Advanced Authentication: Implement additional security measures for user authentication.
Persistent Storage: Introduce a database to save user settings and messages.
Multi-User Support: Extend the application to handle configurations for multiple users.
Unit Testing: Develop a suite of tests for increased reliability.
Localization: Offer multi-language support for international users.

