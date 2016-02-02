// Update Connect (ctrl shift u)

@import "lib/flowmate.js"
@import 'lib/options.js'
@import 'lib/util.js'

var onRun = function (context) {
	com.flowmate.init(context);
	com.flowmate.updateConnectors(updateConnection);
}

function updateConnection(connectionsGroup) {
	log ("updateConnection");

	var connectors  		= connectionsGroup.layers().array(),
		lengthOfConnectors 	= connectors.count(),
		willRemoveLayers	= [];

	for (var i=0; i < lengthOfConnectors; i++) {
		var splitName 	= connectionsGroup.layerAtIndex(i).name().split(":"),
			firstId 	= splitName[splitName.length-2],
			secondId 	= splitName[splitName.length-1],
			firstShape	= com.flowmate.current.layerWithID(firstId),
			secondShape = com.flowmate.current.layerWithID(secondId);

		log (firstShape);
		log (secondShape);

		// if firstShape and secondShape is exist, redraw the connector. 
		// else, it mean firstShape and/or secondShape is deleted, the connector will be deleted.
		if (firstShape && secondShape) {
			_drawOneConnection(firstShape, secondShape, connectors[i], willRemoveLayers);	
		} else {
			willRemoveLayers.push (connectors[i]);

		}
	}

	// Remove old shapes
	for (var i=0; i < willRemoveLayers.length; i++) {
		connectionsGroup.removeLayer (willRemoveLayers[i]);
	}

}

function _drawOneConnection(firstStep, secondStep, oldShape, willRemoveLayers) 
{
	// get connectionsGroup position
	log ("_drawOneConnection")
	var parentGroup = [firstStep parentGroup];
	var connectionsGroup = getConnectionsGroup(parentGroup);
	var connectionsGroupFrame = [connectionsGroup frame];
	var connectionsGroupX = [connectionsGroupFrame x];
	var connectionsGroupY = [connectionsGroupFrame y];

	// get frames of steps
	var firstStepFrame = [firstStep frame];
	var secondStepFrame = [secondStep frame];

	// get First point
	var firstStepBottom,
		firstStepRight,
		firstStepHorizontalMiddle, 
		firstStepVerticalMiddle;

	if (com.flowmate.isDecision(firstStep)) {

		var decisionShape = firstStep.layers().array()[0];
		var decisionShapeFrame = decisionShape.frame();

		log ("First " + decisionShape.name())

		firstStepBottom = firstStepFrame.minY() + decisionShapeFrame.maxY() - connectionsGroupY;
		firstStepRight = firstStepFrame.minX() + decisionShapeFrame.maxX() - connectionsGroupX;
		firstStepHorizontalMiddle = firstStepFrame.minX() + decisionShapeFrame.midX() - connectionsGroupX;
		firstStepVerticalMiddle = firstStepFrame.minY() + decisionShapeFrame.midY() - connectionsGroupY;

		log (firstStepBottom);
		log (firstStepRight);
		log (firstStepHorizontalMiddle);
		log (firstStepVerticalMiddle);

	} else {
		firstStepBottom = firstStepFrame.maxY() - connectionsGroupY;
		firstStepRight = firstStepFrame.maxX() - connectionsGroupX;
		firstStepHorizontalMiddle = firstStepFrame.midX() - connectionsGroupX;
		firstStepVerticalMiddle = firstStepFrame.midY() - connectionsGroupY;
	}

	// get Second point
	var secondStepTop,
			secondStepLeft,
			secondStepHorizontalMiddle, 
			secondStepVerticalMiddle;

	if (com.flowmate.isDecision(secondStep)) {
		var decisionShape = secondStep.layers().array()[0];
		var decisionShapeFrame = decisionShape.frame();

		log ("Second " + decisionShape.name())

		secondStepTop = secondStepFrame.minY() + decisionShapeFrame.minY() - connectionsGroupY;
		secondStepLeft = secondStepFrame.minX() + decisionShapeFrame.minX() - connectionsGroupX;
		secondStepHorizontalMiddle = secondStepFrame.minX() + decisionShapeFrame.midX() - connectionsGroupX;
		secondStepVerticalMiddle = secondStepFrame.minY() + decisionShapeFrame.midY() - connectionsGroupY;
	} else {
		secondStepTop = secondStepFrame.minY() - connectionsGroupY;
		secondStepLeft = secondStepFrame.minX() - connectionsGroupX;
		secondStepHorizontalMiddle = secondStepFrame.midX() - connectionsGroupX;
		secondStepVerticalMiddle = secondStepFrame.midY() - connectionsGroupY;
	}

	// calcurate the half point
	var horizontalSpacingHalf = (secondStepLeft - firstStepRight) / 2;
	var verticalSpacingHalf = (secondStepTop - firstStepBottom) / 2;
	var horizontalMiddleDifference = firstStepHorizontalMiddle - secondStepHorizontalMiddle;
	var verticalMiddleDifference = firstStepVerticalMiddle - secondStepVerticalMiddle;

	log ("horizontalMiddleDifference " + horizontalMiddleDifference);
	log ("verticalMiddleDifference " + verticalMiddleDifference);  

	// create NSBezierPath
	var lineBezierPath = [NSBezierPath bezierPath];

	if (firstStepBottom < secondStepTop) {
		// draw vertical connection
		[lineBezierPath moveToPoint:CGPointMake(firstStepHorizontalMiddle, firstStepBottom)];
		// tolerate some pixels in horizontalMiddleDifference
		if (Math.abs(horizontalMiddleDifference) > 2.0) {
			[lineBezierPath lineToPoint:CGPointMake(firstStepHorizontalMiddle, firstStepBottom + verticalSpacingHalf)];
			[lineBezierPath lineToPoint:CGPointMake(secondStepHorizontalMiddle, firstStepBottom + verticalSpacingHalf)];
			[lineBezierPath lineToPoint:CGPointMake(secondStepHorizontalMiddle, secondStepTop)];
		} else {
			[lineBezierPath lineToPoint:CGPointMake(firstStepHorizontalMiddle, secondStepTop)];
		}
	} else {
		// draw horizontal connection
		[lineBezierPath moveToPoint:CGPointMake(firstStepRight, firstStepVerticalMiddle)];
		// tolerate some pixels in verticalMiddleDifference
		if (Math.abs(verticalMiddleDifference) > 2.0) {
			[lineBezierPath lineToPoint:CGPointMake(firstStepRight + horizontalSpacingHalf, firstStepVerticalMiddle)];
			[lineBezierPath lineToPoint:CGPointMake(firstStepRight + horizontalSpacingHalf, secondStepVerticalMiddle)];
			[lineBezierPath lineToPoint:CGPointMake(secondStepLeft, secondStepVerticalMiddle)];
		} else {
			[lineBezierPath lineToPoint:CGPointMake(secondStepLeft, firstStepVerticalMiddle)];
		}
	}

	// create vector line
	var connectorColor  = com.flowmate.options.connector.connectorColor,
		lineShape       = [[MSShapeGroup alloc] init];
	[lineShape setBezierPath: lineBezierPath];
	[lineShape setName:[firstStep name] + "-" + [secondStep name] + ":" + firstStep.objectID() + ":" + secondStep.objectID()];

	// add border
	var lineShapeStyle = [lineShape style];
	var borders = [lineShapeStyle borders];
	if([borders count] <= 0) [borders addNewStylePart];

	// set border style
	var border = [lineShapeStyle border];
	border.setColor(MSColor.colorWithSVGString(connectorColor));
	border.thickness = 2;

	// set arrow;
	lineShape.firstLayer().setEndDecorationType(1);

	// store old line shape;
	willRemoveLayers.push (oldShape);
	 
	// add line shape to connectionsGroup
	[connectionsGroup addLayers:[lineShape]];
}

function sortByPosition(a,b)
{
	var sortOrder;

	if ([[a frame] maxY] < [[b frame] minY] || [[b frame] maxY] < [[a frame] minY]) {
		// sort from top to bottom
		sortOrder = [[a frame] top] - [[b frame] top];
	} else {
		// sort from left to right
		sortOrder = [[a frame] left] - [[b frame] left];
	}

	return sortOrder;
}

function getConnectionsGroup(parentGroup)
{
	/*var groupName         = com.flowmate.options.connector.connectorGroupName, 
		connectionsGroup  = [parentGroup layerWithId:groupName];*/

	var groupName         = com.flowmate.options.connector.connectorGroupName, 
		connectionsGroup  = [parentGroup layerWithID:groupName];

	// create group if not exists
	if (connectionsGroup === null) {
		connectionsGroup = [parentGroup addLayerOfType:"group"];
		[connectionsGroup setName:groupName];
		[connectionsGroup setIsLocked:true];
	}

	return connectionsGroup;
}
