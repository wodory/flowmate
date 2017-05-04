@import "lib/flowmate.js"
@import 'lib/options.js'
@import 'lib/util.js'

com.flowmate.extend ({
	createGroup: function (label) {
		log ("createGroup _ Label");

		var stepName 	= "Label",
			labelName 	= label.name,
			parent		= label.container,
			newGroup 	= this.addGroup(stepName + "_" + labelName, parent),
			bgShape 	= this.addShape("bg_" + labelName, newGroup),
			opt 		= this.options.label;

		label.name = "label_" + labelName;

		this.setFontStyle (label, {
			size : opt.fontSize,
			color : opt.fontColor
		});

		//Set BGShape size and styles
		this.setSize(bgShape, {
			width 	: label.frame.width + 10,
			height 	: label.frame.height + 10
		});

		log (label.frame.height + 10);
		log (bgShape)
		log (bgShape.frame.height);

		//Set shape color
		this.setShapeColor({
			target : bgShape,
			color : opt.shapeColor,
		});

		//set Position of Shape
		this.setPosition(bgShape, {
			type 	: "middle",
			x 		: label.sketchObject.frame().midX(),
			y 		: label.sketchObject.frame().midY()
		});

		this.addLayerToGroup({
			target : label,
			newGroup : newGroup
		});

		//Reset group size
		newGroup.adjustToFit();
	}
});

var onRun = function (context) {
	com.flowmate.init(context);
	com.flowmate.createSymbol();
}
