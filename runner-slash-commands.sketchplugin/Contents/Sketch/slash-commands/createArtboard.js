var sketch = require('sketch/dom');

exports.onRun = (doc, params) => {

  if (params.length == 1) {
    createArtboardInDocumentFromPreset(doc, params[0]);
    return;
  }

  let width = parseFloat(params[0]) || 375;
  let height = parseFloat(params[1]) || 667;

  createArtboardInDocument(doc, width, height);

}

exports.onValidate = (context) => {

  // Provide a list of artboard presets to choose from.
  if (MSArtboardPresetStore.systemCategories().count() == 0) {
    let defaultCategories = MSArtboardSystemCategories.defaultCategories()
    MSArtboardPresetStore.setSystemCategories(defaultCategories)
  }
  let store = MSArtboardPresetStore.alloc().init();
  let presets = store.categories().valueForKeyPath("@unionOfArrays.sections.presets.@unionOfArrays.self");
  let presetList = [];
  let preset;
  let item;

  for (let i = 0; i < presets.count(); i++) {
    preset = presets.objectAtIndex(i);
    item = {}
    item.title = `${preset.name()}`;
    item.description = `${preset.width()}px x ${preset.height()}px`;
    item.value = preset.width() + ", " + preset.height();
    presetList.push(item);
  }

  context.runnerSlashCommand.setList(JSON.stringify(presetList));

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

    preset = preset.replace(/×/g, 'x').replace(/\*/g, 'x');
    let width;
    let height;
    let dimensions = preset.toLowerCase().split('x');
    
    if(dimensions.length == 2) {
      width = parseInt(dimensions[0]);
      height = parseInt(dimensions[1]);
    }
    else {
      width = parseInt(preset) || 0;
    }
    
    if (width == 0) {
      UI.message('This preset is not supported yet, so using 375 x 667.');
      w = 375;
      h = 667;
    }
    else {
      w = width;
      h = height || width;
    }

  }

  createArtboardInDocument(doc, w, h);

}