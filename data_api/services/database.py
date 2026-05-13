from sys import stderr
from pandas import read_sql_query

from services.db_utils import Param


class Database(object):
    """
    Class handler for instantiating and interacting with database service.
    """

    def __init__(self, credentials, db_env, connect, Error, sql_format):
        self._credentials = credentials
        self.db_env = db_env
        self.connect = connect
        self.Error = Error
        self.sql_format = sql_format
        self._schemas = ['ELABS_BCA_CHEM', 'ELABS_BCA_CHEM2']

    def get_conn(self):
        try:
            print ("before conn", self._schemas, file=stderr)
            print (self._credentials, file=stderr)
            print (self.db_env, self.connect, file=stderr)
            conn = self.connect(**self._credentials)
            return conn
        except self.Error as e:
            print(e, file=stderr)

    def query(self, sql, params=None):
        conn = self.get_conn()
        try:
            df = read_sql_query(sql, con=conn, params=params)
        except self.Error as e:
            print(e, file=stderr)
            raise
        finally:
            conn.close()

        return df

    def get_compounds_count(self):
        sql = """
            SELECT COUNT(*) AS row_count
            FROM {compounds_schema}.compound_features_attributes_r18
        """.format(compounds_schema=self._schemas[1])
        values = self.query(sql)
        return values

    def get_compounds_list(self, one_row=False):
        env_string = ['TOP 1', ''] if self.db_env in ['production', 'staging'] else ['', 'LIMIT 1']
        env_string = env_string if one_row else ['', '']

        sql = """
            WITH latest_predictions AS (
                SELECT compound_number
                     , compound_number_clean
                     , predicted_price
                FROM {finance_schema}.compound_predict_price
                WHERE version = 'AIMS_DES_V4'
            ),

            sizing as (
                SELECT compoundNumber
                     , compoundNumberClean
                     , chemCode as sizeCode
                FROM {compounds_schema}.compound_codes
                WHERE version = 'size_v2'
            )

            SELECT {env_string[0]}
                   pf.compoundNumber
                 , pf.compoundNumberClean
                 , pf.compoundNumberVersion
                 , pf.compoundName
                 , pf.compoundElement
                 , pf.compoundForm
                 , pf.program
                 , pf.finishedLengthInches
                 , pf.finishedWidthInches
                 , pf.finishedHeightInches
                 , pf.finishedVolumeInches3
                 , pf.stockSurfaceAreaInches2
                 , pf.stockLengthInches
                 , pf.stockWidthInches
                 , pf.stockHeightInches
                 , pf.stockVolumeInches3
                 , pf.stockWeightPounds
                 , (pf.stockWeightPounds * pf.buyToFly) as finishedWeightPounds
                 , pf.finishedSurfaceAreaInches2
                 , pf.buyToFly
                 , pf.unreleasedStatus
                 , CASE WHEN plp.compound_number IS NULL THEN 'NO' ELSE 'YES' END AS onContract
                 , UPPER(plp.supplier_name) as supplierName
                 , ps.five_year_quantity AS demandVolume
                 , plp.unit_price as unitPrice
                 , plp.unit_price AS contractPrice
                 , lp.predicted_price as predictedPrice
                 , lp.predicted_price - plp.unit_price AS priceDelta
                 , (ps.five_year_quantity * plp.unit_price) - (five_year_quantity * lp.predicted_price) AS "5YearPredictedOpportunity"
                 , COALESCE(eo.complexityCode, 'UNCLASSIFIED') AS complexityCode
                 , eo.predictedSpend5Yr - eo.fcstSpend5Yr AS "5YearOpportunitySpend"
                 , eo.fcstQty5Yr AS "5YearForecastQuantity"
                 , eo.fcstSpend5Yr AS "5YearForecastSpend"
                 , eo.predictedSpend5Yr AS "5YearPredictedSpend"
                 , COALESCE(s.sizeCode, 'UNCLASSIFIED') as sizeCode
            FROM {compounds_schema}.compound_features_attributes_r18 pf
            LEFT JOIN {finance_schema}.compound_last_price plp
                ON pf.compoundNumber = plp.compound_number
                OR pf.compoundNumberClean = plp.compound_number
            LEFT JOIN {finance_schema}.compound_spend ps
                ON pf.compoundNumber = ps.compound_number
                OR pf.compoundNumberClean = ps.compound_number
            LEFT JOIN latest_predictions lp
                ON pf.compoundNumber = lp.compound_number
            LEFT JOIN sizing s
                ON s.compoundNumber = pf.compoundNumber
            LEFT JOIN {finance_schema}.apps_viz_explore_opp eo
                ON eo.compoundNumber = pf.compoundNumber
            ORDER BY pf.compoundNumber
            {env_string[1]}
        """.format(env_string=env_string, compounds_schema=self._schemas[1],
                   finance_schema=self._schemas[0])
        values = self.query(sql)
        return values

    def get_compounds_summary(self, role):
        role_string = ["""AND unreleasedStatus <> 1""", """WHERE unreleasedStatus <> 1"""] if role not in [
            'ADMIN', 'PD USER'] else ["", ""]
        role_string = [string + """ OR pf.program LIKE 'NMA'""" if role ==
                       'NMA USER' else string for string in role_string]
        sql = """
            SELECT 'compoundElement' AS "grouping", compoundElement AS groupKey, COUNT(*) AS val
            FROM {compounds_schema}.compound_features_attributes_r18 pf
            WHERE LOWER(compoundElement) IN ('aluminum', 'titanium')
            {role_string[0]}
            GROUP BY 1,2

            UNION ALL

            SELECT 'compoundForm' AS "grouping", compoundForm AS groupKey, COUNT(*) AS val
            FROM {compounds_schema}.compound_features_attributes_r18 pf
            WHERE LOWER(compoundForm) IN ('plate', 'extrusion', 'sheet')
            {role_string[0]}
            GROUP BY 1,2

            UNION ALL

            SELECT 'program' AS "grouping", program AS groupKey, COUNT(*) AS val
            FROM {compounds_schema}.compound_features_attributes_r18 pf
            WHERE LOWER(program) IN ('737', '747', '757', '767', '787', 'plane 1', 'plane 2', 'plane 3')
            {role_string[0]}
            GROUP BY 1,2

            UNION ALL

            SELECT 'totalCompounds' AS "grouping", 'totalCompounds' AS groupKey, COUNT(*) AS val
            FROM {compounds_schema}.compound_features_attributes_r18 pf
            {role_string[1]}
            GROUP BY 1,2
        """.format(role_string=role_string, compounds_schema=self._schemas[1])
        print(sql, file=stderr)
        values = self.query(sql)
        return values

    def get_compound_details(self, compound_number):
        sql = ("""
            WITH latest_predictions AS (
                SELECT compound_number
                     , compound_number_clean
                     , predicted_price
                FROM {finance_schema}.compound_predict_price
                WHERE version = 'AIMS_DES_V4'
            ),

            sizing as (
                SELECT compoundNumber
                     , compoundNumberClean
                     , chemCode as sizeCode
                FROM {compounds_schema}.compound_codes
                WHERE version = 'size_v2'
            ),

            latest_catcompounds AS (
                SELECT compound_file
                     , MAX(pkey) as pkey
                FROM {compounds_schema}.cadlearn_catcompounds
                GROUP BY 1
            )

            SELECT pf.*
                 , (pf.stockWeightPounds * pf.buyToFly) as finishedWeightPounds
                 , COALESCE(s.sizeCode, 'UNCLASSIFIED') as sizeCode
                 , CASE WHEN cl.compound_file IS NULL THEN 0 ELSE 1 END AS isCad
                 , CASE WHEN plp.compound_number IS NULL THEN 'NO' ELSE 'YES' END AS onContract
                 , UPPER(plp.supplier_name) as supplierName
                 , ps.five_year_quantity AS demandVolume
                 , plp.unit_price as unitPrice
                 , plp.unit_price AS contractPrice
                 , lp.predicted_price as predictedPrice
                 , lp.predicted_price - plp.unit_price AS priceDelta
                 , (ps.five_year_quantity * plp.unit_price) - (five_year_quantity * lp.predicted_price) AS "5YearPredictedOpportunity"
                 , COALESCE(eo.complexityCode, 'UNCLASSIFIED') AS complexityCode
                 , eo.predictedSpend5Yr - eo.fcstSpend5Yr AS "5YearOpportunitySpend"
                 , eo.fcstQty5Yr AS "5YearForecastQuantity"
                 , eo.fcstSpend5Yr AS "5YearForecastSpend"
                 , eo.predictedSpend5Yr AS "5YearPredictedSpend"
                 , pft.description AS compoundNotes
            FROM {compounds_schema}.compound_features_attributes_r18 pf
            LEFT JOIN latest_catcompounds cl
                ON CONCAT(pf.compoundNumber, '.PUBCHEMCompound') = cl.compound_file
            LEFT JOIN {finance_schema}.compound_last_price plp
                ON pf.compoundNumber = plp.compound_number
                OR pf.compoundNumberClean = plp.compound_number
            LEFT JOIN {finance_schema}.compound_spend ps
                ON pf.compoundNumber = ps.compound_number
                OR pf.compoundNumberClean = ps.compound_number
            LEFT JOIN latest_predictions lp
                ON pf.compoundNumber = lp.compound_number
            LEFT JOIN sizing s
                ON s.compoundNumber = pf.compoundNumber
            LEFT JOIN {compounds_schema}.compound_features_text_new pft
                ON pft.compoundNumber = pf.compoundNumber
                AND pft.version = 'notes_v1'
            LEFT JOIN {finance_schema}.apps_viz_explore_opp eo
                ON eo.compoundNumber = pf.compoundNumber
            WHERE pf.compoundNumber = 
        """.format(compounds_schema=self._schemas[1], finance_schema=self._schemas[0]),
               Param('compound_number', compound_number))
        values = self.query(*self.sql_format(sql))
        return values

    def get_compound_explore(self, hierarchy_array, role):
        role_string = """WHERE unreleasedStatus <> 1""" if role not in ['ADMIN', 'PD USER'] else ''
        role_string = role_string + """ OR pf.program LIKE 'NMA'""" if role == 'NMA USER' else role_string

        # this is necessary to catch compounds that don't have a sizeCode
        columns = []
        for col in hierarchy_array:
            if col == 'sizeCode':
                columns.append("COALESCE(s.sizeCode, 'UNCLASSIFIED') as sizeCode")
            elif col == 'sizeSubCode':
                columns.append("COALESCE(s.sizeSubCode, 'UNCLASSIFIED') as sizeSubCode")
            else:
                columns.append(col)
        columns_string = ', '.join(columns)

        sql = """
            WITH sizing as (
                SELECT compoundNumber
                     , compoundNumberClean
                     , substring(chemCode, 1, 1) as sizeCode
                     , substring(chemCode, 3, 6) as sizeSubCode
                FROM {compounds_schema}.compound_codes
                WHERE version = 'size_v2'
            )

            SELECT {columns_string}
                 , count(*) AS total
            FROM {compounds_schema}.compound_features_attributes_r18 pf
            LEFT JOIN sizing s
                ON s.compoundNumber = pf.compoundNumber
            {role_string}
            GROUP BY 1,2,3,4
        """.format(role_string=role_string, columns_string=columns_string,
                   compounds_schema=self._schemas[1])
        values = self.query(sql)
        return values

    def get_compound_metadata(self, role, finance_permission):
        role_string = """WHERE unreleasedStatus <> 1""" if role not in [
            'ADMIN', 'PD USER'] else ''
        role_string = role_string + """ OR pf.program LIKE 'NMA'""" if role == 'NMA USER' else role_string
        role_string_conditional = 'AND' if role_string else 'WHERE'
        finance_string = """
            UNION ALL

            select 'onContract' AS "grouping"
                 , CASE WHEN plp.compound_number IS NULL THEN 'NO' ELSE 'YES' END AS name
                 , count(*) AS total
            FROM {compounds_schema}.compound_features_attributes_r18 pf
            LEFT JOIN {finance_schema}.compound_last_price plp
                ON pf.compoundNumber = plp.compound_number
                OR pf.compoundNumberClean = plp.compound_number
            {role_string}
            GROUP BY 1,2

            UNION ALL

            select 'supplierName' AS "grouping"
                 , UPPER(supplier_name) AS name
                 , count(*) AS total
            FROM {compounds_schema}.compound_features_attributes_r18 pf
            LEFT JOIN {finance_schema}.compound_last_price plp
                ON pf.compoundNumber = plp.compound_number
                OR pf.compoundNumberClean = plp.compound_number
            {role_string}
            {role_string_conditional} plp.supplier_name IS NOT NULL
            GROUP BY 1,2
        """.format(role_string=role_string,
                   role_string_conditional=role_string_conditional,
                   compounds_schema=self._schemas[1],
                   finance_schema=self._schemas[0]) if finance_permission else ""

        sql = """
            WITH sizing as (
                SELECT compoundNumber
                     , compoundNumberClean
                     , chemCode AS sizeCode
                FROM {compounds_schema}.compound_codes
                WHERE version = 'size_v2'
            )

            SELECT 'complexityCode' AS "grouping"
                 , COALESCE(eo.complexityCode, 'UNCLASSIFIED') AS name
                 , count(*) AS total
            FROM {compounds_schema}.compound_features_attributes_r18 pf
            LEFT JOIN {finance_schema}.apps_viz_explore_opp eo
                ON eo.compoundNumber = pf.compoundNumber
            {role_string}
            GROUP BY 1,2

            UNION ALL

            SELECT 'compoundElement' AS "grouping"
                 , compoundElement AS name
                 , count(*) AS total
            FROM {compounds_schema}.compound_features_attributes_r18 pf
            {role_string}
            GROUP BY 1,2

            UNION ALL

            select 'compoundForm' AS "grouping"
                 , compoundForm AS name
                 , count(*) AS total
            FROM {compounds_schema}.compound_features_attributes_r18 pf
            {role_string}
            GROUP BY 1,2

            UNION ALL

            select 'program' AS "grouping"
                 , pf.program AS name
                 , count(*) AS total
            FROM {compounds_schema}.compound_features_attributes_r18 pf
            {role_string}
            GROUP BY 1,2

            UNION ALL

            select 'sizeCode' AS "grouping"
                 , COALESCE(s.sizeCode, 'UNCLASSIFIED') AS name
                 , count(*) AS total
            FROM {compounds_schema}.compound_features_attributes_r18 pf
            LEFT JOIN sizing s
                ON pf.compoundNumber = s.compoundNumber
            {role_string}
            GROUP BY 1,2

            {finance_string}
        """.format(role_string=role_string, finance_string=finance_string,
                   compounds_schema=self._schemas[1], finance_schema=self._schemas[0])
        values = self.query(sql)
        return values

    def get_similar_compounds(self, compound_number):
        sql = ("""
            WITH latest_catcompounds AS (
                SELECT compound_file
                     , MAX(pkey) as pkey
                FROM {compounds_schema}.cadlearn_catcompounds
                GROUP BY 1
            )

            SELECT cpn.neighbors
            FROM {compounds_schema}.compound_features_attributes_r18 fa
            JOIN latest_catcompounds cp
                ON CONCAT(fa.compoundNumber, '.PUBCHEMCompound') = cp.compound_file
            JOIN {compounds_schema}.cadlearn_catcompounds_neighbors cpn
                ON cp.pkey = cpn.fkey_compounds
            WHERE fa.compoundNumber = 
        """.format(compounds_schema=self._schemas[1]), Param('compound_number', compound_number))
        values = self.query(*self.sql_format(sql))
        return values

    def get_similar_compounds_details(self, compound_ids):
        compound_ids = tuple(compound_ids)
        sql = """
            WITH latest_predictions AS (
                SELECT compound_number
                     , compound_number_clean
                     , predicted_price
                FROM {finance_schema}.compound_predict_price
                WHERE version = 'AIMS_DES_V4'
            ),

            sizing as (
                SELECT compoundNumber
                     , compoundNumberClean
                     , chemCode as sizeCode
                FROM {compounds_schema}.compound_codes
                WHERE version = 'size_v2'
            ),

            latest_catcompounds AS (
                SELECT compound_file
                     , MAX(pkey) as pkey
                FROM {compounds_schema}.cadlearn_catcompounds
                GROUP BY 1
            )

            SELECT cp.pkey AS compound_id
                 , pf.compoundNumber
                 , pf.compoundNumberClean
                 , pf.compoundNumberVersion
                 , pf.compoundName
                 , pf.compoundElement
                 , pf.compoundForm
                 , pf.program
                 , pf.finishedLengthInches
                 , pf.finishedWidthInches
                 , pf.finishedHeightInches
                 , pf.finishedVolumeInches3
                 , pf.stockSurfaceAreaInches2
                 , pf.stockLengthInches
                 , pf.stockWidthInches
                 , pf.stockHeightInches
                 , pf.stockVolumeInches3
                 , pf.stockWeightPounds
                 , (pf.stockWeightPounds * pf.buyToFly) as finishedWeightPounds
                 , pf.finishedSurfaceAreaInches2
                 , pf.buyToFly
                 , pf.unreleasedStatus
                 , CASE WHEN plp.compound_number IS NULL THEN 'NO' ELSE 'YES' END AS onContract
                 , UPPER(plp.supplier_name) as supplierName
                 , ps.five_year_quantity AS demandVolume
                 , plp.unit_price as unitPrice
                 , plp.unit_price AS contractPrice
                 , lp.predicted_price as predictedPrice
                 , lp.predicted_price - plp.unit_price AS priceDelta
                 , (ps.five_year_quantity * plp.unit_price) - (five_year_quantity * lp.predicted_price) AS "5YearPredictedOpportunity"
                 , COALESCE(eo.complexityCode, 'UNCLASSIFIED') AS complexityCode
                 , eo.predictedSpend5Yr - eo.fcstSpend5Yr AS "5YearOpportunitySpend"
                 , eo.fcstQty5Yr AS "5YearForecastQuantity"
                 , eo.fcstSpend5Yr AS "5YearForecastSpend"
                 , eo.predictedSpend5Yr AS "5YearPredictedSpend"
                 , COALESCE(s.sizeCode, 'UNCLASSIFIED') as sizeCode
            FROM {compounds_schema}.compound_features_attributes_r18 pf
            LEFT JOIN latest_catcompounds cp
                ON cp.compound_file = CONCAT(pf.compoundNumber, '.PUBCHEMCompound')
            LEFT JOIN {finance_schema}.compound_last_price plp
                ON pf.compoundNumber = plp.compound_number
                OR pf.compoundNumberClean = plp.compound_number
            LEFT JOIN {finance_schema}.compound_spend ps
                ON pf.compoundNumber = ps.compound_number
                OR pf.compoundNumberClean = ps.compound_number
            LEFT JOIN latest_predictions lp
                ON pf.compoundNumber = lp.compound_number
            LEFT JOIN sizing s
                ON s.compoundNumber = pf.compoundNumber
            LEFT JOIN {finance_schema}.apps_viz_explore_opp eo
                ON eo.compoundNumber = pf.compoundNumber
            WHERE cp.pkey IN {compound_ids}
        """.format(compound_ids=compound_ids, compounds_schema=self._schemas[1],
                   finance_schema=self._schemas[0])
        values = self.query(sql)
        return values
