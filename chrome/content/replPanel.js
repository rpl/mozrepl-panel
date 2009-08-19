Components.utils.import("resource://mozrepl-panel/modules/repl.jsm",this);
var session;
var session_windowlist_index;

function init() {
  session_windowlist_index = 0;
  document.getElementById("console-window-menulist").selectedIndex = session_windowlist_index;
  initREPLSession();
}

function initREPLSession() {
  alert(session_windowlist_index + ": " + REPL.getWindowByIndex(session_windowlist_index));
  session = REPL.initSession({
	targetWindow: REPL.getWindowByIndex(session_windowlist_index),
	onOutput: onREPLOutput,
	onQuit: onREPLQuit
  });
}

function onREPLOutput(string) {
  document.getElementById("console-output").textContent += string;
  var container = document.getElementById("console-output-container");
  setTimeout(function() { container.scrollTop = container.scrollHeight; },10);
}

function onREPLQuit() {
  alert("REPL session quit");
}

function onTextInput(target) {
  if(target) {
    session.onOutput(target.value+"\n");
    session.receive(target.value);
  }
}

function onWindowSelected(target) {
  if(session_windowlist_index != target.selectedIndex) {
    session_windowlist_index = target.selectedIndex;
    REPL.closeSession(session);
	initREPLSession();
  }
}

function onRefreshWindowList() {
  document.getElementById("console-window-menulist").builder.rebuild();
}

function destroy() {
  alert("REPL DESTROYED");
}