/**
 * Using Fisher Yates shuffle algorithm
 */
function randomize() {
  var arr = new Array('A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z');
  for (i = arr.length -1; i >0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = arr[i]; 
      arr[i] = arr[j];
      arr[j] = temp;
  }
  return arr.join('');
}

function submitForm(button) {

 if (button.value == "Encrypt/Decrypt") {
    var msg = document.getElementById('cipher1').value.toLowerCase();
    var alphabet = document.getElementById('alphabet').value.toLowerCase();
 
    var pos = 0;
    var result = '';
    var vikalpa = function(msg, alphabet) { 
        for (i = 0; i < msg.length; ++i) {
          pos = alphabet.indexOf(msg.substr(i,1));
	  if (pos > -1) {
	      newPos = pos - 13;
	      if (newPos < 0) {
	          newPos += 26;
	      }
	      result += alphabet.charAt(newPos);
	  } else { 
	    result += msg.substr(i,1);
	  }
        }
        document.getElementById('result1').innerHTML = result.toUpperCase();
    }

    vikalpa(msg, alphabet);

  } else if (button.value == "Clear Form") {
    document.getElementById('form1').reset();
  } else if (button.value == "Change") {
      return randomize();
  }
  return false;
}

