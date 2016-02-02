@import 'lib/flowmate.js'
@import 'lib/options.js'
@import 'lib/util.js'

com.flowmate.extend ({
	createGroup : function (label) {
		log ("createGroup _ Decision");
		var stepName 		= "Decision",
			labelString 	= label.stringValue(),
			newGroup 		= this.util.addGroup(stepName + "_" + labelString),
			bgShape 		= this.drawDecisionShape(label);

		this.util.setFontStyle(label, {
			size: this.options.decision.fontSizeOfLabel
		});

		this.util.setShapeColor({
			target : bgShape, 
			hex : this.options.decision.shapeColor,
		});

		this.util.moveLayer({
			target : bgShape, 
			newGroup : newGroup
		});

		//set Position of Label
		this.util.setPosition(label, {
			type : "topleft",
			x : bgShape.frame().midX() - label.frame().width() - 20,
			y : bgShape.frame().minY()
		});

		this.util.moveLayer({
			target : label, 
			newGroup : newGroup
		});

		//Add X, Y Directions
		this.addDirectionToDecision(newGroup, label, bgShape);

		//newGroup.resizeRoot(0);
		if(newGroup.resizeRoot) { 
			newGroup.resizeRoot(true);
		} else if(newGroup.resizeToFitChildrenWithOption) {
			newGroup.resizeToFitChildrenWithOption(true);
		}
	},

	isDecision : function (shape) {
		return (shape.name().indexOf("Decision_") > -1);
	},

	drawDecisionShape : function (label) {
		var labelFrame 	= label.frame(), 
			labelWidth 	= labelFrame.width(),
			labelHeight = labelFrame.height(),
			nSize 		= this.options.decision.shapeSize;
			shapePath 	= NSBezierPath.bezierPath(),

		[shapePath moveToPoint:CGPointMake([labelFrame midX], [labelFrame midY] - nSize)];
		[shapePath lineToPoint:CGPointMake([labelFrame midX] + nSize, [labelFrame midY])];
		[shapePath lineToPoint:CGPointMake([labelFrame midX], [labelFrame midY] + nSize)];
		[shapePath lineToPoint:CGPointMake([labelFrame midX] - nSize, [labelFrame midY])];
		shapePath.closePath();

		return MSShapeGroup.shapeWithBezierPath(shapePath);
	},
	
	addDirectionToDecision : function (newGroup, label, shape) {
		this.util.debug ("addDirectionToDecision");	

		var labelFrame = label.frame(),
			shapeFrame = shape.frame();

		// create Y & N
		var textYes 			= this.util.addText("Condition-Yes", newGroup),
			textNo 				= this.util.addText("Condition-No", newGroup),
			textYesFrame 		= textYes.frame(),
			textNoFrame 		= textNo.frame(),
			conditionFontStyle 	= {
				name 	: this.options.decision.fontForCondition,
				size 	: this.options.decision.fontSizeOfCondition,
				color 	: this.options.decision.fontColorForCondition
			};

		textYes.setStringValue ("Y");
		textNo.setStringValue ("N");

		this.util.setFontStyle(textYes, conditionFontStyle);
		this.util.setFontStyle(textNo, conditionFontStyle);

		this.util.setPosition(textYes, {
			type 	: "middle",
			x 		: shape.frame().maxX() - 11,
			y 		: shape.frame().midY()
		});

		this.util.setPosition(textNo, {
			type 	: "middle",
			x 		: shape.frame().midX(),
			y 		: shape.frame().maxY() - 11
		})

		// Relocate the label
		this.util.setPosition(label, {
			type 	: "topleft",
			x 		: shape.frame().midX() - label.frame().width() - 20,
			y 		: shape.frame().minY()
		})
	}
});

var onRun = function (context) {
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
