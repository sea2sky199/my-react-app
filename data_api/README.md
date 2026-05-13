# README
Compound Match microservice responsible for interacting with and caching the compounds database for the Compound Match web app.
___
### Routes
* __/__ - __GET__ - leads to the [Swagger UI](https://swagger.io/tools/swagger-ui/) for documentation and easy testing of the other routes

* __/compounds/__ - __POST__ - returns a windowed list of all compounds and some descriptive data about them from the database. Can also be used to get compounds similar to the one passed in.

* __/compounds/{compound_number}__ - __POST__ - gets all of the known details of a specific compound from the database.

* __/compounds/summary__ - __POST__ - gets the summary statistics that are used to populate the Compound Match /requestAccess page.

* __/compounds/metadata__ - __POST__ - gets compounds metadata that are used for filtering in both the table and grid views.

* __/compounds/explore__ - __POST__ - gets all compound exploration data for d3 filtering in the icicle chart.

* __/compounds/distribution__ - __POST__ - gets distribution data for all compounds for d3 distribution chart.

* __/compounds/distribution/{compound_number}__ - __POST__ - gets distribution data for the subset of similar compounds for d3 distribution chart.

* __/utils/clearCache__ - __GET__ - wipes out all entires in the Redis cache. This route can only be accessed from the PCF app manager web portal or throught the PCF CLI. Refer to this [wiki page](https://git.web.chemdw.com/chem/chem-dev/-/wikis/how-tos/manually-refresh-cache) for additional info. on how to hit this route.

* __/utils/refreshCache__ - __GET__ - checks the ADMIN level of every cached item in Redis for any changes compared to the database, OR, for the existence of that item. If any changes are found, or the item doesn't exist, then all underlying variations of that item are deleted and refreshed using new calls to the database. This route can only be accessed from the PCF app manager web portal or throught the PCF CLI. Refer to this [wiki page](https://git.web.chemdw.com/chem/chem-dev/-/wikis/how-tos/manually-refresh-cache) for additional info. on how to hit this route.