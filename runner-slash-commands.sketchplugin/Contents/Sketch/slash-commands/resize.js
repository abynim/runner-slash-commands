exports.onRun = (selectedLayers, params) => {

  let width = params[0] || 200;
  let height = params[1] || params[0] || 100;

  width = width.trim();
  try {
    let w = eval(width);
    width = w
  } catch (error) {}

  height = height.trim();
  try {
    let h = eval(height);
    height = h
  } catch (error) {}

  selectedLayers.map(layer => {
    let w = typeof width == "string" && width.endsWith("%") ? layer.sketchObject.parentArtboard().absoluteRect().width()*parseFloat(width)/100 : parseFloat(width);
    let h = typeof height == "string" && height.endsWith("%") ? layer.sketchObject.parentArtboard().absoluteRect().height()*parseFloat(height)/100 : parseFloat(height);
    layer.frame.width = Math.round(w);
    layer.frame.height = Math.round(h);
  });

}