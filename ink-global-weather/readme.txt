
== How to build release ==
cd js
node lib/r.js -o ../build/app.build.js

== Original Estimate ==
Two views:
 - list view of cities; ability to sort by temperature
 - individual view of one city with full data displayed
API calls:
 - fetch weather data for one city
 - function to loop over an array of cities

Unit tests:
 - fetch one city with API, validate result as expected
 - fetch an array of cities, validate result as expected
Functional tests:
 - render list of cities, verify data is in view
 - trigger sorting, validate that first item has lowest temperature
 - render individual city, validate all data is in view.

6 hours
Actual: 9 hours
