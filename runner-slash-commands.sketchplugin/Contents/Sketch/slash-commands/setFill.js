
var sketch = require('sketch/dom');
var Style = sketch.Style;

exports.onRun = (selectedLayers, color) => {

  selectedLayers.map(layer => {
    layer.style.fills = [
      {
        color: color,
        fillType: Style.FillType.Color
      }
    ]
  });

}