"use strict";

require.config({
    paths: {
        'QUnit': [//'', // if we want to load from from CDN first
                  '../qunit-1.15.0' // fallback to local
                 ]
    },
    shim: {
       'QUnit': {
           exports: 'QUnit',
           init: function() {
               QUnit.config.autoload = false;
               QUnit.config.autostart = false;
           }
       } 
    }
});
// require the unit tests.
require(
    ['QUnit',  'tests/controller', 'tests/city', 'tests/weather-source-api', 'tests/toolbox'],
    function(QUnit, ControllerTest, CityTest, WeatherSourceApiTest, ToolboxTest) {
        
        // run the tests.
        CityTest.run();
        WeatherSourceApiTest.run();
        ControllerTest.run();
        ToolboxTest.run();
        
        // start QUnit.
        QUnit.load();
        QUnit.start();
    }
);

