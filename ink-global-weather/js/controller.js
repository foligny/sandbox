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
	var City = require('city');
	var ViewManager = require('view-manager');
	var Toolbox = require('ui-toolbox');
	var WeatherSource = require('weather-source-api');
	
	// private variables/objects
	var debug = true;
	var debugLastTimestamp = 0;
	
	function Controller()
	{	
		this.theView = null;
		this.theCities = [];
		this.settings = {
			cities: [],
			sortMethod: "name"
		};
	}
	
	Controller.prototype = {
	
		onSortMethodChanged: function(controller, event)
		{
			var el = event != null ? event.currentTarget : null;
			if (console) console.log("[main] onSortMethodChanged:" + el.value);
			
			controller.settings.sortMethod = el.value;
			controller.theView.render(controller.settings.sortMethod);
		},
		
		viewListDisplay: function(controller)
		{
			controller.theView.renderCityList();
		},
		
		cityFullDisplay: function(controller, cityId)
		{
			for (var i=0; i<controller.theCities.length; i++)
			{
				if (controller.theCities[i].id == cityId)
				{
					controller.theView.renderFullCity(controller.theCities[i]);
				}
			}
		},		
	
		Init: function(settings, f_callback)
		{
			var self = this;
			
			if (settings.cities)
			{	this.settings.cities = settings.cities;
			}
			if (settings.sortMethod)
			{	this.settings.sortMethod = settings.sortMethod;
			}
			
			for (var i=0; i<this.settings.cities.length; i++)
			{
				var city = new City({
					id:this.settings.cities[i].id,
					name:this.settings.cities[i].name
				});
				
				this.theCities.push(city);
			}
			
			var uiElementMapping = {
				sortByArea:{selector:"#sortBy",func:null},
				viewListArea:{selector:"#viewList",func:self.viewListDisplay},
				fullDisplayArea:{selector:"#fullDisplayArea",func:null},
				tmplCity:{selector:"#tmplCity",func:null},
				tmplIcon:{selector:"#tmplIcon",func:null},
				cityListInsertionPoint:{selector:"#city-list",func:null},
				sortMethod:{selector:"#sortMethod",func:self.onSortMethodChanged},
				cityDiv:{selector:"div.city",func:self.cityFullDisplay}			
			};
			this.theView = new ViewManager(this, uiElementMapping);
			this.theView.setCities(this.theCities);
			
			// pre-render with loading ani (with no API values)
			this.theView.render(this.settings.sortMethod);
			
			// fetch all weather in a single call
			WeatherSource.Fetch(this.theCities, function(status)
			{
				// weather data is loaded
				self.theView.render(self.settings.sortMethod);
				if (f_callback) f_callback(status);
			});
			
			return this;
		} // Init();
	};
	
	return Controller; // returning for QUnit testing purposes	
});
