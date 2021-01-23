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

// global user variable, will need to save to storage later
var thisUser = [{}]

var chosenBooksArray = [{}]

var savedBookShelf = []

var addFromSearch




module.exports = (app) => {


  app.get("/Bookshelves", isAuthenticated, (req, res) => {
    res.render("Bookshelves")
  })

  app.get("/search.html", isAuthenticated, (req, res) => {
    res.render("search")
  })

    // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/Bookshelves", isAuthenticated, (req, res) => {
      db.Bookshelf.findAll({}).then( function(books) {
      //  books = books.values()
        console.log("get route for bookshelves" )

        savedBookShelf = []
        
        books.forEach(item => {
          var tempEntry = {
                          title: item.title,
                          author :item.author,
                          description : item.description,
                          datePublished: item.datePublished,
                          pages : item.pages,
                          thumbnail : item.thumbnail }
                          savedBookShelf.push(tempEntry)
                          console.log(tempEntry)
          } )

          
        res.render("Bookshelves", {savedBookShelf}) })
        
        //res.json(books) })
        //
        
  })


    

   // app.get("/bookshelf.html", isAuthenticated, (req, res) => {

//        res.sendFile(path.join(__dirname, "../public/bookshelf.html"));
//    })

    app.get("/search", isAuthenticated, (req, res) => {

      //db.Bookshelf.findAll({}).then(function(chosenBooks) {}
      res.render('search');
    })


     //   chosenBooks.toJSON()

   //     console.log("get route" + chosenBooks.title)
  

 //     })
        
  //  })


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

      app.delete("/search/:id", isAuthenticated, (req, res) => {

        thisUser.splice(req.params.id, 1)

        res.render('search', {thisUser, bookArray})


      })

      app.delete("/Bookshelves/:id", isAuthenticated, (req, res) => {
        db.Bookshelf.destroy()
      })

      app.post("/search/:id", isAuthenticated, (req, res) => {

        console.log("put route to add book to shelf" + "entry:" + req.params.id)

      // if(bookArray[req.params.id])
       var addTitle = bookArray[req.params.id].title
       var addAuthor = bookArray[req.params.id].author
       var addDescription = bookArray[req.params.id].description
       var addPublishedDate = bookArray[req.params.id].datePublished
       var addPages = bookArray[req.params.id].pages
       var addThumbnail = bookArray[req.params.id].thumbnail

  
    //   console.log(addTitle + addAuthor + addDescription + addPublishedDate + addPages + addThumbnail)

     //  db.Sequelize.Bookshelves.sync()

 //      var thisUser = db.Bookshelf.findAll({
   //         where: {
     //           userId: req.user.id
     //   }})

    //    thisUser.create({bookArray})

  
       /*thisUser =*/ db.Bookshelf.create({ 
                    title: addTitle, 
                    author: addAuthor,
                    description: addDescription,
                    datePublished: addPublishedDate,
                    pages: addPages,
                    thumbnail: addThumbnail,
          //          createdAt : req.user.createdAt,
           //         updatedAt : req.user.updatedAt,
                    UserId: req.user.id
                    }).then(function(chosenBooks){

                      res.render('search', {chosenBooks, bookArray})
                    })

                     // chosenBooksArray.push(chosenBooks) */
               //       console.log(chosenBooks.title + chosenBooks.pages)

                    //.then(function(dbBookShelf) {
                    //    res.json(dbBookshelf)
                   // }).catch(function(err) {
                    //    res.json(err);
                   // });
         //          var addTitle = thisUser.title
         //          var addAuthor = thisUser.author
            ///       var addDescription = thisUser.description
        //           var addPublishedDate = thisUser.datePublished
           //        var addPages = thisUser.pages
          //         var addThumbnail = thisUser.thumbnail
                 //  db.Bookshelf.save()

              //   thisUser = db.Bookshelf.findOne()

     /*         db.Bookshelf.findAll({}).then(function(chosenBooks) {
                // We have access to the todos as an argument inside of the callback function
                res.json(chosenBooks);

              })
*/
              //   console.log("created database entry, now what")

               //  console.log("adding to database" + thisUser.title)

              //   console.log(JSON.stringify(thisUser, null, 5))
                 

            /*     chosenBooks = { title: addTitle,
                                  author : thisUser.author,
                                  description : thisUser.description,
                                  datePublished: thisUser.datePublished,
                                  pages : thisUser.pages,
                                  thumbnail : thisUser.thumbnail }
*/
                 
          //  thisUser = db.Bookshelf.findAll()

          //  chosenBooks = db.Bookshelf.findAll()

         //   console.log(chosenBooks.toJSON())
            console.log(thisUser.title)
                  
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
                    author: JSON.stringify(item.volumeInfo.authors[0]), 
                    description: item.volumeInfo.description,
                    datePublished: item.volumeInfo.publishedDate,
                    pages: item.volumeInfo.pageCount,
                    thumbnail: item.volumeInfo.imageLinks.thumbnail
                     };

                     i += 1

                var title = item.volumeInfo.title
                var author = JSON.stringify(item.volumeInfo.authors[0])
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