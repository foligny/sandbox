///////////////////////////
//      View Manager     //
///////////////////////////
//
// Description:  Handles interactions between the view
//    and the app. The only module that touches the DOM.
//    Is losely coupled to the actual classes and ids 
//    used by the view. If someone would be to replace
//    the HTML & CSS with complete different design,
//    this code would not need to change. Element IDs
//    and classes are supplied by the main controller.
//    
//////////////////////////////////////////////////////
"use strict";
define(function (require) {

	var Toolbox = require("ui-toolbox");
	
	// constructor
	function ViewManager(controller, elements) 
	{
		this.controller = controller;
		this.elements = elements;
		this.unbinders = [];
		
		this.sortByArea = Toolbox.getElement(elements.sortByArea.selector);
		this.viewListArea = Toolbox.getElement(elements.viewListArea.selector);
		this.fullDisplayArea = Toolbox.getElement(elements.fullDisplayArea.selector);
		this.tmplCity = Toolbox.getElement(elements.tmplCity.selector);
		this.tmplIcon = Toolbox.getElement(elements.tmplIcon.selector);
		this.cityListInsertionPoint = Toolbox.getElement(elements.cityListInsertionPoint.selector);
		this.sortMethod = Toolbox.getElement(elements.sortMethod.selector);
		this.cityDiv = Toolbox.getAllElements(elements.cityDiv.selector);
		
		this.Initialize();
	}
	
	// private functions
	var sortByTemperatureR = function (a, b)
	{
		if ( a.temp < b.temp ) return 1;
		else if ( a.temp > b.temp ) return -1; 
		return 0;
	};
	var sortByTemperature = function (a, b)
	{
		if ( a.temp < b.temp ) return -1;
		else if ( a.temp > b.temp ) return 1; 
		return 0;
	};
	
	var sortByName = function (a, b)
	{
		if ( a.name < b.name ) return -1;
		else if ( a.name > b.name ) return 1; 
		return 0;
	};

	ViewManager.prototype = {
	
		// bind event handlers
		bindAll: function ()
		{
			var self = this;
			
			Toolbox.onSelectChange(self.sortMethod, function(event)
			{
				self.elements.sortMethod.func(self.controller, event);
			});
			
			Toolbox.onClick(self.viewListArea, function(event)
			{
				self.elements.viewListArea.func(self.controller, event);
			});
			
		}, // end bindAll()
		
		render: function(sort)
		{
			var self = this;
			var html = "";
			
			// cleanup first
			for (var i=0; i<self.unbinders.length; i++)
			{
				self.unbinders[i]();
			}
			
			if (this.currentSort != sort)
			{
				if (sort == "rtemp")
				{	this.cities.sort(sortByTemperatureR);
				}
				if (sort == "temp")
				{	this.cities.sort(sortByTemperature);
				}
				else if (sort == "name")
				{	this.cities.sort(sortByName);
				}
				this.currentSort = sort;
			}
					
			for (var i=0; i<this.cities.length; i++)
			{
				html += this.renderOneCityInList(this.cities[i]);
			}
			
			// build in memory the list of cities
			var surrogate = document.createElement("div");
			surrogate.innerHTML = html;
			surrogate.className = "listContainer";
			var domEl = surrogate.firstChild;
			this.cityListInsertionPoint.innerHTML = "";
			
			// render to document
			this.cityListInsertionPoint.appendChild(surrogate); // only one operation for all divs to minimize redraw
			
			// bind events
			var cityDivs = Toolbox.getAllElements(this.elements.cityDiv.selector, this.cityListInsertionPoint);
			
			if (this.cities.length > 0 && this.cities[0].weather == null)
			{
				return; // do not bind clicks
			}
			
			self.unbinders = Toolbox.onClick(cityDivs, function(event)
			{
				var el = event.currentTarget;
				if (Toolbox.hasClass(el, "selected") === true)
				{
					// go back to list view 
					self.renderCityList();
					return;
				}
				Toolbox.addClass(el, "selected");
				
				// this does not work in IE8 and older var others = Toolbox.getAllElements(self.elements.cityDiv.selector+":not(.selected)", self.cityListInsertionPoint);
				var all = Toolbox.getAllElements(self.elements.cityDiv.selector, self.cityListInsertionPoint);
				var others = [];
				for (var i=all.length-1; i>=0; i--)
				{	if (all[i] != el)
					{	others.push(all[i]);
					}
				}
				Toolbox.addClass(others, "fadeOut");
				
				setTimeout(function()
				{
					Toolbox.addClass(others, "hidden");
					Toolbox.addClass(el, "marginAlignCenter");
					//var cityListContainer = Toolbox.getElement(".listContainer", this.cityListInsertionPoint);
					//Toolbox.addClass(cityListContainer, "centered");
					var cityId = Toolbox.getAttribute(el, "cityId");
					self.elements.cityDiv.func(self.controller, cityId);
				},500);
			});
		},
		
		renderOneCityInList: function(city)
		{
			var html = this.tmplCity.innerHTML;
						
			while (1)
			{
	   		var logic = html.match(/%%if ?(((?!%%).)*)%%(((?!%%endif%%)[\S\s])*)%%endif%%/);
	   		if(logic && logic.length && logic.length >= 5)
	   		{
	   		   logic[1] = logic[1].replace(/&amp;/g, "&");
	   		   var result = eval(logic[1]);
	   		   if(result)
	   		   {
	   		      var chunk = Toolbox.ReplacePlain(logic[3], city);
	   		      html = html.replace(logic[0], chunk);
	   		   }
	   		   else
	   		   {  html = html.replace(logic[0], "");
	   		   }
	   		}
	   		else
	   		{
	   		   break;
	   		}
			}
			
			html = Toolbox.ReplacePlain(html, city); // after handling and removing logic blocks, parse everything
			return html;
		},
		
		renderFullCity: function(city)
		{
			Toolbox.addClass(this.sortByArea, "hidden");
			Toolbox.removeClass(this.viewListArea, "hidden");			
			Toolbox.removeClass(this.fullDisplayArea, "hidden");
			
			Toolbox.ReplaceInPlace(this.fullDisplayArea, city);
			
			// special templates
			var dataTemplates = Toolbox.getAllElements("[data-template]", this.fullDisplayArea);
			for (var i=0; i<dataTemplates.length; i++)
			{
				var templateName = Toolbox.getAttribute(dataTemplates[i], "data-template");
				var templateEl = Toolbox.getElement("#"+templateName);
				if (templateEl != null)
				{
					var html = templateEl.innerHTML;
					html = Toolbox.Replace(html, city); // after handling and removing logic blocks, parse everything
					dataTemplates[i].innerHTML = html;
				}
			}
		},
		
		renderCityList: function()
		{
			var self = this;
			Toolbox.addClass(this.viewListArea, "hidden");
			Toolbox.removeClass(this.sortByArea, "hidden");
			Toolbox.addClass(this.fullDisplayArea, "hidden");
			
			var cities = Toolbox.getAllElements(self.elements.cityDiv.selector, self.cityListInsertionPoint);
			Toolbox.removeClass(cities, "fadeOut");
			Toolbox.removeClass(cities, "hidden");
			Toolbox.removeClass(cities, "selected");
			Toolbox.removeClass(cities, "marginAlignCenter");
		},
		
		/// getInitParamsFromView() ///
		// Read input values from DOM //
		setCities: function(cities)
		{	
			this.cities = cities;
		},
		
		// view manager
		Initialize: function()
		{
			this.bindAll();
		}
				
	};

	return ViewManager;
});

