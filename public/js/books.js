
// submission for main search function
/*$(function() {
$("#searchForm").on("submit", function(event) {
    
    console.log("hello")
    event.preventDefault();

    var searchTerm = $("#searchBooks").val()

    $.ajax("/api/Bookshelves", {
        type: "POST",
        data: searchTerm
    }).then(
        function() {
            console.log("searchsubmission step 1");
        }
    )

})
}) */