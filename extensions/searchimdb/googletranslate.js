"use strict";

(function()
{

  var SELECTION_HANDLER_ID = "selection";
  var handlers = {};

  handlers[SELECTION_HANDLER_ID] = function(info, tab)
  {
    var target_language = window.localStorage.targetLanguage || "en";
    var url = "http://translate.google.com/#auto/" + target_language + "/" +
              encodeURIComponent(info.selectionText);
    window.open(url, "google-translate", "width=800, height=350, left=150, top=100").focus();
  };

  var contextmenu_handler = function(info, tab)
  {
    var handler = handlers[info.menuItemId];
    if (handler)
      handler(info, tab)
  };

  chrome.contextMenus.onClicked.addListener(contextmenu_handler);

  var menu_item =
  {
    "title": "Google Translate",
    // Contexts: "page", "selection", "link", "editable", "image", "video", "audio"
    "contexts": ["selection"],
    "id": SELECTION_HANDLER_ID
  };

  // Set up context menu tree at install time.
  chrome.runtime.onInstalled.addListener(function()
  {
    chrome.contextMenus.create(menu_item);
  });

})();
