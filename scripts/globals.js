var corsProxy = "http://localhost:8080/fetch?site=";
var myFactory = null;
// load only this much feeds
var CUTOFF = 6;
// after how many miliseconds to change the event
var INTERVAL = 7000;
var MAX_HEIGHT = (0.85 * screen.height) * 1;
var THUMBNAIL = "thumb";
// colors for event titles
var TITLEC_ON = "orange";
var TITLEC_OFF = "gray";
// event fired after an image is sucessfully retrieved
var RESOURCE_LOADED = new Event("resourceLoaded");
