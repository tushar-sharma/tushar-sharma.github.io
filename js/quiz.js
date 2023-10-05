$(document).ready(function(){
    console.log("ready");

    function toggleQuiz(answerId) {
    
        var answer = document.getElementById(answerId);
        var button = event.currentTarget;

        if (button.getAttribute('data-showing') === 'false') {
    
            answer.style.display = "block";
    
            answer.textContent = "Hide Answer";
    
            button.setAttribute('data-showing', true);
    
        } else {
    
            answer.styles.display = "none";
    
            button.textContent = "Show Answer";
    
            button.setAttribute('data-showing', 'false');
    
        }
    }

});