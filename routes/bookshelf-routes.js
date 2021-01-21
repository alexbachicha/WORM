// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");

// Requiring path to so we can use relative routes to our HTML files
const path = require("path");

const db = require('../models')

const axios = require('axios');
const { traceDeprecation } = require("process");
const bookshelf = require("../models/bookshelf");
const { interfaces } = require("mocha");

const book_API_key = "&key=" + "AIzaSyAkvUj8_4TNZZKs824LPeBjoa8UJad7unY"

// total search items
var bookArray = []

// adding single book on bookshelf
var bookEntry


module.exports = (app) => {

    // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/Bookshelves", isAuthenticated, (req, res) => {
      db.Bookshelf.findAll({
          where: {
              userId: req.user.id
          }
      }).then((bookshelves) => {
    res.render("search", {user: req.user, bookshelves});
        })
    });

    app.get("/bookshelf.html", isAuthenticated, (req, res) => {

        res.sendFile(path.join(__dirname, "../public/bookshelf.html"));
    })

    app.get("/search.html", isAuthenticated, (req, res) => {

        res.render('search');
    })


  /*  app.get("/Bookshelves", isAuthenticated, (req, res) => {
        const { title, author, datePublished, pages} = req.body
        db.Bookshelf.create({
            title,
            author,
            datePublished,
            pages,
            createdAt : req.user.createdAt,
            updatedAt : req.user.updatedAt,
            UserId: req.user.id
        }).then(() => {
      res.redirect("Bookshelves");
          })
      });

*/

      app.post("/search/:id", isAuthenticated, (req, res) => {

        console.log("put route to add book to shelf" + "entry:" + req.params.id)
       // db.Bookshelf.createreq.params.id

       if(bookArray[req.params.id])
       var addTitle = bookArray[req.params.id].title
       var addAuthor = bookArray[req.params.id].authors
       var addDescription = bookArray[req.params.id].description
       var addPublishedDate = bookArray[req.params.id].publishedDate
       var addPages = bookArray[req.params.id].pages
       var addThumbnail = bookArray[req.params.id].thumbnail

       console.log(addPages + addTitle)

       console.log(db.Bookshelf)
     
      // db.User.hasMany()
    db.Bookshelf.create({ 
                    title: addTitle, 
                    author: addAuthor,
                    description: addDescription,
                    datePublised: addPublishedDate,
                    pages: addPages,
                    thumbnail: addThumbnail,
          //          createdAt : req.user.createdAt,
           //         updatedAt : req.user.updatedAt,
           //         UserId: req.user.id
                    }).then(function(dbBookShelf) {
                        res.json(dbBookshelf)
                    }).catch(function(err) {
                        res.json(err);
                    });


                   
      
    })

      app.post("/search", isAuthenticated, (req, res) => {

        console.log("hit this route")

        var search = "https://www.googleapis.com/books/v1/volumes?q=" + req.body.searchTerm + book_API_key

        bookArray = []

        axios.get(search).then(data => {

            
            i = 0

            data.data.items.forEach(item => {

                bookEntry =   
                    { id: i, 
                    title: item.volumeInfo.title, 
                    author: item.volumeInfo.authors[0], 
                    description: item.volumeInfo.description,
                    publishedDate: item.volumeInfo.publishedDate,
                    pages: item.volumeInfo.pageCount,
                    thumbnail: item.volumeInfo.imageLinks.thumbnail
                     };

                     i += 1

                var title = item.volumeInfo.title
                var author = item.volumeInfo.authors[0]
                var description = item.volumeInfo.description
                var publishedDate = item.volumeInfo.publishedDate
                var pages = item.volumeInfo.pageCount
                var thumbnail = item.volumeInfo.imageLinks.thumbnail;

                console.log(item.volumeInfo.title)
                console.log(item.volumeInfo.author)
                console.log(item.volumeInfo.description)
                console.log(item.volumeInfo.publishedDate)
                console.log(item.volumeInfo.pageCount)
                console.log(item.volumeInfo.imageLinks.thumbnail)

                bookArray.push(bookEntry)

                db.Bookshelf.create = 
                ({ title, 
                    author, 
                    description,
                    publishedDate,
                    pages,
                    thumbnail  })
                    })

                    console.log(bookArray)

                   
                    res.render('search', {bookArray})
           // data.data.items.forEach(item => console.log(item.volumeInfo.description))
           // data.data.items.forEach(item => console.log(item.volumeInfo.publishedDate))
           // data.data.items.forEach(item => console.log(item.volumeInfo.pageCount))

        })

      })
      

}