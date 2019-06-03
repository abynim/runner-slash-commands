exports.onRun = (selectedLayers, context) => {

  let pins = context.runnerText.split("");

    let fixEdges = pins.includes("e");
    let fixLeft = pins.includes("l");
    let fixTop = pins.includes("t");
    let fixRight = pins.includes("r");
    let fixBottom = pins.includes("b");
    let fixWidth = pins.includes("w");
    let fixHeight = pins.includes("h");

    selectedLayers.map(layer => {
      const sketchLayer = layer.sketchObject;
      sketchLayer.resetConstraints();
      if (fixEdges) {
        sketchLayer.setHasFixedEdges(1);
      } else {
        if (fixLeft && sketchLayer.canFixLeft()) sketchLayer.setHasFixedLeft(1);
        if (fixTop && sketchLayer.canFixTop()) sketchLayer.setHasFixedTop(1);
        if (fixRight && sketchLayer.canFixRight()) sketchLayer.setHasFixedRight(1);
        if (fixBottom && sketchLayer.canFixBottom()) sketchLayer.setHasFixedBottom(1);
        if (fixWidth && sketchLayer.canFixWidth()) sketchLayer.setHasFixedWidth(1);
        if (fixHeight && sketchLayer.canFixHeight()) sketchLayer.setHasFixedHeight(1);
      }
    });

}