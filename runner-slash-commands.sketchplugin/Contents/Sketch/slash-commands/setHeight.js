exports.onRun = (selectedLayers, amount) => {

  let height = amount.trim();
  try {
    let h = eval(height);
    height = h
  } catch (error) {}
  
  selectedLayers.map(layer => {
    let h = height;
    if ( typeof height == "string" && height.endsWith("%")) {
      h = layer.sketchObject.parentArtboard().absoluteRect().height()*parseFloat(height)/100;
    }
    layer.frame.height = Math.round(h);
  });

}