$(document).ready(function () {

    //only add tabs if there are multiple languages
    if ($('div.tab-container').length > 0) {
        $('div.tab-container').easytabs({
            animate: false,
            updateHash: false
        });
    }
    //switch all code samples to selected language on click
    $('div.tab-container ul li.tab').click(function() {

        //get the language from the active link href
        var codeLang = $(this).find('a.active').attr('href');
        //remove number and hash to get lang value without unique identifier.
        codeLang = codeLang.replace("#", "").replace(/\d/g, "");

        //find and update each set of code samples on the page
        $('div.tab-container ul li.' + codeLang).each(function() {

            // make the tab active and hide the other tabs
            $(this).addClass('active').siblings().removeClass('active');
            $(this).siblings().find('a').removeClass('active');
            $(this).find('a').addClass('active');

            //show the appropriate code sample, hide the others
            $(this).parent().siblings('div.' + codeLang).addClass('active').css('display', 'block');
            $(this).parent().siblings('div.codeSample').not('.' + codeLang).removeClass('active').css('display', 'none');
        });
    });
});

