# Turbo Accounting

This is a modern port/upgrade of my old accounting app I've developed in PHP many years ago. It's used to track your monthly spending.

## Setup

1. Install [Node.js](https://nodejs.org/en).
2. Run `npm install` inside the repo directory.
3. Run `npm run start` to start the app. The URL to access the interface will be printed in the console.

### Environment Variables

You can either set the environment variables through console, or create a `.env` in project root to set environment variables. Example `.env` looks like this:

``` bash:.env
PORT=8008
```

Supported variables are following:

- PORT: Port number used for server. Defaults to 3000 if not set.

## Development Environment

This project is developed in:

- Windows 11
- Node.js v22.15.0
