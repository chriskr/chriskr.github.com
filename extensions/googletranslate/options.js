document.onchange = function(event)
{
  window.localStorage.setItem("targetLanguage", event.target.value);
};

window.onload = function()
{
  var targetLanguage = window.localStorage.targetLanguage;
  if (targetLanguage)
    document.querySelector("input[value=" + targetLanguage + "]").checked = true;
};
