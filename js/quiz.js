$(document).ready(function(){
    $('.quiz-btn').on('click', function(event) {
        toggleQuiz($(this).data('answer'), event);
    });

   function toggleQuiz(answerId, event){

        var answer = $("#" + answerId);
        var button = $(event.currentTarget);

        if (button.attr('data-showing') === 'false') {
            answer.show();
            button.text('Hide Answer');
            button.attr('data-showing', 'true');
        } else {
            answer.hide();
            button.text('Show Answer');
            button.attr('data-showing', 'false');
        }
    }

});