@import 'lib/flowmate.js'
@import 'lib/options.js'
@import 'lib/util.js'

//overiding
com.flowmate.extend ({
	createGroup : function (label) {
		log ("createGroup _ Process");

		var stepName 	= "Process",
			labelName 	= label.name,
			opt 		= this.options.process,
			parent 		= label.container,
			newGroup 	= this.addGroup(stepName + "_" + labelName, parent),
			bgShape 	= this.addShape("bg_" + labelName, newGroup);

		//Set Layer name of label and styles
		label.name = "label_" + labelName;

		this.setFontStyle(label);

		//Set BGShape size and styles
		this.setSize(bgShape, {
			width 	: opt.shapeWidth,
			height 	: opt.shapeHeight
		});

		this.setBorder(bgShape, {
			color 		: opt.borderColor,
			thickness 	: opt.borderThickness
		});

		this.setGradient(bgShape, {
			startColor 	: opt.gradientStartColor,
			endColor 	: opt.gradientEndColor
		});

		//set Position of Shape
		this.setPosition(bgShape, {
			type 	: "middle",
			x 		: label.sketchObject.frame().midX(),
			y 		: label.sketchObject.frame().midY()
		});

		//Merge Shape and Label
		this.addLayerToGroup({
			target 		:  label,
			newGroup 	: newGroup
		});

		//newGroup.resizeToFitChildrenWithOption(true);
		newGroup.adjustToFit();
	}
});

var onRun = function (context) {
	log ("onRun");

	com.flowmate.init(context);
	com.flowmate.createSymbol("Process");


};
