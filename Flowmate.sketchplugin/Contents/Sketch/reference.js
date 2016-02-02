@import 'lib/flowmate.js'
@import 'lib/options.js'
@import 'lib/util.js'

com.flowmate.extend ({
	createGroup: function (label) {
		log ("createGroup _ Decision");

		var stepName 		= "Refernce",
			labelString 	= label.stringValue(),
			newGroup 		= this.util.addGroup(stepName + "_" + labelString),
			opt 			= this.options.reference;

		label.setName ("label_" + labelString);

		//Set label style
		this.util.setFontStyle (label, {
			name : opt.fontName, 
			size : opt.fontSize,
			color : opt.fontColor
		});

		//Create background shape
		var shapeOption = {
			color 		: opt.shapeColor,
			width 		: opt.shapeSize,
			height 		: opt.shapeSize
		};
		
		var shapeName 	= "bg_" + labelString,
			shapeGroup 	= this.util.addOval(shapeName, newGroup, shapeOption);

		//Set shape position
		this.util.setPosition (shapeGroup, {
			type : "middle", 
			x : label.frame().midX(),
			y : label.frame().midY()
		});

		//Move label layer into the group
		this.util.moveLayer({
			target : label, 
			newGroup : newGroup
		});

		//Reset group size - newGroup.resizeRoot(0);
		if(newGroup.resizeRoot) { 
			newGroup.resizeRoot(true);
		} else if(newGroup.resizeToFitChildrenWithOption) {
			newGroup.resizeToFitChildrenWithOption(true);
		}
	}
});

var onRun = function (context) {
	com.flowmate.init(context);
	com.flowmate.createSymbol();
}