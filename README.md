# BioJS registry workman

This is a re-implementation of the original [registry-workmen](https://github.com/biojs/registry-workmen).
It's currently still work in progress.

## Plan

The plan is use current node and JavaScript versions (node 8 and ECMA Script 2017), a more functional approach and streams.

There will be a [hapi](https://hapijs.com/) server that will allow interaction with the [registry](http://biojs.io) and a mongo database.

In regular intervals or on demand, the server will query the npm registry for new packages with the `bionode` and `biojs` keywords. It will then gather and attach additional information through plugins and save it to the database.
Ideally it will listen to changes in npm directly.

## Todo

* Change database update to use streams
* Automate updates with cron-like mechanism
* Add plugins for npm stats, github info and stats, and example snippets
* Potential plugins for post-processing
