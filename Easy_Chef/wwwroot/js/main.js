//declare global methods here

// this will called when document is ready

$(function () {
    // initializeIndex();
});

function addToCart() {
    //alert("Todo:add to cart");
    var currentCount = parseInt($(".badge").text());
    $(".badge").text(currentCount + 1);
    $(".badge").addClass("active");
    $(".badge").removeClass("hide");
    $(".cart").addClass("active");
}
