@import 'Flowmate/Flowmate.sketchplugin/Contents/Sketch/lib/flowmate.js'
@import 'Flowmate/Flowmate.sketchplugin/Contents/Sketch/lib/util.js'
@import 'Flowmate/Flowmate.sketchplugin/Contents/Sketch/lib/options.js'
@import 'Flowmate/Flowmate.sketchplugin/Contents/Sketch/process.js'

var sketch  = context.api();
var doc     = sketch.selectedDocument;
var page 	= doc.selectedPage;

var oPage = page.sketchObject;
var layers = oPage.layers();
var i = layers.length - 1 ;

while (layers.length > 0) {
    log (layers[i]);
    oPage.removeLayer(layers[i--])
}

var testText = page.newText ({
    frame : new sketch.Rectangle(0, 0, 200, 200),
    text : "Sample text"
})

testText.select();

com.flowmate.init(context);
com.flowmate.createSymbol("Process");
