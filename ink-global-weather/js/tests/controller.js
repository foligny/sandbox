"use strict";

define(['controller'], function(Controller) {

	var Toolbox = require('ui-toolbox');
	
	var run = function() 
	{
		test('initialization of Controller', function() 
		{
			var settings = {
				cities: [
					{name:"London", id:2643743},
					{name:"Manchester", id:2643123}
				]
			};
			var controller = new Controller().Init(settings);
			ok(controller.theView != null, 'The Controller view should be initialized with a view.');
		});
		
		asyncTest('Fetching data for two cities', function() 
		{
			expect(1);
			
			var settings = {
				cities: [
					{name:"London", id:2643743},
					{name:"Manchester", id:2643123}
				]
			};
			var controller = new Controller().Init(settings, function(status)
			{
				var citiesDiv = Toolbox.getAllElements("div.city");
				equal(citiesDiv.length, 2, "The app should render two cities");
				QUnit.start();
			});
			
		});
		
		asyncTest('Rendering the full view of a city', function() 
		{
			expect(1);
			
			var settings = {
				cities: [
					{name:"London", id:2643743},
					{name:"Manchester", id:2643123}
				]
			};
			var controller = new Controller().Init(settings, function(status)
			{
				var citiesDiv = Toolbox.getAllElements("div.city");
				citiesDiv[1].click();
				setTimeout(function()
				{
					var latitude = Toolbox.getElement("#coord\\.lat");
					equal(latitude.innerHTML, "53.48", "The app should render latitude in full city display table");
					QUnit.start();
				},600);
			});
			
		});
		
	};
        
	return {run: run}
});
