var sketch;
var com = com || {};

com.flowmate = {
	init : function (context) {
		log ("init")
		sketch 			= context.api();

		this.context 	= context;
		this.doc 		= sketch.selectedDocument;
		this.page 		= this.doc.selectedPage;
		this.selection	= context.selection;

		this.shapesFairHasConnector = [];

		//Check some layer are selected
		if (this.selection.isEmpty) {
			this.message ("Select at least one text layer")
			return;
		}
	},

	extend : function( options, target ){
        var target = target || this;

        for ( var key in options ){
            target[key] = options[key];
        }
        return target;
    },

    isDecision : function (shape) {
		return (shape.name().indexOf("Decision_") > -1);
	},

	setShapeFairHasConnector : function (first, second) {
		this.shapesFairHasConnector.push (first, second);
	},

	getShapeFairHasConnector : function () {
		return this.shapesFairHasConnector;
	},

	// connectSymbols : function () {
	// 	log ('connectSymbols')
	// 	if(this.selection.count() < 2) {
	// 		this.showToast ("Oops, you have to select at least two layers.");
	// 	} else {
	// 		this.drawAllConnections(this.selection);
	// 	}
	// },

	// updateConnectors : function () {
	// 	log ("updateConnectors")
	//
	// 	var groupName         	= this.options.connector.connectorGroupName,
	// 		connectionsGroup  	= this.page.sketchObject.layerWithID(groupName),
	// 		fail 				= this.page.sketchObject.layerWithID('test')	;
	//
	// 	if (connectionsGroup != null)	{
	// 		this.updateConnection(connectionsGroup);
	// 	}
	// },

	createSymbol : function (type) {
		log ('createSymbol')

		var self = this;

		sketch.selectedDocument.selectedLayers.iterateWithFilter("isText", function(layer) {
			if (layer.isText) {
				self.createGroup(layer);
			}
		})
	}
};
