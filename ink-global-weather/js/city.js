////////////////////////////////////
///         City Object          ///
///    City.prototype => Model   ///
////////////////////////////////////
"use strict";
define(function (require) {

	var Model = require('model');
	var WeatherSourceApi = require('weather-source-api');
		
	function City(init)
	{
		this.defaults = [];
		Model.call(this, init);
	}
	
	City.prototype = new Model();
	City.prototype.constructor = City;
	
	// override Model.prototype.Load
	City.prototype.Load = function(f_callback)
	{
		var self = this;
		
		WeatherSourceApi.Fetch(self, function(status)
		{
			f_callback(status);
		});
				
		return this; // so it can be chained
	};
	
	// override Model.prototype.Load
	City.prototype.afterLoad = function()
	{	
 		for (var key in this.main)
 		{
 			this[key] = this.main[key];
		}
		
		// Round temperature to 1 decimal
		this.temp = Math.round(this.temp * 10) / 10;
		this.temp_min = Math.round(this.temp_min * 10) / 10;
		this.temp_max = Math.round(this.temp_max * 10) / 10;
		
		//this.weather[2] = this.weather[1] = this.weather[0]; //to test with multiple weather
		this.weatherDescription = "";
		for (var i=0; i<this.weather.length; i++)
		{
			if (i > 0) this.weatherDescription += ", ";
			this.weatherDescription += this.weather[i].description;
		}
		
	};

	return City;
});
