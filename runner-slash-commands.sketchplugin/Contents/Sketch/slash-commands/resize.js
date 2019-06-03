exports.onRun = (selectedLayers, params) => {

  let width = params[0] || 200;
  let height = params[1] || params[0] || 100;

  width = width.trim();
  height = height.trim();

  selectedLayers.map(layer => {
    let w = width.endsWith("%") ? layer.sketchObject.parentArtboard().absoluteRect().width() : parseFloat(width);
    let h = height.endsWith("%") ? layer.sketchObject.parentArtboard().absoluteRect().height() : parseFloat(height);
    layer.frame.width = w;
    layer.frame.height = h;
  });

}