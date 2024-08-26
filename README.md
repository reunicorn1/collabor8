# collabor8
The Collaborative Code Editor is a web-based application that enables multiple
users to edit code simultaneously in real-time. The application is built using
React, Nest.js, and Socket.io. The frontend is built using React and the
backend is built using Nest.js. The frontend and backend communicate using
Socket.io to enable real-time collaboration. The application also supports
syntax highlighting and code formatting.

## Table of Contents



## Running the Project

This project consists of both a frontend (ReactJS) and a backend (NestJS) application. 

To run the project, you can use the provided `Makefile`, which utilizes `tmux` to manage the sessions.

This `Makefile` provides a convenient way to manage your development workflow, from setting up the environment to running, stopping, and testing the application.
Here’s how to get started:

#### Prerequisites

Before running the project, make sure you have the following installed on your system:
- **tmux**: A terminal multiplexer.
- **npm**: Node.js package manager.

You can verify their installation using:
```bash
tmux -V
npm -v
```

If any of the prerequisites are missing, the setup process will attempt to install them.

#### Setup

To install the necessary dependencies and set up the project, run:
```bash
make setup
```

This command will install `tmux` and `npm` if they are not already installed and will install all necessary dependencies for both the frontend and backend.

#### Running the Application

To run both the frontend and backend in separate `tmux` sessions, use:
```bash
make run
```

This command starts:
- **ReactJS** in a `tmux` session named `ReactJS`.
- **NestJS** in a `tmux` session named `NestJS`.

#### Running Individually

If you want to run only the frontend or backend, you can use the following commands:

- To run the frontend:
  ```bash
  make run_react
  ```

- To run the backend:
  ```bash
  make run_nest
  ```

#### Stopping the Application

To stop both the frontend and backend `tmux` sessions, use:
```bash
make stop
```

If you want to stop only one of the sessions:
- To stop the frontend session:
  ```bash
  make stop_react
  ```
- To stop the backend session:
  ```bash
  make stop_nest
  ```

#### Checking the Status

To list all running `tmux` sessions, use:
```bash
make list
```

To check the status of the sessions:
```bash
make status
```

#### Cleaning Dependencies

To remove and reinstall all dependencies:
```bash
make clean
```

#### Running Tests

To run tests for both the frontend and backend:
```bash
make test
```

You can also run tests individually:
- For frontend tests:
  ```bash
  make test_frontend
  ```
- For backend tests:
  ```bash
  make test_backend
  ```

#### Docker

To build Docker images for the frontend and backend:
```bash
make docker-build
```

To push these Docker images to a repository:
```bash
make docker-push
```

#### Project Information

To view project version and scripts:
```bash
make version
make info
```

#### Help

To display all available commands:
```bash
make help
```


