exports.onRun = (selectedLayers, text) => {

  let cleanText = text.toLowerCase().trim();
  let firstLayer = selectedLayers.layers[0];
  const isGroup = selectedLayers.length == 1 && firstLayer.type === "Group";
  let finalLayers = isGroup ? firstLayer.layers : selectedLayers.layers;

  let axis = null;
  if (cleanText.includes("v")) {
    axis = "v";
  }
  else if (cleanText.includes("h")) {
    axis = "h";
  }
  else {
    // determine axis? Default to horizontal for now.
    axis = "h";
  }

  let align = null;
  if (cleanText.includes("t")) align = "top";
  else if (cleanText.includes("m") || cleanText.includes("c")) align = "center";
  else if (cleanText.includes("b")) align = "bottom";
  else if (cleanText.includes("l")) align = "left";
  else if (cleanText.includes("r")) align = "right";

  const isHorizontal = axis == "h";
  finalLayers = finalLayers.concat().sort(isHorizontal ? compareHorizontalPosition : compareVerticalPosition);

  let numericText = cleanText.replace(/[^\d.-]/g, '');
  let distance = parseFloat(numericText) || 0;

  let firstFrame = finalLayers[0].frame;
  let listXY = isHorizontal ? firstFrame.x : firstFrame.y;

  let minX = firstFrame.x;
  let minY = firstFrame.y;
  let maxX = firstFrame.x + firstFrame.width;
  let maxY = firstFrame.y + firstFrame.height;

  if (align != null) {
    finalLayers.map(layer => {
      minX = Math.min(minX, layer.frame.x);
      maxX = Math.max(maxX, layer.frame.x + layer.frame.width);
      minY = Math.min(minY, layer.frame.y);
      maxY = Math.max(maxY, layer.frame.y + layer.frame.height);
    });
  }

  let centerX = Math.round(minX + ((maxX - minX) / 2));
  let centerY = Math.round(minY + ((maxY - minY) / 2));
  minX = Math.round(minX);
  maxX = Math.round(maxX);
  minY = Math.round(minY);
  maxY = Math.round(maxY);

  finalLayers.map(layer => {
    if (isHorizontal) {
      layer.frame.x = listXY;
      listXY += layer.frame.width + distance;
      if (align != null) {
        if (align == "top") layer.frame.y = minY;
        else if (align == "center") layer.frame.y = Math.round(centerY - layer.frame.height / 2);
        else if (align == "bottom") layer.frame.y = Math.round(maxY - layer.frame.height);
      }
    }
    else {
      layer.frame.y = listXY;
      listXY += layer.frame.height + distance;
      if (align != null) {
        if (align == "left") layer.frame.x = minX;
        else if (align == "center") layer.frame.x = Math.round(centerX - layer.frame.width / 2);
        else if (align == "right") layer.frame.x = Math.round(maxX - layer.frame.width);
      }
    }
  });

  if (isGroup) firstLayer.adjustToFit();

}

const compareHorizontalPosition = (a, b) => {
  return a.frame.x - b.frame.x;
}

const compareVerticalPosition = (a, b) => {
  return a.frame.y - b.frame.y;
}