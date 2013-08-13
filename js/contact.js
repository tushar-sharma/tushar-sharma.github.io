
  function validateEmail(email) {
    // http://stackoverflow.com/a/46181/11236
  
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  function checkForm() {
  
    var name = $("#name").val();
    var email = $("#email").val();
    var message = $("#message").val();
    var error = "";
 
    //check if name is not empty
    if (name=="" || name == null ) {
        error += "Name is required <br>";
    }
 
     
    //check if email is correct
   if (!(validateEmail(email))) {
     error += "Email should be valid <br>";
   }
   
   if (message == "")  { 
       error +="Message is required <br>";
   } 
  
   if (error != "") {
        $("#result").html("<span style=\"color:red;\">" + error + "</span>");
   }

   else  {
         $.ajax({
             dataType: 'jsonp',
             url: "http://getsimpleform.com/messages/ajax?form_api_token=d2e61898f5d1dbfc583d0acb7b95120f",
             data: $('#contact-form').serialize() 

           }).done(function() {
             $("#result").html("<span style=\"color:green;\">" + "Thanks! I'll get back to you soon :)" + "</span>");
           });
     }

     return false;
 }
