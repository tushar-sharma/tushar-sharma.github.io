(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var videoLinks = document.querySelectorAll(".album-video[data-video-url]");
    if (!videoLinks.length) return;

    var modal = document.createElement("div");
    modal.className = "album-video-modal";
    modal.hidden = true;
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Video player");
    modal.innerHTML =
      '<button class="album-video-close" type="button" aria-label="Close video">&times;</button>' +
      '<div class="album-video-frame"><iframe title="Video player" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>';
    document.body.appendChild(modal);

    var frame = modal.querySelector(".album-video-frame");
    var iframe = modal.querySelector("iframe");
    var closeButton = modal.querySelector(".album-video-close");
    var activeLink = null;

    function closeVideo() {
      modal.hidden = true;
      iframe.src = "";
      document.body.style.overflow = "";
      if (activeLink) activeLink.focus();
    }

    videoLinks.forEach(function (link) {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        activeLink = link;
        frame.classList.toggle(
          "is-portrait",
          link.dataset.videoOrientation === "portrait"
        );
        iframe.src = link.dataset.videoUrl + "?autoplay=1&rel=0";
        modal.hidden = false;
        document.body.style.overflow = "hidden";
        closeButton.focus();
      });
    });

    closeButton.addEventListener("click", closeVideo);
    modal.addEventListener("click", function (event) {
      if (event.target === modal) closeVideo();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !modal.hidden) closeVideo();
    });
  });
})();
