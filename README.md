# About

**SG Decoding Web Portal** provides transcribing (speech-to-text) services for users. Features include live transcribing and transcribing of uploaded audio files. The frontend project is built with the following:

1. [React](https://reactjs.org/docs/getting-started.html)
2. [Semantic UI as Styling Library](https://react.semantic-ui.com/)
3. [React-Redux for state management](https://react-redux.js.org/introduction/getting-started)
4. [TypeScript](https://www.typescriptlang.org/)
5. Additional helper libs specified in _package.json_


The backend is built with the following:

1. [Node/ExpressJs for API server](https://expressjs.com/)
2. Additional helper libs specified in _package.json_


# Running the Project

**Running Locally**
```text
// Frontend
cd frontend && npm run start

// Backend
cd backend && node server.js

// Alternative for backend with nodemon (restarts server when file changes)
cd backend && npm run dev
```

# Building and running Docker containers

```text

// Building the Docker containers
sudo docker-compose build --no-cache

// Running Docker containers
sudo docker-compose up -d
```
- "sudo" is not needed if running on Windows

# Testing

For the frontend

- Unit and integration tests are built with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

- End-to-End tests are built with [Cypress](https://docs.cypress.io).

Due to time constraints, limited test cases were written and could be expanded upon in future development.

## Running Tests

```
// Unit/Integration

npm run test

// End-to-End
npm run cypress:open

```

# Documentation

Documentation for this project can be found in our FYP reports as hyperlinked:
- [THZ's FYP report](https://hdl.handle.net/10356/157669)
- [Terry's FYP report](https://hdl.handle.net/10356/157441) 

# Speech Gateway Docs

The API documentation for Speech Gateway can be found in this [gitbook](https://speech-ntu.gitbook.io/speech-gateway/).



## Acknowledgements

This project is done under the supervision of Prof. Chng Eng Siong and under the  mentorship of Ms. Vu Thi Ly and Mr. Kyaw Zin Tun.

---
*Last updated 5th June 2022*
