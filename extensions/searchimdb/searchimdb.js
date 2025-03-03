"use strict";

(function()
{
  var SELECTION_HANDLER_ID = "selection";
  var URL = "http://www.imdb.com/find?q=%s&s=all";
  var handlers = {};
  var imdb_tab_id = 0;

  handlers[SELECTION_HANDLER_ID] = function(info, tab)
  {
    var search = info.selectionText.replace(/\s+/g, "+");
    var props =
    {
      url: URL.replace("%s", search),
      active: true
    };

    chrome.tabs.getAllInWindow(function(tabs)
    {
      if (imdb_tab_id)
      {
        for (var i = 0, tab; (tab = tabs[i]) && tab.id != imdb_tab_id; i++);
        if (tab)
        {
          chrome.tabs.update(imdb_tab_id, props);
          return;
        }

        imdb_tab_id = 0;
      }

      for (var i = 0, tab; (tab = tabs[i]) && !tab.active; i++);
      if (tab)
        props.index = tab.index + 1;

      chrome.tabs.create(props, function(tab) { imdb_tab_id = tab.id; });
    });
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
    "title": "Search IMDB",
    // Contexts: "page", "selection", "link", "editable", "image", "video", "audio"
    "contexts": ["selection"],
    "id": SELECTION_HANDLER_ID
  };

  chrome.contextMenus.create(menu_item);

})();
