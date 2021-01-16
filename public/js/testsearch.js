// api key for google books
const book_API_key = "&key=" + "AIzaSyAkvUj8_4TNZZKs824LPeBjoa8UJad7unY"

const searchBooks = () => {

    var searchParam = $('#searchBooks').val().trim()

    console.log("searching for books" + searchParam)

    $.ajax({
        url: "https://www.googleapis.com/books/v1/volumes?q=" + searchParam + book_API_key,
        async: false,
        dataType: "jsonp",
        success: function (json) {

            console.log(json)
            $('#results').text(json)

        },
        type: "GET"
    })
}


$('#searchForm').submit(searchBooks)