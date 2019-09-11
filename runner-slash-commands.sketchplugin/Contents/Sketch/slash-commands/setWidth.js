exports.onRun = (selectedLayers, amount) => {

  let width = amount.trim();
  try {
    let w = eval(width);
    width = w
  } catch (error) {}
  
  selectedLayers.map(layer => {
    let w = width;
    if ( typeof width == "string" && width.endsWith("%")) {
      w = layer.sketchObject.parentArtboard().absoluteRect().width()*parseFloat(width)/100;
    }
    layer.frame.width = Math.round(w);
  });

}