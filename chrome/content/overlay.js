function url(spec) {
  var ios = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
  return ios.newURI(spec, null, null);
}

function openInNewWindow() {
  window.open("chrome://mozrepl-panel/content/replPanel.xul", "",
              "chrome");
}

function openInNewTab() {
  var newtab = Application.activeWindow.open(url("chrome://mozrepl-panel/content/replPanel.xul"));
  newtab.focus();
}