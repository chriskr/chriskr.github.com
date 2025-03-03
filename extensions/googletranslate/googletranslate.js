"use strict";

(function () {
  var WIN_TARGET = "google-translate";
  var WIN_OPTIONS = "width=800, height=500, left=150, top=100";
  var BASE_URL = "https://translate.google.com/";

  // A generic onclick callback function.
  const genericOnClick = (info) => {
    switch (info.menuItemId) {
      case "google-translate": {
        const target_language = /*localStorage.targetLanguage ||*/ "en";
        const url = `${BASE_URL}??sl=auto&tl=${target_language}&text=${info.selectionText}`;
        const createDate = {
          type: chrome.windows.WindowType.POPUP,
          left: 150,
          top: 100,
          width: 800,
          height: 500,
          url,
        };
        chrome.windows.create(createDate);
        //open(url, WIN_TARGET, WIN_OPTIONS).focus();
        return;
      }
    }
  };

  // chrome.storage

  chrome.contextMenus.onClicked.addListener(genericOnClick);

  chrome.contextMenus.create({
    id: "google-translate",
    title: "Google Translate",
    /*
      Contexts:
        "page",
        "selection",
        "link",
        "editable",
        "image",
        "video",
        "audio"
    */
    contexts: ["selection"],
  });
})();
