// This unit test covers both weather-source-api and city classes since they work together
"use strict";

define(['city'], function(City) {

	var run = function() 
	{
		test('initialization of City', function() 
		{
			var city = new City();
			equal(city.id, 0, 'The city type should be initialized by default.');
		});
		
		test('initialization of City with id', function() 
		{
			var city = new City({id:2, name:"Toronto"});
			equal(city.id, 2, 'The city id should be initialized from params.');
			equal(city.name, "Toronto", 'The city name should be initialized from params.');
		});
		
		asyncTest('Fetching data for one city', function() 
		{
			expect(4);
						
			var city = new City({name:"Montreal", id:6077243});
			
			city.Load(function(status)
			{
				equal(status, true, 'The status should be true for success.');
				ok(city.coord != null, "The callback should return coord");
				ok(city.weather != null, "The callback should return non-null weather");
				ok(city.weather.length >= 1, "The callback should return a populated array of weather");
				QUnit.start();
			});
		});
		
	};
        
	return {run: run}
});
