# feathers-exx

> Feathers examples:
> work with services, work with databases, authentication and authorization of users

## About

This project uses [Feathers](http://feathersjs.com). An open source web framework for building modern real-time applications.

## Getting Started

Getting up and running is as easy as 1, 2, 3, 4, 5.

1. Make sure you have [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.

2. Clone or download [feathers-exx](https://github.com/bsa-git/feathers-exx) project with git.

3. Install your dependencies

  ```bash
  cd <project-name>
  npm install
  ```

4. Environment variables

Add file ".env" to your project to set user environment variables.
See the sample file ".env.example". In environment variables, user's secret
data such as user_id, user_secret, etc. are usually specified.

5. Start your app for development mode

Let's start building packages on the client side

  ```bash
  npm run build
  ```

or

```bash
  npm run watch
  ```

to work with the MongoDB database

```bash
  npm run start-mongod
  ```

to work with the RethinkDB database

```bash
  npm run start-rethinkdb
  ```

to work with the ElasticSearch database you need to install it locally and run it

Start the local server, so that you can see the application running

  ```bash
  npm run dev
  ```


6. The application is now running on http://localhost:3000

## Production

```bash
npm start
```

## Help

For more information on all the things you can do with Feathers visit [docs.feathersjs.com](http://docs.feathersjs.com).
