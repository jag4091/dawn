
var navigation = {

	$element: $('nav'),

	init: function() {
		console.log("nav loaded");
	}

};

if(navigation.$element.length){
    navigation.init();
}