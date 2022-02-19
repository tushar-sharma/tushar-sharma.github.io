function updateClock() {
    var currentTime = new Date();
    // Operating System Clock Hours for 12h clock
    var currentHoursAP = currentTime.getHours();
    // Operating System Clock Hours for 24h clock
    var currentHours = currentTime.getHours();
    // Operating System Clock Minutes
    var currentMinutes = currentTime.getMinutes();
    // Operating System Clock Seconds
    var currentSeconds = currentTime.getSeconds();
    var totalSeconds = (currentHours * 3600) + (currentMinutes * 60) + currentSeconds;
    // Calculate birth and death rate
    var b = Math.round(totalSeconds * 4.443);
    var d = Math.round(totalSeconds * 1.865);
    var births = b.toLocaleString();
    var deaths = d.toLocaleString();

    // Adding 0 if Minutes & Seconds is More or Less than 10
    currentMinutes = (currentMinutes < 10 ? "0" : "") + currentMinutes;
    currentSeconds = (currentSeconds < 10 ? "0" : "") + currentSeconds;
    // Picking "AM" or "PM" 12h clock if time is more or less than 12
    var timeOfDay = (currentHours < 12) ? "AM" : "PM";
    // transform clock to 12h version if needed
    currentHoursAP = (currentHours > 12) ? currentHours - 12 : currentHours;
    // transform clock to 12h version after mid night
    currentHoursAP = (currentHoursAP == 0) ? 12 : currentHoursAP;
    // display time
    var currentTimeString = "Local Time: "    + currentHoursAP + ":" + currentMinutes + ":" + currentSeconds + " " + timeOfDay;
    // display birth and death rate as strings
    var birthString = "Number of Births Today: " + births;
    var deathString = "Number of Deaths Today: " + deaths;
    
    $("#clock").html(currentTimeString);
    $("#birthCounter").html(birthString);
    $("#deathCounter").html(deathString)}

    $(document).ready(function () {
        setInterval(updateClock, 1000);
});

       /*
        * World Populution Counter - By JavaScript Kit (http://www.javascriptkit.com)
        * Based on code by Adam Brown
        * This notice MUST stay intact for use
        * Visit JavaScript Kit (http://www.javascriptkit.com) for this script and more
        */
        
       function maind(){
        startdate = new Date()
        now(startdate.getYear(),startdate.getMonth(),startdate.getDate(),startdate.getHours(),startdate.getMinutes(),startdate.getSeconds())
    }
    
    
    function ChangeValue(number,pv){
        numberstring =""
        var j=0 
        var i=0
        while (number > 1)
         { 
    
            numberstring = (Math.round(number-0.5) % 10) + numberstring
            number= number / 10
            j++
            if (number > 1 && j==3) { 
                numberstring = "," + numberstring 
                j=0}
            i++
         }
    
         numberstring=numberstring
    
    if (pv==1) {document.getElementById("worldpop").innerHTML=numberstring }
    }
    
    
    function now(year,month,date,hours,minutes,seconds){       
    startdatum = new Date(year,month,date,hours,minutes,seconds)
    
    var now = 5600000000.0
    var now2 = 5690000000.0
    var groeipercentage = (now2 - now) / now *100
    var groeiperseconde = (now * (groeipercentage/100))/365.0/24.0/60.0/60.0 
    nu = new Date ()                
    schuldstartdatum = new Date (96,1,1)                            
    secondenoppagina = (nu.getTime() - startdatum.getTime())/1000
    totaleschuld= (nu.getTime() - schuldstartdatum.getTime())/1000*groeiperseconde + now
    ChangeValue(totaleschuld,1);
    
    
    timerID = setTimeout("now(startdatum.getYear(),startdatum.getMonth(),startdatum.getDate(),startdatum.getHours(),startdatum.getMinutes(),startdatum.getSeconds())",200)
    }
    
  window.onload=maind