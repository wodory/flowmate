@import "lib/flowmate.js"
@import 'lib/options.js'
@import 'lib/util.js'

com.flowmate.extend ({
	createGroup: function (label) {
		log ("createGroup _ Label");

		var stepName 		= "Label",
			labelString 	= label.stringValue(),
			newGroup 		= this.util.addGroup(stepName + "_" + labelString),
			bgShape 		= this.util.addShape("bg_" + labelString, newGroup),
			opt 			= this.options.label;

		label.setName ("label_" + labelString); 

		this.util.setFontStyle (label, {
			size : opt.fontSize,
			color : opt.fontColor
		});

		//Set BGShape size and styles
		this.util.setSize(bgShape, {
			width 	: label.frame().width() + 10, 
			height 	: label.frame().height() + 10
		});

		//Set shape color
		this.util.setShapeColor({
			target : bgShape, 
			hex : opt.shapeColor,
		});
		
		//set Position of Shape
		this.util.setPosition(bgShape, {
			type 	: "middle",
			x 		: label.frame().midX(),
			y 		: label.frame().midY()
		});

		this.util.moveLayer({
			target : label,
			newGroup : newGroup
		});

		//Reset group size
		newGroup.resizeRoot(0);
	}
});

var onRun = function (context) {
	com.flowmate.init(context);
	com.flowmate.createSymbol();
}
