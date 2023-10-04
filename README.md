# TGILabs Weather Project
The TGILabs Weather Project is a web application developed as part of an assignment given by TGILabs. It offers weather information service with the following key features:

- User Authentication System: The project provides a user authentication system with options for user registration and login. Users can create new accounts securely and log in to access the application's features.

- Forgot Password Mechanism: In case users forget their passwords, the project incorporates a "forgot password" mechanism. This feature allows users to reset their passwords with ease, ensuring a seamless user experience.

- Weather Data Display: Authenticated users can access real-time weather data for various pre-defined cities.

## Table of Contents

- [TGILabs Weather Project](#tgilabs-weather-project)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the Application](#running-the-application)

## Overview

This project consists of a React client and a Nest.js server. The client and server are located in their respective folders: `client` and `server`.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed on your machine.

## Installation

1. Clone the repository to your local machine:

   ```shell
   git clone https://github.com/itssigron/tgilabs-weather-website.git
    ```

2. Navigate to the project directory:

   ```shell
   cd tgilabs-weather-website
    ```

3. Run the `install.bat` script to install dependencies for both the client and server:

   ```shell
   install.bat
   ```

## Configuration

Both the client and server have a `.env.example` file in their respective directories. You should create a `.env` file based on these examples and configure your environment variables accordingly.

1. For the client, copy `.env.example` to `.env` in the `client` directory and configure any necessary environment variables.

2. For the server, copy `.env.example` to `.env` in the `server` directory and configure any necessary environment variables.

## Running the Application

To run the application, follow these steps:

1. Start the server:

   ```shell
   # Navigate to the server directory
   cd server

   # Run the server
   npm start
   ```

   For more detailed instructions on running the server, refer to the [server's README.md](server/README.md) created by the Nest.js framework.

2. Start the client (from a different shell):

   ```shell
   # Navigate to the client directory
   cd client

   # Run the client
   npm start
   ```

   For more detailed instructions on running the client, refer to the [client's README.md](client/README.md) created by the React framework.

The client should now be accessible at `http://localhost:3000`, and it will communicate with the server at the specified API endpoints.