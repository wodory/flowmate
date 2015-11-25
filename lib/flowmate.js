var com = {};

com.flowmate = {
	init : function () {
		this.page 		= [doc currentPage];
  		this.artboard 	= this.page.currentArtboard();
  		this.artboards 	= [doc artboards];
  		this.current 	= this.artboard ? this.artboard : this.page;
  		this.shapesFairHasConnector = [];
	},

	setShapeFairHasConnector : function (first, second) {
		this.shapesFairHasConnector.push (first, second);
	},

	getShapeFairHasConnector : function () {
		return this.shapesFairHasConnector;
	},

	connectSymbols : function (drawConnections) {
		if([selection count] < 2) {
			this.util.showToast ("Oops, you have to select at least two layers.");
		} else {
			drawConnections(selection);
		}
	},

	updateConnectors : function (f) {
		var groupName         	= com.flowmate.options.connector.connectorGroupName, 
			connectionsGroup  	= com.flowmate.current.layerWithID(groupName),
			fail 				= com.flowmate.current.layerWithID('test')	;

		if (connectionsGroup != null && connectionsGroup.layers().array().count() > 0)	{
			log ("f");
			f(connectionsGroup);
		} 
	},

	createSymbol : function (type) {
		this.util.debug("createSymbol");
		this.init();

		if (!this.util.didSelect()) {
			return;
		}

		var loop = [selection objectEnumerator];
		while (shape = [loop nextObject]) {

 			if (!this.util.isText(shape)) {
 				this.util.showToast ("You must select text layer(s) only.");
 				return; 
 			}

 			this.createShapeByType(type, shape);
 		}
	},

	createShapeByType : function (type, label) {
		this.util.debug ("createShapeByType : " + type);

		var wrapperShape, group;

		switch (type) {
			case "Process":
				this.createProcessShape(label);
				break;

			case "Decision":
				this.createDecisionShape(label);
				break;

			case "Reference":
				this.createReferenceShape(label);
				break;

			case "Label":
				this.createLabelShape(label);
				break;
		}
	},

	createLabelShape : function (label) {
		this.util.debug ("createLabelShape");

		var stepName 		= "Label",
			labelString 	= label.stringValue(),
			newGroup 		= this.util.addGroup(stepName + " - " + labelString),
			bgShape 		= this.util.addShape(stepName + " - " + labelString + "- bgshape", newGroup),
			opt 			= this.options.label;

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
	},

	createReferenceShape : function (label) {
		this.util.debug ("createDecisionShape");

		var stepName 		= "Refernce",
			labelString 	= label.stringValue(),
			newGroup 		= this.util.addGroup(stepName + " - " + labelString),
			opt 			= this.options.reference;

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
		
		var shapeName 	= stepName + "-" + labelString + "- bgshape",
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

		//Reset group size
		newGroup.resizeRoot(0);
	},

	createDecisionShape : function (label) {
		this.util.debug ("createDecisionShape");

		var stepName 		= "Decision",
			labelString 	= label.stringValue(),
			newGroup 		= this.util.addGroup(stepName + " - " + labelString),
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

		newGroup.resizeRoot(0);
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
	},

	createProcessShape : function (label) {
		this.util.debug ("createProcessShape");

		var stepName 		= "Process",
			labelString 	= label.stringValue(),
			opt 			= this.options.process,
			newGroup 		= this.util.addGroup(stepName + ":" + labelString),
			bgShape 		= this.util.addShape("bgshape:" + labelString, newGroup);

		this.util.debug ("newGroup :" + newGroup);

		//Set Layer name of label and styles
		label.setName ("label: " + labelString);

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

		newGroup.resizeRoot(0);
	},
};