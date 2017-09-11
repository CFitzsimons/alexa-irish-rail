Alexa Irish Rail
================


The aim is to create a one stop skill for any Irish rail services in Ireland.  It is built using the [Irish Rail API](http://api.irishrail.ie/realtime/) which operates in XML.  A [conversion library](https://github.com/Leonidas-from-XIV/node-xml2js) is being used to parse this XML as JSON for easier processing.  

Contributing
============

The best way to contribute is to take one of the intents below and mark yourself as working on it by submitting an issue.  There are a few things that should be noted when contributing:

1. Please ensure your code passes the linter (eslint).
2. Ensure your code passes all existing tests (npm test).
3. Please supply at least 'some' tests for your code (add an extra file in the /test directory).
4. Create a branch to work on and submit a pull request on Github.  Don't merge straight into master without a pull request.  

Intents
=======

The following intents are proposed for the system.  

"What stations are near me?"
----------------------------

Alexa should return the top 3 nearest stations in order of distance.  


"What is my nearest station?"
-----------------------------

Alexa should return the nearest station in kilometers (aprox.)

"When is my next local train(/DART)?" (1)
-----------------------------------

Alexa should get the nearest station to the user and return a question, asking (Northbound/Southbound/Cork/...).  

"When is my next local train(/DART)?" (2) -- "Northbound(/Southbound/Cork/...)"
-------------------------------------------------------------------------

Alexa should get the next service going the direction the user specified.


"Set favourite as {X}" [REDUNDANT?]
----------------------

Alexa should set the users favourite station as {X}.

"When is my next train(/DART)?" (1)
-----------------------------------

Alexa should get the favourite station and return a question, asking (Northbound/Southbound/Cork/...).  

"When is my next train(/DART)?" (2) -- "Northbound(/Southbound/Cork/...)"
-------------------------------------------------------------------------

Alexa should get the next service going the direction the user specified.

"How to get between {X} and {Y}?" (1)
---------------------------------

Alexa should return a question, asking when you are likely to leave {X} (based on route departure times)

"How to get between {X} and {Y}?" (2) --- "soonest/next, second, third, 17:22..."
---------------------------------

Alexa will return a route with a departure time from {X}, any change overs, the cost and the arrival time at {Y}.

"Repeat that last response"
---------------------------

Repeats the last command alexa spoke.  
