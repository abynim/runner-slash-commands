exports.onRun = (context) => {
  let script = "var sketch = require('sketch/dom');\nvar UI = require('sketch/ui');\n"
    script += context.runnerText;

    AppController.sharedInstance().runPluginScript_name(script, context.runnerSlashCommand);
}