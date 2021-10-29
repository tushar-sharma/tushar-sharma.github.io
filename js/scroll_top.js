$(document).ready(function(){

    // hide #back-top first
    $("#back-top").hide();

    // fade in #back-top
    $(function () {
        $(window).scroll(function () {

            let top = $(this).scrollTop();


            //if reached at the bottom, then disappear the scroll
            if(document.documentElement.scrollHeight == window.pageYOffset + window.innerHeight) {

                $('#back-top').fadeOut();

            }

            else if (top  > 100  ) {
                $('#back-top').fadeIn();
            } else {
                $('#back-top').fadeOut();
            }
        });

        // scroll body to 0px on click
        $('#back-top a').click(function () {
            $('body,html').animate({
                scrollTop: 0
            }, 800);
            return false;
        });
    });

});
