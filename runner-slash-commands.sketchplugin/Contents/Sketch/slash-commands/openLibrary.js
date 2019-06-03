exports.onRun = (context) => {

  let libraryPath = context.runnerText.trim();
  try {
    AppController.sharedInstance().openDocumentAtPath_withParameters(decodeURIComponent(libraryPath), nil);
  }
  catch (exception) {
    UI.message("Could not open document");
  }

}

exports.onValidate = (context) => {
  let libraries = sketch.getLibraries();
  let items = [];
  let item;

  libraries.map(library => {
    if (library.libraryType == "User" && library.valid && library.enabled) {
      item = {};
      item.title = library.name;
      item.value = library.getDocument().path;
      items.push(item);
    }
  });

  context.runnerSlashCommand.setList(JSON.stringify(items));
}