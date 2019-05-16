var sketch = require('sketch/dom');
var UI = require('sketch/ui');
var Style = sketch.Style

var handleSlashCommand = function (context) {
  NSLog("SketchRunner: handleSlashCommand context: %@", context);

  /**
   * Hint : Look for these additional properties:
   * - context.runnerSlashCommand = "/your-command"
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

  if (commandID == "resize") {

    if (emptySelection(selectedLayers)) return;

    let width = parseFloat(params[0]) || 200;
    let height = parseFloat(params[1]) || 100;

    resizeLayers(selectedLayers, width, height);

  }

  else if (commandID == "makeGrid") {

    if (emptySelection(selectedLayers)) return;

    let rows = parseInt(params[0]) || 1;
    let columns = parseInt(params[1]) || 1;
    let verticalSpace = parseFloat(params[2]) || 0.0;
    let horizontalSpace = parseFloat(params[3]) || 0.0;

    // Group layers if /command is triggered with 'option'
    let shouldGroupLayers = context.runnerModifiers.option == 1;

    makeGridFromLayers(context.selection, rows, columns, verticalSpace, horizontalSpace, shouldGroupLayers);

  }

  else if (commandID == "createArtboard") {

    if (params.length == 1) {
      createArtboardInDocumentFromPreset(doc, params[0]);
      return;
    }

    let width = parseFloat(params[0]) || 375;
    let height = parseFloat(params[1]) || 667;

    createArtboardInDocument(doc, width, height);

  }

  else if (commandID == "addBorder") {

    if (params[0] == "help") {
      UI.alert("Help - Add Borders", "TODO: Add instructions");
      return;
    }

    if (emptySelection(selectedLayers)) return;

    addBorder(selectedLayers, params);

  }

  context.document.reloadInspector();

};

var emptySelection = function (selectedLayers) {
  if (selectedLayers.isEmpty) {
    UI.message("Select a layer!");
    return true;
  }
  return false;
}

var resizeLayers = function (layers, width, height) {

  layers.map(layer => {
    layer.frame.width = width;
    layer.frame.height = height;
  });

}

var makeGridFromLayers = function (layers, rows, columns, verticalSpace, horizontalSpace, shouldGroupLayers) {

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

var createArtboardInDocument = function (doc, width, height) {

  let artboard = new sketch.Artboard();
  let size = NSMakeSize(width, height);
  let origin = doc.selectedPage.sketchObject.originForNewArtboardWithSize(size);

  artboard.frame.x = origin.x;
  artboard.frame.y = origin.y;
  artboard.frame.width = width;
  artboard.frame.height = height;

  artboard.parent = doc.selectedPage;
  doc.centerOnLayer(artboard);

}

var createArtboardInDocumentFromPreset = function (doc, preset) {


  let key = preset.split(' ').join('').toLowerCase();
  let w = 0;
  let h = 0;

  switch (key) {
    case "iphone":
    case "iphone8":
      w = 375;
      h = 667;
      break;

    case "iphonex":
    case "iphonexs":
      w = 375;
      h = 812;
      break;


    case "iphonexr":
    case "iphonexsmax":
    case "iphonexmax":
      w = 414;
      h = 896;
      break;

    case "iphone8plus":
    case "iphone8+":
      w = 414;
      h = 736;
      break;

    case "iphonese":
      w = 320;
      h = 568;
      break;

    default:
      break;
  }
  // TODO: Add more presets!

  if (w == 0 && h == 0) {

    let width = parseInt(preset) || 0;
    if (width == 0) {
      UI.message('This preset is not supported yet, so using 375 x 667.');
      w = 375;
      h = 667;
    }
    else {
      w = h = width;
    }

  }

  createArtboardInDocument(doc, w, h);

}

var addBorder = function (selectedLayers, params) {

  let colorNames = MSImmutableColor.staticColorDictionary().allKeys();

  let top = null;
  let right = null;
  let bottom = null;
  let left = null;
  let color = null;
  let borderWidth = 0;
  let borderWidths = params;

  params.forEach(p => {

    if (p.startsWith("#") || colorNames.containsObject(p.toLowerCase())) {
      color = p.toLowerCase();
      const index = borderWidths.indexOf(p);
      if (index > -1) borderWidths.splice(index, 1);
    }

    if (p.endsWith("t") || p.endsWith("top")) {
      top = parseInt(p);
    }

    if (p.endsWith("r") || p.endsWith("right")) {
      right = parseInt(p);
    }

    if (p.endsWith("b") || p.endsWith("bottom")) {
      bottom = parseInt(p);
    }

    if (p.endsWith("l") || p.endsWith("left")) {
      left = parseInt(p);
    }

  });

  if (top == null && right == null && bottom == null && left == null) {

    if (borderWidths.length == 0) {
      borderWidth = 1;
    }
    else if (borderWidths.length == 1) {
      borderWidth = parseInt(borderWidths[0]);
    }
    else if (borderWidths.length == 2) {
      top = bottom = parseInt(borderWidths[0]);
      right = left = parseInt(borderWidths[1]);
    }
    else if (borderWidths.length == 3) {
      top = parseInt(borderWidths[0]);
      right = left = parseInt(borderWidths[1]);
      bottom = parseInt(borderWidths[2]);
    }
    else if (borderWidths.length == 4) {
      top = parseInt(borderWidths[0]);
      right = parseInt(borderWidths[1]);
      bottom = parseInt(borderWidths[2]);
      left = parseInt(borderWidths[3]);
    }

  }

  if (color == null) color = "#000";

  if (borderWidth != 0) {

    // Add a regular border
    selectedLayers.map(layer => {
      layer.style.borders = [
        {
          thickness: borderWidth,
          color: color,
          fillType: Style.FillType.Color,
          position: Style.BorderPosition.Outside,
        }
      ]
    });

  }
  else {

    // Add shadows as single borders
    let shadows = [];
    if (top != null) {
      shadows.push({
        color: color,
        blur: 0,
        y: -top
      });
    }
    if (bottom != null) {
      shadows.push({
        color: color,
        blur: 0,
        y: bottom
      });
    }
    if (right != null) {
      shadows.push({
        color: color,
        blur: 0,
        x: right
      });
    }
    if (left != null) {
      shadows.push({
        color: color,
        blur: 0,
        x: -left
      });
    }

    selectedLayers.map(layer => {
      layer.style.shadows = shadows;
    });
  }

}

var showHelp = function () {

  UI.message('Developer docs are coming soon 🤞');

  //NSWorkspace.sharedWorkspace().openURL(NSURL.URLWithString("https://docs.sketchrunner.com/developers#slash-commands"));

}