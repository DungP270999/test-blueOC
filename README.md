# JSONPlaceholder Explorer

A React app that fetches, displays, and lets you update data from [JSONPlaceholder](https://jsonplaceholder.typicode.com/).

## Features

- **Posts tab** — fetches all 100 posts; click **Edit** on any card to update the title and body (PUT via the API)
- **Users tab** — fetches all 10 users and displays name, username, email, city, and company
- **Todos tab** — fetches all 200 todos; filter by All / Done / Pending and toggle completion state

## Stack

- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- No extra dependencies — just the browser Fetch API

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Notes

JSONPlaceholder is a fake REST API — PUT requests are simulated (the server responds with the updated resource, but data isn't actually persisted).
