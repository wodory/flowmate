@import 'lib/flowmate.js'
@import 'lib/options.js'
@import 'lib/util.js'

com.flowmate.extend ({
	createGroup: function (label) {
		log ("createGroup _ Reference");

		var stepName 		= "Refernce",
			labelName 		= label.name,
			parent 			= label.container,
			newGroup 		= this.addGroup(stepName + "_" + labelName, parent),
			opt 			= this.options.reference,
			bgShape 		= this.addOval ("bg_" + labelName, newGroup)

		label.name = "label_" + labelName;

		this.addLayerToGroup({
			target 		: bgShape,
			newGroup 	: newGroup
		});

		//Set label style
		this.setFontStyle (label, {
			name : opt.fontName,
			size : opt.fontSize,
			color : opt.fontColor
		});

		//Set shape position
		this.setPosition (bgShape, {
			type : "middle",
			x : label.sketchObject.frame().midX(),
			y : label.sketchObject.frame().midY()
		});

		//Move label layer into the group
		this.addLayerToGroup({
			target : label,
			newGroup : newGroup
		});

		//newGroup.resizeToFitChildrenWithOption(true);
		newGroup.adjustToFit();
	}
});

var onRun = function (context) {
	com.flowmate.init(context);
	com.flowmate.createSymbol();
}
