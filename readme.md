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


Roadmap
=======

V 0.1
- [x] Set favourite - sets the users favourite {station}
- [x] Next Train - gets the next train at {favourite}
- [ ] Next local train - gets the next train at {localStation} (location data)

V 0.2
- [ ] List stations - grab stations near the user
- [ ] List stations near {station} - grab stations near the {station}

V 0.3
- [ ] Plan my route - starts a dialogue that works out a route from {station} to {station}
- [ ] Save a route - saves a route
- [ ] Delete a route - deletes a saved route
