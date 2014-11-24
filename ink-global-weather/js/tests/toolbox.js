"use strict";

define(['ui-toolbox'], function(Toolbox) {

	var run = function() 
	{
		test('Get an element by ID using the UI Toolbox', function() 
		{
			var el = Toolbox.getElement("#testEl");
			ok(el != null, "Element should be non-null");
		});
		
		test('Get multiple elements from a single selector with the UI Toolbox', function() 
		{
			var el = Toolbox.getAllElements(".jsBindMultiple");
			equal(el.length, 3, "All three elements are found and returned");
		});
		
		test('Set/Get an attribute to an element using the UI Toolbox', function() 
		{
			var el = Toolbox.getElement("#testEl");
			Toolbox.setAttribute(el, "super-cool", "yep");
			var retrieved = Toolbox.getAttribute(el, "super-cool");
			equal(retrieved, "yep", "The attribute value should be the same as when set");
		});
		
	};
        
	return {run: run}
});
