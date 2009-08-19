EXPORTED_SYMBOLS=["REPL"];

let Cc = Components.classes;
let Ci = Components.interfaces;
let Cu = Components.utils;
let Cr = Components.results;

function REPL() {};

let loader = Cc['@mozilla.org/moz/jssubscript-loader;1']
    .getService(Ci.mozIJSSubScriptLoader);
loader.loadSubScript('chrome://mozrepl/content/repl.js', REPL.prototype);

REPL.getWindowByIndex = function(index) {
  var wm = Cc['@mozilla.org/appshell/window-mediator;1']
      .getService(Ci.nsIWindowMediator);
  var win_enum = wm.getEnumerator(null);  
  var current_win = win_enum.getNext();;
  var i=0;

  while(i<index && win_enum.hasMoreElements()) {  
    current_win = win_enum.getNext();
    i++;
  } 
  
  return i==index ? current_win : null;
}  

/**
 options = {
   targetWindow: OBJECT,
   onOutput: CALLBACK,
   onQuit: CALLBACK
 }
**/
REPL.initSession = function (options) {
  var session = new REPL();
  session.onOutput = options.onOutput;
  session.onQuit = options.onQuit;
  session.init(options.targetWindow);

  return session;
}

REPL.closeSession = function (session) {
  session.quit();
}

