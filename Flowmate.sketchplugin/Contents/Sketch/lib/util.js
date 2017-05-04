com.flowmate.extend({
	options : com.flowmate.options,
	// root: com.flowmate,

	addLayer : function (name, type, parent) {
		log ('addLayer')
		var parent = parent ? parent : com.flowmate.page;
		var layer;

		if (type == "text")
			layer = parent.newText();
		else if (type == "rectangle") {
			layer = parent.newShape({frame: new sketch.Rectangle(0, 0, 200, 200)})
		}
		else if (type == "group") {
			layer = parent.newGroup();
		}

		parent.addLayers(layer);

		if (name) {
			layer.setName(name);
		}

		 return layer;
	},

	addShape : function (name, parent) {
		log ('addShape')
		return parent.newShape({
			name : name,
			frame: new sketch.Rectangle(
				0, 0, this.options.process.shapeWidth, this.options.process.shapeHeight
			)
		});
	},

	addOval: function(name, parent, opt){
		log ('addOval')
		//bg,w,h,x,y
		//
		//var parent = parent ? parent : com.flowmate.current;

		var opt = opt || {},
			bg 	= opt.color 	|| this.options.reference.shapeColor,
			w 	= opt.width 	|| this.options.reference.shapeSize,
			h 	= opt.height 	|| this.options.reference.shapeSize,
			y 	= opt.y 		|| 0,
			x 	= opt.x 		|| 0;

		var ovalShape = MSOvalShape.alloc().init();
		ovalShape.setRect(CGRectMake(x, y, w, h));

		var shapeGroup 	= MSShapeGroup.shapeWithPath(ovalShape),
			fill 		= shapeGroup.style().addStylePartOfType(0);

		fill.color = MSImmutableColor.colorWithSVGString(bg);

		if (name) {
			shapeGroup.setName(name);
		}

		return this.doc.wrapObject(shapeGroup);
	},

	addGroup : function (name, parent) {
		log ('addGroup')
		//return this.addLayer(name, 'group', parent);
		return parent.newGroup ({
			name : name,
		})
	},

	addText : function (name, parent) {
		log ('addGroup')
		//return this.addLayer(name, 'text', parent);
		return parent.newText({
			name : name
		})
	},

	removeLayer : function (group, layer) {
		if (group) {
			group.sketchObject.removeLayer(layer.sketchObject);
		}
	},

	addLayerToGroup : function (opt) {
		log ("addLayerToGroup");

		// var layer = opt.target,
		// 	newGroup = opt.newGroup,
		// 	oldGroup = layer.parentGroup();
		var layer 		= opt.target,
			newGroup 	= opt.newGroup,
			oldGroup;

		if (layer.sketchObject.parentGroup()) {
			oldGroup = layer.container;
		}

		if (newGroup.isGroup) {
			newGroup.sketchObject.addLayer(layer.sketchObject);
		}

		//Sometimes just add shape that don't have parent.
		if (oldGroup) {
			this.removeLayer(oldGroup, layer);
		}
	},

	is : function (layer, theClass) {
		var klass = layer.class();
		return klass === theClass;
	},

	isPage : function (layer) {
		return this.is(layer, MSPage);
	},

	isGroup : function (layer) {
		return this.is(layer, MSLayerGroup);
	},

	isText : function (layer) {
		return this.is(layer, MSTextLayer);
	},

	isShape : function (layer){
		return this.is(layer, MSShapeGroup);
	},

	getFrame : function (layer) {
		var frame = layer.frame();

		return {
			x: Math.round(frame.x()),
			y: Math.round(frame.y()),
			width: Math.round(frame.width()),
			height: Math.round(frame.height())
		};
	},

	getRect : function (layer) {
		var rect = layer.absoluteRect();
		return {
			x: Math.round(rect.x()),
			y: Math.round(rect.y()),
			width: Math.round(rect.width()),
			height: Math.round(rect.height())
		};
	},

	setSize : function (layer, opt) {
		log ('setSize')

		//layer.frame.height is not working for setter sometimes.

		var oLayer = layer.sketchObject;

		if(opt.absolute){
			oLayer.absoluteRect().setWidth(opt.width);
			oLayer.absoluteRect().setHeight(opt.height);
		}
		else{
			oLayer.frame().setWidth(opt.width);
			oLayer.frame().setHeight(opt.height);
		}

		return layer;
	},

	setPosition : function (layer, opt) {
		log ('setPosition');

		// Use Old API to use setMidX and setMidY
		var oLayer = layer.sketchObject;

		if (opt.type == "topleft") {
			if(opt.absolute){
				oLayer.absoluteRect().setX(200);
				oLayer.absoluteRect().setY(200);
			}
			else{
				oLayer.frame().setX(opt.x);
				oLayer.frame().setY(opt.y);
			}
		} else if (opt.type == "middle") {
			if(opt.absolute){
				oLayer.absoluteRect().setMidX(opt.x);
				oLayer.absoluteRect().setMidY(opt.y);
			}
			else{
				oLayer.frame().setMidX(opt.x);
				oLayer.frame().setMidY(opt.y);
			}
		}

		return layer;
	},

	setFontStyle :function (label, opt) {
		log ('setFontStyle')

		var opt 	= opt || {},
			name 	= (opt.name) ? opt.name : this.options.fontName,
			size 	= (opt.size) ? opt.size : this.options.fontSize,
			color 	= (opt.color) ? MSImmutableColor.colorWithSVGString(opt.color] :  MSImmutableColor.colorWithSVGString(this.options.fontColor],
			align 	= (opt.align) ? (opt.align) : this.options.align;

		//Use Old API. Text.font API is not working
		var oLabel = label.sketchObject;

		oLabel.setFontPostscriptName (name);
		oLabel.setFontSize (size);
		oLabel.setTextColor (color);
		oLabel.setTextAlignment(align); // center
	},

	setBorder : function (layer, opt) {
		log ('setBorder')

		if (layer.isShape) {
			var style 		= layer.style.sketchObject.stylePartsOfType(1)[0];
			style.color 	= MSImmutableColor.colorWithSVGString(opt.color);
			style.thickness = opt.thickness;
		}
	},

	setShapeColor : function (opt) {
		log ('setShapeColor')
		//layer, hex, alpha
		var layer = opt.target;

		if(layer.isShape) {

			var fills 		= layer.style.sketchObject.stylePartsOfType(0),
				fill;

			var alpha = (opt.alpha) ? opt.alpha : 1;

			if (fills.count() <= 0) {
				fill = layer.style.sketchObject.addStylePartOfType(0);
			} else {
				fill = fills.firstObject();
			}

			fill.setFillType(0);
			fill.setColor(MSImmutableColor.colorWithSVGString(opt.color));
		}
	},

	setGradient : function (layer, opt) {
		log ('setGradient')

		if (layer.isShape) {
			var fills 		= layer.style.sketchObject.stylePartsOfType(0),
				fill;

			//if there are one more fills, just use first fill
			if (fills.count() <= 0) {
				fill = layer.style.sketchObject.addStylePartOfType[0];
			} else {
				fill = fills[0];
			}

			fill.setFillType(1);

			var gradient 	= fill.gradient(),
				startColor 	= opt.startColor,
				endColor 	= opt.endColor;

			gradient.setColor_atIndex_(MSImmutableColor.colorWithSVGString(startColor), 0);
			gradient.setColor_atIndex_(MSImmutableColor.colorWithSVGString(endColor), 1);
		}
	},

	didSelect : function () {
		log ("select")
		log (this.selection)
		if (this.selection.count() > 0) {
			return true;
		} else {
			this.message ("Must Select Text Layer to create flochart node.");
		}
	},

	message: function (message) {
		log ('message')
		// this.runCommand(['-c', 'afplay /System/Library/Sounds/Basso.aiff']);
		// [doc showMessage: message];

		if (message) {
			sketch.message (message);
		}
	},

	hexToRgb : function (hex) {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;
	}
})
