
  function validateEmail(email) {
    // http://stackoverflow.com/a/46181/11236
  
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  function checkForm() {
    var count = 0; 
    var name = $("#name").val();
    var email = $("#email").val();
    var message = $("#message").val();
    var error = "";
 
    //check if name is not empty
    if (name=="" || name == null ) {
        count += 1;
        error += count + "- Name is required <br>";
    }
 
     
    //check if email is correct
   if (!(validateEmail(email))) {
     count += 1;
     error += count + "- Email should be valid <br>";
   }
   
   if (message == "")  { 
       count += 1;
       error += count + "- Message is required <br>";
   } 
  
   if (error != "") {
        $("#result").html("<span style=\"color:red;\">" + "Please correct the following " + count + " errors:<br>" + error + "</span>");
   }

   else  {

        $.ajax({
          url: "https://formspree.io/f/xwkaewnl",
          type: 'post',
          data: $('#contact-form').serialize(),
          dataType: ' json',
          success: function (data) {
            $("#result").html("<span style=\"color:green;\">" + "Thanks! I'll get back to you soon :)" + "</span>");
            $('#contact-form')[0].reset();
          },
          error: function(data) {
            console.log(data);
            $("#result").html("<span style=\"color:red;\">" + "Error in sending the email :( Please drop an email at tushar(at)randomwits(dot)com." + error + "</span>");
            $('#contact-form')[0].reset();
          }
      });

     }

     return false;
 }
