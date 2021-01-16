// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");

const db = require('../models')

module.exports = (app) => {

    // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/Bookshelves", isAuthenticated, (req, res) => {
      db.Bookshelf.findAll({
          where: {
              userId: req.user.id
          }
      }).then((bookshelves) => {
    res.render("Bookshelves", {user: req.user, bookshelves});
        })
    });

    app.post("/Bookshelves", isAuthenticated, (req, res) => {
        const { title, author, datePublished, pages} = req.body
        db.Bookshelf.create({
            title,
            author,
            datePublished,
            pages,
            UserId: req.user.id
        }).then(() => {
      res.redirect("Bookshelves");
          })
      });


    app.post("/Bookshelves", isAuthenticated, (req, res) => {


        var searchParam = $('#searchBooks').val().trim()

        console.log("searching for books" + searchParam)

        $.ajax({
            url: "https://www.googleapis.com/books/v1/volumes?q=" + searchParam + book_API_key,
            async: true,
            dataType: "jsonp",
            success: function (jsonp) {

                console.log(jsonp)
                $('#results').text(jsonp)

            },
            type: "GET"
        })
    })
};
