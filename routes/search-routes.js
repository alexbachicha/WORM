// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");

require('dotenv').config();

// Requiring path to so we can use relative routes to our HTML files
const path = require("path");

const db = require('../models')

const axios = require('axios');
const { traceDeprecation } = require("process");
const bookshelf = require("../models/bookshelf");
//const { interfaces } = require("mocha");


const book_API_key = "&key=" + process.env.GITHUB_DEVELOPER_KEY

// total search items
var bookArray = []

// adding single book on bookshelf
var bookEntry

// global user variable, will need to save to storage later
var thisUser = [{}]


var savedBookShelf = []


var ifAuthor
var ifWebReader
var ifISBN



module.exports = (app) => {


  app.get("/main", isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "../public/homePage.html"));
  })

  app.get("/search", isAuthenticated, (req, res) => {

    console.log("hitting the get /search")
    res.render("search");
  })


  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/books", isAuthenticated, (req, res) => {
    db.Bookshelf.findAll({}).then(function (books) {


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
    })


    res.render("books", { savedBookShelf })


  })



  app.delete("/books/:id", isAuthenticated, (req, res) => {
    db.Bookshelf.destroy({ where: { id: req.params.id } }).then(function (deleted) {

      console.log("destroying" + deleted)

      savedBookShelf.splice(req.params.id, 1)

    })

    db.Bookshelf.findAll({}).then(function (books) {

      //   console.log("get route for books" )

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
          review : ''
        }

        savedBookShelf.push(tempEntry)
        console.log(tempEntry)
      })
    })

      res.render("books", {savedBookShelf})




  })

  app.put("/books/:id", isAuthenticated, (req, res) => {

    console.log("hitting the put route")

    console.log(req.body)
    console.log(req.params.review)
    console.log(req.params.id)

    db.Bookshelf.update({ review: req.body.review }, 
      {where: { id: req.params.id }
  } )

  res.render("books", {savedBookShelf})

})




  app.post("/search/:id", isAuthenticated, (req, res) => {

    console.log("put route to add book to shelf" + "entry:" + req.params.id)

    // if(bookArray[req.params.id])
    var addTitle = bookArray[req.params.id].title
    var addAuthor = bookArray[req.params.id].author
    var addDescription = bookArray[req.params.id].description
    var addDatePublished = bookArray[req.params.id].datePublished
    var addPages = bookArray[req.params.id].pages
    var addThumbnail = bookArray[req.params.id].thumbnail
    var addInfoLink = bookArray[req.params.id].infoLink
    var addWebReaderLink = bookArray[req.params.id].webReaderLink
    // var addISBN = 6767687896789bookArray[req.params.id].ISBN
    var addReview = bookArray[req.params.id].review
    var addISBN = 49494945

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
      res.render('search', { title: addTitle, thumbnail: addThumbnail, author: addAuthor, pages: addPages,  bookArray} )
    })


  })

  // search for books
  app.post("/search", isAuthenticated, (req, res) => {

    console.log("hit this route")



    var search = "https://www.googleapis.com/books/v1/volumes?q=" + req.body.searchTerm +  book_API_key

    console.log(search)
 

    axios.get(search).then(data => {

      i = 0

      data.data.items.forEach(item => {

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

        i += 1

        bookArray.push(bookEntry)
      })

      
      res.render("search", {bookArray})
      })

      console.log(bookArray)



  
    })

 


}