# PAYEVER | BACK-END ASSIGNMENT | INVOICE

This project was developed as part of a challenge proposed by Payever for the position of Back-end Engineer. It involves creating a simple REST application from scratch using Nest.js, TypeScript, MongoDB, RabbitMQ,
## Content

1. [Getting Started](#getting-started)
    - [Requirements](#requirements)
2. [Download and Installation](#download-and-installation)
3. [API Resources](#api-resources)
    - [Endpoints](#endpoints)
4. [Automated Tests](#automated-tests)
5. [Technologies](#technologies)
6. [Acknowledgments](#acknowledgments)

## Getting Started

The following instructions will help you get a copy of this project up and running on your local machine. You will be able to test it in both Production and Development modes.

Below you will find relevant information about the API resources available (its endpoints) as well as the main technologies used to build it.

### Requirements

You need to install the following technologies:

- [Node.js](https://nodejs.org/en/download/) - JavaScript runtime built on Chrome's V8 JavaScript engine.
- [MongoDB](https://www.mongodb.com/try/download/community) - Document-oriented database program.
- [RabbitMQ](https://www.rabbitmq.com/download.html) - Open-source message-broker software.
- [Nest.js](https://nestjs.com/) - A progressive Node.js framework to build scalable and testable applications.

For MongoDB, you can use its Atlas service to avoid installing it locally. You can access it [here](https://www.mongodb.com/atlas/database).

## Download and Installation

Make sure you have Git installed on your machine. Clone this project using the following command:

bash

Copy code

`git clone https://github.com/stap20/backend-engineering-task-invoices.git cd backend-engineering-task-invoices`

After cloning the repository, install the dependencies:

bash

Copy code

`npm install`

Configure your environment variables by updating `.env` file with the values as necessary:

Start the application in development mode using:

bash

Copy code

`npm run start:dev`

The application will run on port 3000. You can now start sending requests or running tests.

## API Resources

You can use an HTTP client like Insomnia, Postman, or the Thunder Client extension in VS Code to interact with this application.

### Endpoints

- **POST /invoices**
    
    - Creates a new invoice entry in the database. Accepts invoice details in the request body and returns the created invoice. If creation fails, it logs the error and returns a 500 Internal Server Error.
- **GET /invoices/{id}**
    
    - Retrieves a specific invoice by its ID. Returns the invoice details in JSON format. If the invoice with the provided ID is not found, it logs the error and returns a 404 Not Found.
- **GET /invoices/?startDate=&endDate=**
    
    - Retrieves a list of invoices with optional filters. Accepts query parameters for filtering invoices, such as date ranges. Returns a list of invoices that match the filters. If fetching invoices fails, it logs the error and returns a 500 Internal Server Error.
    - 
## Automated Tests

Unit and end-to-end (e2e) tests are included in the project to ensure the functionality and stability of the application.

- **Unit Tests:** Located next to the corresponding code files. These tests verify individual components and functions in isolation.
- **End-to-End (e2e) Tests:** Found in the `test` folder, specifically in `invoices.controller.e2e-spec.ts`. These tests simulate HTTP requests to validate the behavior of the application's endpoints.

### Running the Tests

To run the unit and e2e tests, use:

bash

Copy code

`npm run test`

### Running End-to-End Tests

To specifically run e2e tests, use:

bash

Copy code

`npm run test:e2e`

### Test Coverage

To generate a test coverage report, use:

bash

Copy code

`npm run test:cov`

This will provide details on the coverage of your unit tests, including which parts of the code are tested and which are not.
## Technologies

Main technologies used in this project:

- **Node.js** - A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Nest.js** - A progressive Node.js framework to build highly scalable and testable applications.
- **MongoDB** - A document-oriented database program.
- **TypeScript** - A strongly typed programming language that builds on JavaScript.
- **RabbitMQ** - An open-source message-broker software.

## Acknowledgments

I’d like to thank Payever and its representatives for providing this challenge. The project was a great opportunity to work with new technologies and apply my skills in building scalable applications.