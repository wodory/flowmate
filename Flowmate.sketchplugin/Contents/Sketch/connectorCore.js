com.flowmate.extend({
	drawAllConnections : function(selection){
		log ('drawAllConnections')

		var sortedSelection = [],
			loop = [selection objectEnumerator];

		while (item = [loop nextObject]) {
			sortedSelection.push(item);
		}

		// sort selection from top to bottom steps
		sortedSelection = sortedSelection.sort(this.sortByPosition);

		// draw connection between every two steps
		for (var i = 0; i < sortedSelection.length; i++) {
			// skip last step (there is no step after to connect)
			if ((i + 1) < sortedSelection.length) {
				//Draw Connector between fair and store the IDs
				this.drawOneConnection(sortedSelection[i], sortedSelection[i + 1]);
			}
		}
	},

	drawOneConnection : function(firstStep, secondStep){
		// get connectionsGroup position
		log ("drawOneConnection")
		var parentGroup 			= firstStep.parentGroup();
		var connectionsGroup 		= this.getConnectionsGroup(parentGroup);
		var connectionsGroupFrame 	= connectionsGroup.frame();
		var connectionsGroupX 		= connectionsGroupFrame.x();
		var connectionsGroupY 		= connectionsGroupFrame.y();

		// get frames of steps
		var firstStepFrame 		= firstStep.frame();
		var secondStepFrame 	= secondStep.frame();

		// get First point
		var firstStepBottom,
			firstStepRight,
			firstStepHorizontalMiddle,
			firstStepVerticalMiddle;

		log (firstStep.name());
		if (this.isDecision(firstStep)) {

			var decisionShape = firstStep.layers().array()[0];
			var decisionShapeFrame = decisionShape.frame();

			firstStepBottom = firstStepFrame.minY() + decisionShapeFrame.maxY() - connectionsGroupY;
			firstStepRight = firstStepFrame.minX() + decisionShapeFrame.maxX() - connectionsGroupX;
			firstStepHorizontalMiddle = firstStepFrame.minX() + decisionShapeFrame.midX() - connectionsGroupX;
			firstStepVerticalMiddle = firstStepFrame.minY() + decisionShapeFrame.midY() - connectionsGroupY;

			// log (firstStepBottom);
			// log (firstStepRight);
			// log (firstStepHorizontalMiddle);
			// log (firstStepVerticalMiddle);

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

		if (this.isDecision(secondStep)) {
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
			lineShape       = MSShapeGroup.alloc().init();

		lineShape.setBezierPath(lineBezierPath);
		lineShape.setName(firstStep.name() + "-" + secondStep.name() + ":" + firstStep.objectID() + ":" + secondStep.objectID());

		// add border
		var lineShapeStyle 	= lineShape.style(),
			borders 		= lineShapeStyle.borders();

		if (borders.count() <= 0)
			lineShapeStyle.addStylePartOfType(1);

		// set border style
		var border = lineShapeStyle.border();
		border.setColor(MSImmutableColor.colorWithSVGString(connectorColor));
		border.thickness = 2;

		// set arrow;
		lineShape.firstLayer().setEndDecorationType(1);

		// add line shape to connectionsGroup
		connectionsGroup.addLayers([lineShape]);

		// deselect steps
		firstStep.setIsSelected(false);
		secondStep.setIsSelected(false);
	},

	sortByPosition : function(a,b){
		log ('sortByPosition')
		var sortOrder;

		if ([[a frame] maxY] < [[b frame] minY] || [[b frame] maxY] < [[a frame] minY]) {
			// sort from top to bottom
			sortOrder = [[a frame] top] - [[b frame] top];
		} else {
			// sort from left to right
			sortOrder = [[a frame] left] - [[b frame] left];
		}

		return sortOrder;
	},

	getConnectionsGroup : function (parentGroup){
		log ('getConnectionsGroup')
		/*var groupName         = com.flowmate.options.connector.connectorGroupName,
			connectionsGroup  = [parentGroup layerWithId:groupName];*/

		var groupName         = com.flowmate.options.connector.connectorGroupName,
			connectionsGroup  = parentGroup.layerWithID(groupName);

		// create group if not exists
		if (connectionsGroup === null) {
			connectionsGroup = MSLayerGroup.alloc().init();
			connectionsGroup.setName(groupName)
			connectionsGroup.setIsLocked(true);
			parentGroup.addLayers([connectionsGroup]);
		}

		return connectionsGroup;
	}
})
