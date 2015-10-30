
var utilities = {

	$element: $('body'),

	init: function() {
		console.log("page loaded");

		// enable FastClick plugin
		// http://ftlabs.github.io/fastclick/
		FastClick.attach(document.body);

		
		// enable enquire.js plugin
		// http://wicky.nillia.ms/enquire.js/#quick-start
		// place the below code in each component - this is just an example
		enquire.register("screen and (max-width: 1000px)", {
			match: function() {
				console.log("less than 1000px");
			},
			unmatch: function() {
				console.log("more than 1000px");
			}
		});
	}

};

if(utilities.$element.length){
    utilities.init();
}