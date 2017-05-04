// Update Connect (ctrl shift u)

@import "lib/flowmate.js"
@import 'lib/options.js'
@import 'lib/util.js'
@import 'connectorCore.js'

com.flowmate.extend ({
	updateConnectors : function () {
		log ("updateConnectors")

		// var groupName         	= this.options.connector.connectorGroupName,
		// 	connectionsGroup  	= this.page.sketchObject.layerWithID(groupName),
		// 	fail 				= this.page.sketchObject.layerWithID('test')	;

		var connectionsGroup = this.findConnectrGroup();

		if (connectionsGroup != null)	{
			this.updateEachConnector(connectionsGroup);
		}
	},

	findConnectrGroup :  function () {

		var groupName         	= this.options.connector.connectorGroupName,
			connectionsGroup  	= this.page.sketchObject.layerWithID(groupName);

		return connectionsGroup;
	},

	updateEachConnector : function (connectionsGroup) {
		log ("updateEachConnector");

		var connectors  		= connectionsGroup.layers(),
			lengthOfConnectors 	= connectors.count(),
			willRemoveLayers	= [];

		for (var i=0; i < lengthOfConnectors; i++) {
			var splitName 	= connectionsGroup.layerAtIndex(i).name().split(":"),
				firstId 	= splitName[splitName.length-2],
				secondId 	= splitName[splitName.length-1],
				firstShape	= this.page.sketchObject.layerWithID(firstId),
				secondShape = this.page.sketchObject.layerWithID(secondId);

			log (firstShape);
			log (secondShape);

			// if firstShape and secondShape is exist, redraw the connector.
			// else, it mean firstShape and/or secondShape is deleted, the connector will be deleted.
			if (firstShape && secondShape) {
				this.drawOneConnection(firstShape, secondShape);
			}
			willRemoveLayers.push (connectors[i]);
		}

		// Remove old shapes
		for (var i=0; i < willRemoveLayers.length; i++) {
			connectionsGroup.removeLayer (willRemoveLayers[i]);
		}

	}
});

var onRun = function (context) {
	com.flowmate.init(context);
	com.flowmate.updateConnectors();
}
