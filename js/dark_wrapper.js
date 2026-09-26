$(document).ready(function(){

    const darkButton = document.getElementsByClassName('DarkReader_Button')[0];
    if (darkButton) {
      darkButton.onclick = function() {
        darkmode()
      }
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
      const icon = document.getElementById('icon-dark');
      if (icon) {
        icon.innerHTML = "&#9728;";
      }
      if (darkButton) {
        darkButton.setAttribute('aria-pressed', 'true');
        darkButton.setAttribute('title', 'Turn off dark mode');
        darkButton.setAttribute('aria-label', 'Turn off dark mode');
      }

    }
    function disable() {
      DarkReader.disable();
      localStorage.setItem('dark-mode', 'false');
       audio.src = "../sounds/static_switch-off.mp3";
      audio.play();
     const icon = document.getElementById('icon-dark');
     if (icon) {
       icon.innerHTML = "&#9790;";
     }
     if (darkButton) {
       darkButton.setAttribute('aria-pressed', 'false');
       darkButton.setAttribute('title', 'Turn on dark mode');
       darkButton.setAttribute('aria-label', 'Turn on dark mode');
     }
    }
    function darkmode() {
      if (localStorage.getItem('dark-mode') === 'false') {
          enable();
      } else {
          disable();
      }
    }

    window.toggleDarkMode = darkmode;
});
