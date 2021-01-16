// api key for google books
const book_API_key = "&key=" + "AIzaSyAkvUj8_4TNZZKs824LPeBjoa8UJad7unY"

const searchBooks = () => {

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
}


$('#searchForm').submit(searchBooks)