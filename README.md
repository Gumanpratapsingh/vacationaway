# VacationAway Email Autoresponder

VacationAway is a Node.js application designed to automate email responses for users on vacation. This application provides an interface for users to set their out-of-office email replies, supporting both predefined and custom messages.

## Installation

Follow these steps to set up the project locally:

### 1. Clone the Repository

git clone https://github.com/Gumanpratapsingh/vacationaway.git

### 2. Install Required Packages
Navigate to the cloned repository's folder and install the necessary NPM packages:

npm install express ejs @google-cloud/local-auth dotenv googleapis
### 3. Create Environment Configuration
In the project's root directory, create a .env file with the following content:
PORT=4002
GOOGLE_CREDENTIALS_FILE='path/to/your/credentials.json'
LABEL_NAME='Vacation-Mails'
Make sure to replace 'path/to/your/credentials.json' with the actual path to your Google credentials file.

### 4. Start the Server
To start the application, run:
node app.js
Usage
After starting the server, navigate to http://localhost:4002/config in your web browser to access the configuration interface. Here, you can set your vacation message preferences.
### 
### Features
Gmail Integration: Automates responses to incoming emails via Gmail.

Customizable Messages: Users can select from predefined messages or compose their own.

Responsive UI: Accessible and easy-to-use web interface.
Potential Enhancements

Advanced Authentication: Implement more robust user authentication.

Persistent Storage: Introduce a database for storing user preferences.

Multi-User Support: Extend to support configurations for multiple users.

Unit Testing: Develop a comprehensive test suite for increased reliability.

Localization: Offer multi-language support for international users.
