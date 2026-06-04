const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
      return res.status(404).json({
        message: "Unable to register user."
      });
    }
  
    if (isValid(username)) {
      return res.status(404).json({
        message: "User already exists!"
      });
    }
  
    users.push({
      username: username,
      password: password
    });
  
    return res.status(200).json({
      message: "User successfully registered. Now you can login"
    });
  });

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.send(JSON.stringify(books, null, 4));
  });

  public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    return res.status(200).json(books[isbn]);
  });
  
  public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    let filteredBooks = {};
  
    Object.keys(books).forEach((key) => {
      if (books[key].author === author) {
        filteredBooks[key] = books[key];
      }
    });
  
    return res.status(200).json(filteredBooks);
  });

  public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    let filteredBooks = {};
  
    Object.keys(books).forEach((key) => {
      if (books[key].title === title) {
        filteredBooks[key] = books[key];
      }
    });
  
    return res.status(200).json(filteredBooks);
  });

  public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    return res.status(200).json(books[isbn].reviews);
  });
  // Task 10
public_users.get('/asyncbooks', async (req, res) => {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(response.data);
  });
  
  // Task 11
  public_users.get('/asyncisbn/:isbn', async (req, res) => {
    const response = await axios.get(
      `http://localhost:5000/isbn/${req.params.isbn}`
    );
    return res.status(200).json(response.data);
  });
  
  // Task 12
  public_users.get('/asyncauthor/:author', async (req, res) => {
    const response = await axios.get(
      `http://localhost:5000/author/${req.params.author}`
    );
    return res.status(200).json(response.data);
  });
  
  // Task 13
  public_users.get('/asynctitle/:title', async (req, res) => {
    const response = await axios.get(
      `http://localhost:5000/title/${req.params.title}`
    );
    return res.status(200).json(response.data);
  });
module.exports.general = public_users;
