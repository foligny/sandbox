/////////////////////////////////////////
///   The Weather Source API object   ///
/// Using http://www.openweathermap.org
/////////////////////////////////////////
"use strict";
var g_tester = 0;
define(function (require) {

	var Toolbox = require("ui-toolbox");
	
	var WeatherSource = function() 
	{
		g_tester++;
		if (g_tester > 1)
		{	console.log("not singleton");
		}
		return {
			// Cities can be one city or an array of cities
			Fetch: function(cities, f_callback)
			{
				var self = this;
				
				// convert to array if not
				if (cities.length == null) { cities = [cities] };
				
				var cities_comma_separated = Toolbox.reduce(cities, ",", function(el) { return el.id; });
				var url = "http://api.openweathermap.org/data/2.5/group?id="+cities_comma_separated+"&units=metric&APPID=e271b63b2339a298bfbf2affdf92efbe";
			 	Toolbox.jsonp(url, function(values)
			 	{
			 		// values.list
			 		if (values.list == null)
			 		{
			 			if (console) console.log("ERROR: API return doesn't include .list");
			 			if (f_callback) f_callback(false);
			 			return;
			 		}
			 		
			 		// values.list
			 		if (values.list.length == 0) 
			 		{
			 			if (console) console.log("ERROR: API returned an empty list, check for valid IDs");
			 			if (f_callback) f_callback(false);
			 			return;
			 		}
			 		
			 		for (var i=0; i<values.list.length; i++)
					{
						var chunk = values.list[i];
						var city = null;
						for (var j=0; j<cities.length; j++)
						{
							if (cities[j].id == chunk.id)
							{	city = cities[j];
							}
						}

				 		if (city == null)
				 		{
				 			if (console) console.log("ERROR: Could not match city.id with data from API");
				 			if (f_callback) f_callback(false);
				 			return;
				 		}

				 		for (var key in chunk)
				 		{
				 			city[key] = chunk[key];
						}
						
						// put main directly in object
						if (city.afterLoad != null) city.afterLoad();
					}
					
					f_callback(true);
					
			 	});
			 	
				/* This would be the way with jQuery but for this test I decided to write the jsonp function myself to make this more challenging
				var url = "http://api.openweathermap.org/data/2.5/weather?q=London,uk";
				$.ajax({
					type: 'GET',
					url: url,
					async: false,
					contentType: "application/json",
					dataType: 'jsonp',
					success: function(json) 
					{
						if (console) console.dir(json);
					},
					error: function(e)
					{
						if (console) console.log(e.message);
					}
				});
				*/
			}
		};
	}

	return WeatherSource();
});
