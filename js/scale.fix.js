$(document).ready(function(){function e(){for(t=0;t<n.length;t++)"viewport"==n[t].name&&(n[t].content="width=device-width, minimum-scale=0.25, maximum-scale=1.6")}var t,n=document.getElementsByTagName("meta");if(navigator.userAgent.match(/iPhone/i)){for(t=0;t<n.length;t++)"viewport"==n[t].name&&(n[t].content="width=device-width, minimum-scale=1.0, maximum-scale=1.0");document.addEventListener("gesturestart",e,!1)}});