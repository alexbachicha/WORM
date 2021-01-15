// api key for google books
const book_API_key = "&key=" + "AIzaSyAkvUj8_4TNZZKs824LPeBjoa8UJad7unY"


$.ajax({
    type: "GET",
    url: "https://www.googleapis.com/books/v1/volumes?" + book_API_key,
    async: true,
    dataType: "jsonp",
    success: function (json) {

        console.log(json)

    }
})
