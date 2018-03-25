//declare global methods here
var currentIndex = 0;
var lastIndex = 0;
// this will called when document is ready

$(function () {
    initializeIndex();
});

function initializeIndex() {
    currentIndex = $(".questionItem.visible").index();
    lastIndex = $(".questionItem").length - 1;
    if (currentIndex == lastIndex) {
        //disable next
        $(".next").prop("disabled", true);
    }
    if (currentIndex == 0)
        $(".previous").prop("disabled", true);
}

function showAnswer() {
    var elem = $(".questionItem.visible");
    var correctAnswer = elem.attr("data-answer");
    //highlight right answer
    elem.find(".choices").children().eq(correctAnswer - 1).addClass("correct");
    // alert(correctAnswer);

}

function getNext() {
    //clear correct or wrong classes
    $(".correct").removeClass("correct");
    if (currentIndex < lastIndex) {
        //hide the current element
        $(".questionItem").eq(currentIndex).removeClass("visible");
        $(".questionItem").eq(currentIndex).addClass("hide");
        //increament current index
        currentIndex++;
        //show the next element with new current index
        $(".questionItem").eq(currentIndex).addClass("visible");
        $(".questionItem").eq(currentIndex).removeClass("hide");
        if (currentIndex == lastIndex) {
            //disable next
            $(".next").prop("disabled", true);
        }
        if (currentIndex > 0) {
            $(".previous").prop("disabled", false);
        }
    }
}

function getPrevious() {
    //clear correct or wrong classes
    $(".correct").removeClass("correct");
    if (currentIndex > 0) {
        //hide the current element
        $(".questionItem").eq(currentIndex).removeClass("visible");
        $(".questionItem").eq(currentIndex).addClass("hide");
        //increament current index
        currentIndex--;
        //show the next element with new current index
        $(".questionItem").eq(currentIndex).addClass("visible");
        $(".questionItem").eq(currentIndex).removeClass("hide");
        if (currentIndex == 0) {
            //disable next
            $(".previous").prop("disabled", true);
        }
        if (currentIndex > 0) {
            $(".next").prop("disabled", false);
        }
    }
}