$(document).ready(function(){

    document.getElementsByClassName('DarkReader_Button')[0].onclick = function() {
        darkmode()
    }

    let enabled = localStorage.getItem('dark-mode')
    let audio = document.createElement('audio');

    if (enabled === null) {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          enable();
      }
    } else if (enabled === 'true') {
      enable()
    }

    function enable()  {
      DarkReader.setFetchMethod(window.fetch)
      DarkReader.enable();
      localStorage.setItem('dark-mode', 'true');
      audio.src = "../sounds/static_switch-on.mp3";
      audio.play();
      document.getElementById('icon-dark').className = "fa fa-sun";

    }
    function disable() {
      DarkReader.disable();
      localStorage.setItem('dark-mode', 'false');
       audio.src = "../sounds/static_switch-off.mp3";
      audio.play();
     document.getElementById('icon-dark').className = "fa fa-cloud-moon";
    }
    function darkmode() {
      if (localStorage.getItem('dark-mode') === 'false') {
          enable();
      } else {
          disable();
      }
    }
});
