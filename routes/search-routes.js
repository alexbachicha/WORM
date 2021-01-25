// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");

// Requiring path to so we can use relative routes to our HTML files
const path = require("path");

const db = require('../models')

const axios = require('axios');
const { traceDeprecation } = require("process");
const bookshelf = require("../models/bookshelf");
//const { interfaces } = require("mocha");

const book_API_key = "&key=" + "AIzaSyAkvUj8_4TNZZKs824LPeBjoa8UJad7unY"

// total search items
var bookArray = []

// adding single book on bookshelf
var bookEntry

// global user variable, will need to save to storage later
var thisUser = [{}]

var chosenBooksArray = []

var savedBookShelf = []

var addFromSearch = {}




module.exports = (app) => {


  app.get("/main", isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "../public/homePage.html")); 
  })

  app.get("/search", isAuthenticated, (req, res) => {
    res.render("search"); 
  })
  

    // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/bookshelves", isAuthenticated, (req, res) => {
      db.Bookshelf.findAll({}).then( function(books) {
    

        console.log("get route for bookshelves" )

        savedBookShelf = []
        
        books.forEach(item => {
          var tempEntry = {
                          id: item.id,
                          title: item.title,
                          author :item.author,
                          description : item.description,
                          datePublished: item.datePublished,
                          pages : item.pages,
                          thumbnail : item.thumbnail,
                          infoLink : item.infoLink, }
                          savedBookShelf.push(tempEntry)
                          console.log(tempEntry)
          } )
        })

          
        res.render("bookshelves", {savedBookShelf})
        
        
  })

  // app.get("/search/search", isAuthenticated, (req, res) => {

   
  // })

      // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
//   app.get("/search/bookshelves", isAuthenticated, (req, res) => {
//     db.Bookshelf.findAll({}).then( function(books) {
  
//       console.log("get route for bookshelves" )

      
//       books.forEach(item => {
//         var tempEntry = {
//                         id: item.id,
//                         title: item.title,
//                         author :item.author,
//                         description : item.description,
//                         datePublished: item.datePublished,
//                         pages : item.pages,
//                         thumbnail : item.thumbnail }

//                         savedBookShelf.push(tempEntry)
//                         console.log(tempEntry)
//         } )
//       })

        
//       res.render("bookshelves", {savedBookShelf})
      
      
// })


  
   // app.get("/bookshelf.html", isAuthenticated, (req, res) => {

//        res.sendFile(path.join(__dirname, "../public/bookshelf.html"));
//    })

  //  app.get("/search", isAuthenticated, (req, res) => {

      //db.Bookshelf.findAll({}).then(function(chosenBooks) {}
   //   res.render('search');
 //   })


     //   chosenBooks.toJSON()

   //     console.log("get route" + chosenBooks.title)
  

 //     })
        
  //  })


      app.get("/bookshelves/:id", isAuthenticated, (req, res) => {
        db.Bookshelf.destroy({ where: { id: req.params.id} }).then(function(deleted) {

          console.log("destroying" + deleted)
        
        })

        db.Bookshelf.findAll({}).then( function(books) {
    
       //   console.log("get route for bookshelves" )
  
       savedBookShelf = []
          
          books.forEach(item => {
            var tempEntry = {
                            id : item.id,
                            title: item.title,
                            author :item.author,
                            description : item.description,
                            datePublished: item.datePublished,
                            pages : item.pages,
                            thumbnail : item.thumbnail,
                             infoLink: item.infoLink, }
                            savedBookShelf.push(tempEntry)
                            console.log(tempEntry)
            } )
          })
  
  
         // res.redirect('/bookshelves')
        //  res.render("bookshelves", {savedBookShelf})
          res.redirect('/bookshelves/')
          
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
  
       /*thisUser =*/ db.Bookshelf.create({ 
                     title: addTitle, 
                     author: addAuthor,
                    description: addDescription,
                    datePublished: addDatePublished,
                     pages: addPages,
                     thumbnail: addThumbnail,
                     infoLink : addInfoLink,
                    createdAt : req.user.createdAt,
                    updatedAt : req.user.updatedAt,
                    UserId: req.user.id
                    }).then(function(chosenBooks){

                      console.log("This is what I clicked" + chosenBooks)

                      res.render('search',  {chosenBooks, bookArray} )
                    })

           
      
           //   res.render('search', {bookArray, chosenBooks})

    })

    // search for books
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
                    datePublished: item.volumeInfo.publishedDate,
                    pages: item.volumeInfo.pageCount,
                    thumbnail: item.volumeInfo.imageLinks.thumbnail,
                    infoLink: item.volumeInfo.infoLink
                     };

                     i += 1

                var title = item.volumeInfo.title
                var author = item.volumeInfo.authors[0]
                var description = item.volumeInfo.description
                var publishedDate = item.volumeInfo.publishedDate
                var pages = item.volumeInfo.pageCount
                var thumbnail = item.volumeInfo.imageLinks.thumbnail;

        //       console.log(item.volumeInfo.title)
         //       console.log(item.volumeInfo.authors[0])
        //        console.log(item.volumeInfo.description)
        //        console.log(item.volumeInfo.publishedDate)
        //        console.log(item.volumeInfo.pageCount)
        //        console.log(item.volumeInfo.imageLinks.thumbnail)

                bookArray.push(bookEntry)

           /*     db.Bookshelf.create = 
                ({ title, 
                    author, 
                    description,
                    publishedDate,
                    pages,
                    thumbnail  }) */
                    })

               //     console.log(bookArray)

                    res.render('search', {bookArray})
           // data.data.items.forEach(item => console.log(item.volumeInfo.description))
           // data.data.items.forEach(item => console.log(item.volumeInfo.publishedDate))
           // data.data.items.forEach(item => console.log(item.volumeInfo.pageCount))

        })

      })
      

}