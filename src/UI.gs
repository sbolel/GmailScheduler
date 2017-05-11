function doGet() {
 return HtmlService.createTemplateFromFile('User_UI.html').evaluate()
}

function getPrefs() {
  return loadPrefsForForm()
}

function savePrefs(form_object) {
  return savePrefsFromForm(form_object)
}

function restoreDefaultPrefs(form_object) {
  return clearPreferences()
}
