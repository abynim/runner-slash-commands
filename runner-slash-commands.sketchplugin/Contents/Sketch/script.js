var sketch = require('sketch/dom');
var UI = require('sketch/ui');

var handleSlashCommand = function (context) {
  // NSLog("[SketchRunner] handleSlashCommand context: %@", context);

  /**
   * Hint : Look for these additional properties:
   * - context.runnerSlashCommandName = "/your-command"
   * - context.runnerText = "text entered by the user"
   * - context.runnerModifiers = {
   *      shift: 0,
   *      command: 0,
   *      option: 0,
   *      control: 0
   *   }
   */

  let doc = sketch.getSelectedDocument();
  let selectedLayers = doc.selectedLayers;

  const commandID = context.command.identifier();
  const delimiter = ",";
  const params = context.runnerText.split(delimiter).filter(p => { return p != "" }).map(p => { return p.trim(); });

  if (commandID == "runJSCode") {

    require('./slash-commands/runJSCode').onRun(context);
    return;

  }
  else if (commandID == "resize") {

    if (emptySelection(selectedLayers)) return;

    require('./slash-commands/resize').onRun(selectedLayers, params);

  }

  else if (commandID == "setContraints") {

    if (emptySelection(selectedLayers)) return;

    require('./slash-commands/setConstraints').onRun(selectedLayers, context);
    
  }

  else if (commandID == "makeGrid") {

    if (emptySelection(selectedLayers)) return;

    require('./slash-commands/makeGrid').onRun(context, params);

  }

  else if (commandID == "createArtboard") {

    require('./slash-commands/createArtboard').onRun(doc, params);

  }

  else if (commandID == "addBorder") {

    if (params[0] == "help") {
      UI.alert("Help - Add Borders", "TODO: Add instructions");
      return;
    }

    if (emptySelection(selectedLayers)) return;

    require('./slash-commands/addBorder').onRun(selectedLayers, params);

  }

  else if (commandID == "setFill") {

    let color = params[0] || "#000";

    require('./slash-commands/setFill').onRun(selectedLayers, color);

  }

  else if (commandID == "openLibrary") {
    
    require('./slash-commands/createArtboard').onRun(context);

  }

  context.document.reloadInspector();

};

var handleValidateCommand = function (context) {
  //NSLog("[SketchRunner] handleValidateCommand context: %@", context);
  
  /**
   * Hint : Runner calls this method when the user selects your command.
   * 
   * This is your chance to validate the current context.
   * For example, whether a certain type of layer must be selected, etc.
   * 
   * You can also provide an array of suggestions to help the user enter a value.
   * Use context.runnerSlashCommand.setList( JSON.stringify(list) );
   */

  let doc = sketch.getSelectedDocument();
  let selectedLayers = doc.selectedLayers;

  const commandID = context.command.identifier();

  if (commandID == "createArtboard") {

    require('./slash-commands/createArtboard').onValidate(context);

  }

  else if (commandID == "openLibrary") {

    require('./slash-commands/openLibrary').onValidate(context);
    
  }
  
  else if (commandID == "makeGrid" || commandID == "setContraints" || commandID == "resize") {

    emptySelection(selectedLayers);

  }
}

var emptySelection = function (selectedLayers) {
  if (selectedLayers.isEmpty) {
    UI.message("Select a layer!");
    return true;
  }
  return false;
}

var showHelp = function () {

  UI.message('Documentation is coming soon 🤞');

  // TODO: Add developer docs
  // NSWorkspace.sharedWorkspace().openURL(NSURL.URLWithString("https://docs.sketchrunner.com/developers#slash-commands"));

}