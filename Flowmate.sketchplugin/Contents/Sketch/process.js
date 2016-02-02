@import 'lib/flowmate.js'
@import 'lib/options.js'
@import 'lib/util.js'

//overiding 
com.flowmate.extend ({
	createGroup : function (label) {
		log ("createGroup _ Process");

		var stepName 		= "Process",
			labelString 	= label.stringValue(),
			opt 			= this.options.process,
			newGroup 		= this.util.addGroup(stepName + "_" + labelString),
			bgShape 		= this.util.addShape("bg_" + labelString, newGroup);

		this.util.debug ("newGroup :" + newGroup);

		//Set Layer name of label and styles
		label.setName ("label_" + labelString);

		this.util.setFontStyle(label);
		
		//Set BGShape size and styles
		this.util.setSize(bgShape, {
			width 	: opt.shapeWidth, 
			height 	: opt.shapeHeight
		});
		
		this.util.setBorder(bgShape, {
			color 		: opt.borderColor,
			thickness 	: opt.borderThickness
		});
		
		this.util.setGradient(bgShape, {
			startColor 	: opt.gradientStartColor,
			endColor 	: opt.gradientEndColor
			
		});

		//set Position of Shape
		this.util.setPosition(bgShape, {
			type 	: "middle",
			x 		: label.frame().midX(),
			y 		: label.frame().midY()
		});
		
		//Merge Shape and Label
		this.util.moveLayer({
			target : label,
			newGroup : newGroup
		});

		if(newGroup.resizeRoot) { 
			newGroup.resizeRoot(true);
		} else if(newGroup.resizeToFitChildrenWithOption) {
			newGroup.resizeToFitChildrenWithOption(true);
		}
	}
});

var onRun = function (context) {
	log ("onRun");
	com.flowmate.init(context);
	com.flowmate.createSymbol("Process");	
};
