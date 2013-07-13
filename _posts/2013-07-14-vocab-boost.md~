---
layout: post
title: BigBlueButton HTML5 Client
category: projects
tags: sidebar
name: bbb-html5-client
---

BigBlueButton web conferencing (rooms, whiteboard/slides, chat) all real-time in HTML5!

[details][details] &mdash; [code][client]

<!-- truncate_here -->

BigBlueButton HTML5 Client is an experimental HTML5 port of BigBlueButton, an open source web conferencing system, which allows real-time web conferencing in the browser featuring (private) meeting rooms, whiteboard/slides, chat, and much more, now all in HTML5!

In the summer of 2012, I had the pleasure of working at [Blindside Networks][bsn], an Ottawa-based startup driving the BigBlueButton project. [BigBlueButton][bbb] is an open-source web conferencing system designed for distance education. It helps educators and students connect and communicate using voice & video, whiteboard/slides, and text chat, all real-time in the browser.

During my stay, I worked on a brand spankin' new client for them in HTML5 to replace their current Flash implementation. Created from the ground up using Node.js, Socket.io, Redis, and lots of JavaScript I built out the existing features of their client into a brand new, HTML5 version (yes, it even works on your phone)!

Below is a screenshot of the prototype I built out:

![BigBlueButton HTML5 Demo](/img/bbb-html5.png "BigBlueButton HTML5 Demo")

As you can see, I didn't focus much on design but rather functionality. Currently the leads UI designer at Blindside Networks is [working on](http://www.bigbluebutton.org/2012/12/28/revisiting-the-html-5-ui-design/) a cleaner design for the HTML5 version.

Due to the limitations of HTML5, video and audio could not be added when I initially built the prototype. It features include meeting rooms with meeting-wide chat, custom uploadable slides with whiteboard functionality (lines/shapes/text annotations, clears/undos, pan/zoom) with real-time syncronization between every member of the meeting simultaneously, all using standard-compliant HTML5 and JavaScript.

### Adding Audio and Video support using WebRTC

I did get the chance to fool around with adding audio/video support to the BigBlueButton HTML5 client using WebRTC at a hackathon in Chattanooga, TN called Hackanooga. By the end of the weekend hackathon, I had WebRTC working across many different devices, all broadcasting and receiving audio and video from each-other. Due to the instability of WebRTC at that time, it was unable to be integrated cleanly into the HTML5 client, however in the future I expect to see this to be integrated.

- - -

[client code][client] &mdash; [webrtc code][webrtc]

[details]: /projects/bbb-html5-client
[client]: https://github.com/bigbluebutton/bigbluebutton/tree/master/labs/bbb-html5-client
[webrtc]: https://github.com/ryanseys/webrtc-test
[bbb]: http://www.bigbluebutton.org
[bsn]: http://www.blindsidenetworks.com/
