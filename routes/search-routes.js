// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");

// for the api key
require('dotenv').config();

// Requiring path to so we can use relative routes to our HTML files
const path = require("path");

// include our databases (user and bookshelf)
const db = require('../models')

const axios = require('axios');
const { traceDeprecation } = require("process");
const bookshelf = require("../models/bookshelf");

//const { interfaces } = require("mocha");

// google books api key in an environmental variable
const book_API_key = "&key=" + "AIzaSyAkvUj8_4TNZZKs824LPeBjoa8UJad7unY" /*process.env.GITHUB_DEVELOPER_KEY */

// total search items
var bookArray = []

// adding single book on bookshelf
var bookEntry

// used to hold the bookshelf database that gets sent to handlebars
var savedBookShelf = []

// variables to catch null values returned from google books api
var ifAuthor
var ifWebReader
var ifISBN


module.exports = (app) => {

  // render the main splash page view
  // Here we've add our isAuthenticated middleware to this route.
  app.get("/main", isAuthenticated, (req, res) => {

    res.render("homePage")

  })


  // get route for search -- render the search page if search link is clicked
  app.get("/search", isAuthenticated, (req, res) => {

    // render just the search view
    res.render("search");

  })

  // get route to display your current bookshelf if any
  app.get("/books", isAuthenticated, (req, res) => {
    db.Bookshelf.findAll({ where: { UserId: req.user.id } }).then(function (books) {

      // reset to rebuild from database
      savedBookShelf = []

      books.forEach(item => {
        var tempEntry = {
          id: item.id,
          title: item.title,
          author: item.author,
          description: item.description,
          datePublished: item.datePublished,
          pages: item.pages,
          thumbnail: item.thumbnail,
          infoLink: item.infoLink,
          webReaderLink: item.webReaderLink,
          isbn: item.isbn,
          review: item.review,
        }
        savedBookShelf.push(tempEntry)
      })

      // render the book view with the bookshelf array
      res.render("books", { savedBookShelf })
    })

  })


  // delete route called when clicking the delete button on the bookshelf
  app.delete("/books/:id", isAuthenticated, (req, res) => {
    db.Bookshelf.destroy({ where: { id: req.params.id } }).then(function (deleted) {


      // build the bookshelf array from the database
      db.Bookshelf.findAll({}).then(function (books) {

        savedBookShelf = []

        books.forEach(item => {
          var tempEntry = {
            id: item.id,
            title: item.title,
            author: item.author,
            description: item.description,
            datePublished: item.datePublished,
            pages: item.pages,
            thumbnail: item.thumbnail,
            infoLink: item.infoLink,
            webReaderLink: item.webReaderLink,
            isbn: item.isbn,
            review: item.review,
          }

          savedBookShelf.push(tempEntry)
        })

      })

      // send the new bookshelf array after deleting
      res.json(savedBookShelf);

    })
  })


  // adding a review to the books
  app.get("/books/:id/", isAuthenticated, (req, res) => {


    // put the captured review in a variable to add to database
    var newReview  =  req.query.review 

    // add new review to book shelf
    db.Bookshelf.update({ review: newReview },
      {
        where: { id: req.params.id }
      }).then(function(dbBook) {

        // build the bookshelf array from the database
        db.Bookshelf.findAll({}).then(function (books) {

          savedBookShelf = []
  
          books.forEach(item => {
            var tempEntry = {
              id: item.id,
              title: item.title,
              author: item.author,
              description: item.description,
              datePublished: item.datePublished,
              pages: item.pages,
              thumbnail: item.thumbnail,
              infoLink: item.infoLink,
              webReaderLink: item.webReaderLink,
              isbn: item.isbn,
              review: item.review,
            }
  
            savedBookShelf.push(tempEntry)
          })  
  
        })
  
        res.redirect('/books')
  
      })

    })
      


   // add book to shelf
  app.post("/search/:id", isAuthenticated, (req, res) => {


    // create data to pass as entries to bookshelf database using the
    // book array index
    var addTitle = bookArray[req.params.id].title
    var addAuthor = bookArray[req.params.id].author
    var addDescription = bookArray[req.params.id].description
    var addDatePublished = bookArray[req.params.id].datePublished
    var addPages = bookArray[req.params.id].pages
    var addThumbnail = bookArray[req.params.id].thumbnail
    var addInfoLink = bookArray[req.params.id].infoLink
    var addWebReaderLink = bookArray[req.params.id].webReaderLink
    var addISBN = bookArray[req.params.id].isbn
    var addReview = bookArray[req.params.id].review

    // create the entry that was clicked
    db.Bookshelf.create({
      title: addTitle,
      author: addAuthor,
      description: addDescription,
      datePublished: addDatePublished,
      pages: addPages,
      thumbnail: addThumbnail,
      infoLink: addInfoLink,
      webReaderLink: addWebReaderLink,
      isbn: addISBN,
      review: addReview,
      createdAt: req.user.createdAt,
      updatedAt: req.user.updatedAt,
      UserId: req.user.id
    }).then(function () {

      // render the entry that was chosen as well as the array of search results
      res.render('search', { title: addTitle, thumbnail: addThumbnail, author: addAuthor, bookArray })
    })

  })

  // search for books
  app.post("/search", isAuthenticated, (req, res) => {


    // if they didn't put in a search, make it empty
    if (!req.body.searchTerm)
      req.body.searchTerm = ''


      // order by relevance or newest
    var orderBy = "&orderBy=" + req.body.Sort

    var search = "https://www.googleapis.com/books/v1/volumes?q=" + req.body.searchTerm + orderBy + book_API_key


    // use axios to call the google books api
    axios.get(search).then(data => {

      // use for IDs
      i = 0

      if(data.data){

      bookArray = []
      // loop through the search results and create a book entry for each result
      data.data.items.forEach(item => {

        // make sure the return result entries exist--some entries have 
        // different structures in the response object
            if(!item.accessInfo)
            { ifWebReader = ''}
            else{ ifWebReader = item.accessInfo.webReaderLink}
    
            if(!item.volumeInfo.authors)
                {ifAuthor = ''}
            else{ifAuthor = item.volumeInfo.authors[0] }
    
            if(!item.volumeInfo.industryIdentifiers)
                { ifISBN = ''}
            else{ifISBN = 'ISBN:' + item.volumeInfo.industryIdentifiers[0].identifier} 
    
            if(!item.volumeInfo.imageLinks)
            { ifThumbnail = ''}
            else
            {ifThumbnail = item.volumeInfo.imageLinks.thumbnail} 

        bookEntry =
        {
          id: i,
          title: item.volumeInfo.title,
          author: ifAuthor,
          description: item.volumeInfo.description,
          datePublished: item.volumeInfo.publishedDate,
          pages: item.volumeInfo.pageCount,
          thumbnail: ifThumbnail,
          infoLink: item.volumeInfo.infoLink,
          webReaderLink: item.accessInfo.webReaderLink,
          isbn: ifISBN,
          review: ''
        };

        // so each ID is unique in this search
        i += 1

        // add entry to search results array
        bookArray.push(bookEntry)
      })
    }

      // render the search results array
      res.render("search", { bookArray })
    })
  })
}