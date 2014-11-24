/////////////////////////
///  Main controller  ///
/////////////////////////
//
// Description:
//    If someone would be providing a new UI design,
//    changes would need to be made here only.
//
//////////////////////////////////////////////////////
define(function (require) {

	// Modules that require instantiations
	var Controller = require('controller');
	
	var debug = false;
	var debugLastTimestamp = 0;
	
	/// documentReady() ///
	// For HTML5 compliant browser, this is only needed if we put scripts in head.
	// If we put scripts after <body> in HTML5 compliant browser we are assured that when we are executed, prior elements are loaded.
	var documentReadyCalled = false;
	function documentReady()
	{
		if (documentReadyCalled) return;
		documentReadyCalled = true;
		
		if ( debug )
		{
			var t = new Date().getTime();
			diff = t - debugLastTimestamp;
			console.log("Controller: document.ready at t="+t + " diff("+diff+")");
			debugLastTimestamp = t;
		}
		
		var settings = {
			cities: [
				{name:"London", id:2643743},
				{name:"Luton", id:2643339},
				{name:"Manchester", id:2643123},
				{name:"Birmingham", id:2655603},
				{name:"Sherbrooke", id:6146143}, // I added some more to test cases where weather[] was an array with more than 1 items
				{name:"Paris", id:2988507}
			],
			sortMethod: "name"
		};
		new Controller().Init(settings);
	}
	
	function documentLoadedComplete()
	{
		document.removeEventListener("DOMContentLoaded", documentLoadedComplete, false);
		window.removeEventListener("load", documentLoadedComplete, false);
		documentReady();
	}
	
	if (document.readyState === "complete") 
	{	// launch now
		setTimeout(documentReady);
	}
	else
	{	document.addEventListener("DOMContentLoaded", documentLoadedComplete, false);
		window.addEventListener("load", documentLoadedComplete, false); // fallback
	}
	
	if ( debug )
	{
		var t = new Date().getTime();
		debugLastTimestamp = t;
		console.log("Controller: started at t="+t);
	}
	
	return { amd:true }; // returning for QUnit testing purposes	
});
