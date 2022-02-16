$(document).ready(function(){

    document.getElementsByClassName('DarkReader_Button')[0].onclick = function() {
        darkmode()
    }

    let enabled = localStorage.getItem('dark-mode')

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
      document.getElementById('icon-dark').className = "fa fa-sun";
    }
    function disable() {
      DarkReader.disable();
      localStorage.setItem('dark-mode', 'false');
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
