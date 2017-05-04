@import 'lib/flowmate.js'
@import 'lib/options.js'
@import 'lib/util.js'

com.flowmate.extend ({
	createGroup : function (label) {
		log ("createGroup _ Decision");
		var stepName 	= "Decision",
			labelName 	= label.name,
			opt 		= this.options.decision,
			parent 		= label.container,
			newGroup 	= this.addGroup(stepName + "_" + labelName, parent),
			bgShape 	= this.drawDecisionShape(label, newGroup);

		label.name = "label_" + labelName;

		log (label.container)

		this.setFontStyle(label, {
			size: opt.fontSizeOfLabel
		});

		this.setShapeColor({
			target : bgShape,
			hex : opt.shapeColor,
		});

		this.addLayerToGroup({
			target : bgShape,
			newGroup : newGroup
		});

		//set Position of Label
		this.setPosition(label, {
			type : "topleft",
			x : bgShape.sketchObject.frame().midX() - label.sketchObject.frame().width() - 20,
			y : bgShape.sketchObject.frame().minY()
		});

		this.addLayerToGroup({
			target : label,
			newGroup : newGroup
		});

		//Add X, Y Directions
		this.addDirectionToDecision(newGroup, label, bgShape);

		newGroup.adjustToFit();
	},

	isDecision : function (shape) {
		return (shape.name().indexOf("Decision_") > -1);
	},

	drawDecisionShape : function (label) {
		log ('drawDecisionShape')


		var oLabel 		= label.sketchObject,
			labelFrame 	= oLabel.frame(),
			labelWidth 	= labelFrame.width(),
			labelHeight = labelFrame.height(),
			nSize 		= this.options.decision.shapeSize;
			shapePath 	= NSBezierPath.bezierPath(),

		shapePath.moveToPoint(NSMakePoint(labelFrame.midX(), labelFrame.midY() - nSize));
		shapePath.lineToPoint(NSMakePoint(labelFrame.midX() + nSize, labelFrame.midY()));
		shapePath.lineToPoint(NSMakePoint(labelFrame.midX(), labelFrame.midY() + nSize));
		shapePath.lineToPoint(NSMakePoint(labelFrame.midX() - nSize, labelFrame.midY()));

		shapePath.closePath();

		var shape = MSShapeGroup.shapeWithBezierPath(shapePath);
		//this.context.document.currentPage().addLayer(shape);

		log (shape)

		return this.doc.wrapObject(shape);
	},

	addDirectionToDecision : function (newGroup, label, shape) {
		log ("addDirectionToDecision");

		var labelFrame = label.sketchObject.frame(),
			shapeFrame = shape.sketchObject.frame();

		// create Y & N
		var textYes 			= this.addText("Condition-Yes", newGroup),
			textNo 				= this.addText("Condition-No", newGroup),
			textYesFrame 		= textYes.sketchObject.frame(),
			textNoFrame 		= textNo.sketchObject.frame(),
			shapeFrame 			= shape.sketchObject.frame(),
			conditionFontStyle 	= {
				name 	: this.options.decision.fontForCondition,
				size 	: this.options.decision.fontSizeOfCondition,
				color 	: this.options.decision.fontColorForCondition
			};

		textYes.sketchObject.setStringValue ("Y");
		textNo.sketchObject.setStringValue ("N");

		this.setFontStyle(textYes, conditionFontStyle);
		this.setFontStyle(textNo, conditionFontStyle);

		this.setPosition(textYes, {
			type 	: "middle",
			x 		: shapeFrame.maxX() - 11,
			y 		: shapeFrame.midY()
		});

		this.setPosition(textNo, {
			type 	: "middle",
			x 		: shapeFrame.midX(),
			y 		: shapeFrame.maxY() - 11
		})

		// Relocate the label
		this.setPosition(label, {
			type 	: "topleft",
			x 		: shapeFrame.midX() - labelFrame.width() - 20,
			y 		: shapeFrame.minY()
		})
	}
});

var onRun = function (context) {
	log ('onRun')

	com.flowmate.init(context);
	com.flowmate.createSymbol("Decision");
}

function addXYText(newGroup, label, shape) {
	var labelFrame = [label frame],
		shapeFrame = shape.frame();

	// create Y & N
	var textYes = newGroup.addLayerOfType("text"),
		textNo = newGroup.addLayerOfType("text"),
		textYesFrame = [textYes frame];
		textNoFrame = [textNo frame];

	textYes.setName("Y");
	textYes.setStringValue ("Y");
	textYes.fontSize = labelFontSizeForDecision;
	textYes.setFontPostscriptName(labelFontNameForDecision);
	textYes.textColor = MSColor.colorWithSVGString(labelFontColorBright);

	textNo.setName("N");
	textNo.setStringValue ("N");
	textNo.fontSize = labelFontSizeForDecision;
	textNo.setFontPostscriptName(labelFontNameForDecision);
	textNo.textColor = MSColor.colorWithSVGString(labelFontColorBright);


	var xYes = shapeFrame.midX() + 11,
		yYes = shapeFrame.midY();

	textYesFrame.setX(shapeFrame.midX() + 11);
	textYesFrame.setMidY(shapeFrame.midY());

	var xNo = shapeFrame.midX(),
			yNo = shapeFrame.maxY() - 16;

	textNoFrame.setMidX(shapeFrame.midX());
	textNoFrame.setY(shapeFrame.maxY() - 16);

	// Relocate the label
	labelFrame.setY(shapeFrame.minY());
	labelFrame.setX(shapeFrame.midX() - labelFrame.width() - 20);

	newGroup.resizeRoot(0);

}

/*  draw decision diamond shape for given label  */
function decisionShape(label)
{
	// get label size
	var labelFrame = [label frame];
	var labelWidth = [labelFrame width];
	var labelHeight = [labelFrame height];

	// set label style
	label.setFontPostscriptName(labelFontName);
	label.textColor = MSColor.colorWithSVGString(labelFontColor);
	label.setFontSize (decisionLabelFontSize);

	// set shape padding
	var nSize = 25,
		minPadding = 40,
		maxPadding = 40,
		shapeHorizontalPadding = 40,
		shapeVerticalPadding = 40;

	// create shape path
	var shapePath = [NSBezierPath bezierPath];
	[shapePath moveToPoint:CGPointMake([labelFrame midX], [labelFrame midY] - nSize)];
	[shapePath lineToPoint:CGPointMake([labelFrame midX] + nSize, [labelFrame midY])];
	[shapePath lineToPoint:CGPointMake([labelFrame midX], [labelFrame midY] + nSize)];
	[shapePath lineToPoint:CGPointMake([labelFrame midX] - nSize, [labelFrame midY])];
	[shapePath closePath];

	// create shape
	var shape = [MSShapeGroup shapeWithBezierPath: shapePath];

	// set style
	var shapeStyle = [shape style];
	var fills = [shapeStyle fills];
	if([fills count] <= 0) [fills addNewStylePart];
	var shapeFill = [shapeStyle fill];

	// add gradient fill
	shapeFill.fillType = 0;
	shapeFill.color = MSColor.colorWithSVGString("#EC658D");

	return shape;
}
