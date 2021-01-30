// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");

// for the api key
require('dotenv').config();

// Requiring path to so we can use relative routes to our HTML files
const path = require("path");

const db = require('../models')

const axios = require('axios');
const { traceDeprecation } = require("process");
const bookshelf = require("../models/bookshelf");
const { interfaces } = require("mocha");

// google books api key in an environmental variable
const book_API_key = "&key=" + process.env.GITHUB_DEVELOPER_KEY

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

// send the homepage
  app.get("/main", isAuthenticated, (req, res) => {

    //db.User.findOne({where : { UserId : req.user.id }}).then(function(user) { 
    res.render("homePage") 
   // res.sendFile(path.join(__dirname, "../public/homePage.html"));
  })

  app.get("/search", isAuthenticated, (req, res) => {

    console.log("hitting the get /search")
    res.render("search");
  })


  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/books", isAuthenticated, (req, res) => {
    db.Bookshelf.findAll( {where: { UserId : req.user.id } }).then(function (books) {


      console.log("get route for books")

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
          review: item.review
        }
        savedBookShelf.push(tempEntry)
        console.log(tempEntry)
      })

      res.render("books", { savedBookShelf })
    })


  })


  app.delete("/books/:id", isAuthenticated, (req, res) => {
    db.Bookshelf.destroy({ where: { id: req.params.id } }).then(function (deleted) {

      console.log("destroying" + deleted)

      savedBookShelf.splice(req.params.id, 1)

    })

    db.Bookshelf.findAll({}).then(function (books) {

         console.log("delete route for books" )

      savedBookShelf.length = 0

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
          review : ''
        }

        savedBookShelf.push(tempEntry)
        console.log(tempEntry)
      })

      res.render("books", {savedBookShelf})
    })
  })

     


  app.put("/books/:id", isAuthenticated, (req, res) => {

    console.log("hitting the put route")

    console.log(req.body.review)
    console.log(req.params.review)
    console.log(req.params.id)

    db.Bookshelf.update({ review: req.body.review }, 
      {where: { id: req.params.id }
  } )

  res.render("books", {savedBookShelf})

})



  app.post("/search/:id", isAuthenticated, (req, res) => {

    console.log("put route to add book to shelf" + "entry:" + req.params.id)

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
    var addISBN = bookArray[req.params.id].ISBN
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
      ISBN : addISBN,
      review : addReview,
      createdAt: req.user.createdAt,
      updatedAt: req.user.updatedAt,
      UserId: req.user.id
    }).then(function () {

      // render the entry that was chosen as well as the array of search results
      res.render('search', { title: addTitle, thumbnail: addThumbnail, author: addAuthor,  bookArray} )
    })

  })

  // search for books
  app.post("/search", isAuthenticated, (req, res) => {

    console.log("get this route")


    var search = "https://www.googleapis.com/books/v1/volumes?q=" + req.body.searchTerm +  book_API_key

    console.log(search)
 
    // use axios to call the google books api
    axios.get(search).then(data => {

      // use for IDs
      i = 0

      // loop through the search results and create a book entry for each result
      data.data.items.forEach(item => {

        // make sure tbhe return result entries exist--some entries have 
        // different structures in the response object
        if(!item.accessInfo)
        { ifWebReader = ''
        }
        else{ ifWebReader = item.accessInfo.webReaderLink}

        if(!item.volumeInfo.authors)
            {ifAuthor = ''}
        else{ifAuthor = item.volumeInfo.authors[0] }

        if(!item.volumeInfo.industryIdentifiers)
            { ifISBN = ''}
        else{ifISBN = item.volumeInfo.industryIdentifiers[0].identifier} 

        bookEntry =
        {
          id: i,
          title: item.volumeInfo.title,
          author: item.volumeInfo.authors[0],
          description: item.volumeInfo.description,
          datePublished: item.volumeInfo.publishedDate,
          pages: item.volumeInfo.pageCount,
          thumbnail: item.volumeInfo.imageLinks.thumbnail,
          infoLink : item.volumeInfo.infoLink,
          webReaderLink : ifWebReader,
          ISBN : ifISBN,
          review : ''
        };

        // so each ID is unique in this search
        i += 1

        // add entry to search results array
        bookArray.push(bookEntry)
      })

      // render the search results array
      res.render("search", {bookArray})
      })  
    })
}