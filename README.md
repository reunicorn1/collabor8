# Collabor8

Collabor8 is a web-based collaborative code editor that empowers multiple users to edit code simultaneously in real-time. Built using a robust tech stack of React, Nest.js, and Socket.io, Collabor8 offers seamless, real-time collaboration for coding enthusiasts and professionals alike. The application features syntax highlighting, code formatting, and a rich user interface to enhance the coding experience.

## Table of Contents

1. [About Collabor8](#about-collabor8)
2. [Technologies Used](#technologies-used)
3. [Running the Project](#running-the-project)
   - [Prerequisites](#prerequisites)
   - [Setup](#setup)
   - [Running the Application](#running-the-application)
   - [Running Individually](#running-individually)
   - [Stopping the Application](#stopping-the-application)
   - [Checking the Status](#checking-the-status)
   - [Cleaning Dependencies](#cleaning-dependencies)
   - [Running Tests](#running-tests)
   - [Docker](#docker)
   - [Project Information](#project-information)
   - [Help](#help)
4. [Team](#team)

## About Collabor8

Collabor8 is designed to simplify the collaborative coding process by providing a platform where multiple developers can work together in real-time. The application ensures smooth interaction and communication between the frontend and backend through Socket.io, delivering an efficient and interactive coding environment. 

## Technologies Used

- **Frontend**: ReactJS
- **Backend**: NestJS
- **Real-time Communication**: Socket.io
- **Styling**: Chakra UI

## Running the Project

Collabor8 consists of both a frontend (ReactJS) and a backend (NestJS) application. To run the project, a `Makefile` is provided that utilizes `tmux` to manage sessions efficiently, allowing for easy development and testing.

### Prerequisites

Ensure you have the following installed on your system:

- **tmux**: A terminal multiplexer.
- **npm**: Node.js package manager.

Verify installation using:

```bash
tmux -V
npm -v
```

The setup process will attempt to install any missing prerequisites.

### Setup

Install the necessary dependencies and set up the project by running:

```bash
make setup
```

This command installs `tmux` and `npm` if not already installed and sets up all required dependencies for both the frontend and backend.

### Running the Application

Run both the frontend and backend in separate `tmux` sessions:

```bash
make run
```

This command starts:

- **ReactJS**: In a `tmux` session named `ReactJS`.
- **NestJS**: In a `tmux` session named `NestJS`.

### Running Individually

To run only the frontend or backend:

- **Frontend**:
  ```bash
  make run_react
  ```

- **Backend**:
  ```bash
  make run_nest
  ```

### Stopping the Application

To stop both frontend and backend sessions:

```bash
make stop
```

To stop individual sessions:

- **Frontend**:
  ```bash
  make stop_react
  ```

- **Backend**:
  ```bash
  make stop_nest
  ```

### Checking the Status

List all running `tmux` sessions:

```bash
make list
```

Check the status of the sessions:

```bash
make status
```

### Cleaning Dependencies

Remove and reinstall all dependencies:

```bash
make clean
```

### Running Tests

Run tests for both the frontend and backend:

```bash
make test
```

Run tests individually:

- **Frontend**:
  ```bash
  make test_frontend
  ```

- **Backend**:
  ```bash
  make test_backend
  ```

### Docker

Build Docker images for the frontend and backend:

```bash
make docker-build
```

Push these Docker images to a repository:

```bash
make docker-push
```

### Project Information

View project version and scripts:

```bash
make version
make info
```

### Help

Display all available commands:

```bash
make help
```

## Team

Collabor8 is developed and maintained by a dedicated team of software engineers:

- Mohamed Elfadil Ali
- Abdallah Abdelrahman
- Mohannad Babeker
- Reem Osama

---

By following these instructions, you can efficiently set up, run, and manage the Collabor8 project. For any additional support or inquiries, feel free to reach out to our team. Happy coding! 🚀
