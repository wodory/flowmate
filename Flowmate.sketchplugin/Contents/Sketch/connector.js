@import "lib/flowmate.js"
@import 'lib/options.js'
@import 'lib/util.js'
@import 'connectorCore.js'

com.flowmate.extend ({
	connectSymbols : function () {
		log ('connectSymbols')
		if(this.selection.count() < 2) {
			this.showToast ("Oops, you have to select at least two layers.");
		} else {
			this.drawAllConnections(this.selection);
		}
	}
})

var onRun = function (context) {
	com.flowmate.init(context);
	com.flowmate.connectSymbols();
}
