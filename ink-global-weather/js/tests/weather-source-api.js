"use strict";

define(['weather-source-api'], function(WeatherSourceApi) {

	var run = function() 
	{
		test('initialization of', function() 
		{
			ok(WeatherSourceApi != null, 'The weather source API should be non-null.');
			equal(typeof WeatherSourceApi.Fetch, "function", 'The weather source API should have Fetch function.');
		});
		
		asyncTest('Fetching data for multiple cities', function() 
		{
			expect(4);
			
			var cities = [{name:"Montreal", id:6077243},{name:"Manchester", id:2643123}];
			
			WeatherSourceApi.Fetch(cities, function(status)
			{
				equal(status, true, 'The status should be true for success.');
				ok(cities[0].coord != null, "The callback should return coord");
				ok(cities[0].weather != null, "The callback should return non-null weather");
				ok(cities[0].weather.length >= 1, "The callback should return a populated array of weather");
				QUnit.start();
			});
		});
		
	};
        
	return {run: run}
});
