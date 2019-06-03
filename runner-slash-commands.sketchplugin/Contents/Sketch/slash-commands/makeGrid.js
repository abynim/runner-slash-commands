exports.onRun = (context, params) => {

  let rows = parseInt(params[0]) || 1;
  let columns = parseInt(params[1]) || 1;
  let verticalSpace = parseFloat(params[2]) || 0.0;
  let horizontalSpace = parseFloat(params[3]) || verticalSpace;

  // Group layers if /command is triggered with 'option'
  let shouldGroupLayers = context.runnerModifiers.option == 1;
  let layers = context.selection;
  
  let firstLayer = layers.firstObject();
  let parentGroup = firstLayer.parentGroup();
  let originX = firstLayer.absoluteRect().x();

  let gridIndex = 0;
  let xPos = originX;
  let yPos = firstLayer.absoluteRect().y();
  let maxRowHeight = 0;
  let duplicateIndex = 0;
  let layersCount = layers.count();

  let layer;
  let lastAddedLayer;
  let duplicateLayer;
  let gridLayers = [];

  for (let r = 0; r < rows; r++) {

    maxRowHeight = 0;

    for (let c = 0; c < columns; c++) {

      if (gridIndex < layersCount) {
        layer = layers.objectAtIndex(gridIndex);
      }
      else {
        duplicateIndex = gridIndex % layersCount;
        duplicateLayer = layers.objectAtIndex(duplicateIndex);
        layer = duplicateLayer.duplicate();
        layer.removeFromParent();
        parentGroup.insertLayer_beforeLayer(layer, lastAddedLayer);
      }

      gridIndex++;
      layer.absoluteRect().setX(xPos);
      layer.absoluteRect().setY(yPos);

      xPos += layer.absoluteRect().width() + horizontalSpace;
      maxRowHeight = Math.max(maxRowHeight, layer.absoluteRect().height());

      lastAddedLayer = layer;
      gridLayers.push(layer);
    }

    xPos = originX;
    yPos += maxRowHeight + verticalSpace;
  }

  if (shouldGroupLayers) {

    let layersForGroup = MSLayerArray.arrayWithLayers(gridLayers.reverse());
    let group = MSLayerGroup.groupWithLayers(layersForGroup);
    group.name = gridLayers.length + " Items";

    parentGroup.fixGeometryWithOptions(1);
    group.select_byExtendingSelection(0, 0);
    gridLayers = group.layers();

  }

  gridLayers.forEach(lyr => {
    lyr.select_byExtendingSelection(true, true);
  });

}
