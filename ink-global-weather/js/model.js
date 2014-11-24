////////////////////////////////
///    Base Player object    ///
/// Player.prototype => null ///
////////////////////////////////
"use strict";
define(function (require) {

	function Model(params)
	{
		this.id = 0;
		
		if (params != null)
		{
			for (var key in params)
			{	
				var value = params[key];
				this[key] = value;
			}
		}
	}

	Model.prototype = {
		
		Load: function ()
		{
			return null;
		},
		
		Save: function ()
		{
			return false;
		}
	};

	return Model;
});

