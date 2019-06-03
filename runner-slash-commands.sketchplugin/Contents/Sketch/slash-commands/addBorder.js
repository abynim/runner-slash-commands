exports.onRun = (selectedLayers, params) => {

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
        y: -top,
        x: 0
      });
    }
    if (bottom != null) {
      shadows.push({
        color: color,
        blur: 0,
        y: bottom,
        x: 0
      });
    }
    if (right != null) {
      shadows.push({
        color: color,
        blur: 0,
        x: right,
        y: 0
      });
    }
    if (left != null) {
      shadows.push({
        color: color,
        blur: 0,
        x: -left,
        y: 0
      });
    }

    selectedLayers.map(layer => {
      layer.style.shadows = shadows;
    });
  }

}