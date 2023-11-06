import psycopg2

# important do not store password when dealing with real database
# might want to consider SQL injection down the line
# might want to use database entry ID instead of label for identifying specific systems

# gets all systems from the database

class PostgresConnector:

    def __init__(self):

        self.connection = psycopg2.connect(
                host="localhost",
                dbname="dynamSystems",
                user="postgres",
                password="docker")

    def getAllSystems(self):
        columns = '*'
        sql = "SELECT " + columns + " FROM public.data"
        cur = self.connection.cursor()
        cur.execute(sql)
        result = cur.fetchall()
        cur.close()
        return result

    # gets a system identified by its label, input is string
    def getSystem(self,label):
        columns = '*'
        sql = "SELECT " + columns + " FROM public.data WHERE label = '" + label + "'"
        cur = self.connection.cursor()
        cur.execute(sql)
        result = cur.fetchall()
        cur.close()
        return result

    # gets systems that match the passed in filters, input should be json object
    def getFilteredSystems(self,filters):
        columns = 'label, N, degree, models_original_polys_val, base_field_latex'
        whereText = self.buildWhereText(filters)
        sql = "SELECT " + columns + " FROM public.data" + whereText
        cur = self.connection.cursor()
        cur.execute(sql)
        result = cur.fetchall()
        cur.close()
        return result

    # gets a subset of the systems identified by the labels, input should be json list
    def getSelectedSystems(self,labels):
        labels = "(" + ", ".join(["'" + str(item) + "'" for item in labels]) + ")"
        columns = '*'
        sql = "SELECT " + columns + " FROM public.data WHERE label in " + labels
        cur = self.connection.cursor()
        cur.execute(sql)
        result = cur.fetchall()
        cur.close
        return result
    
    def getStatistics(self,filters):
        whereText = self.buildWhereText(filters)
        #number of maps
        sql = "SELECT COUNT( models_original_height) FROM public.data" + whereText 
        cur = self.connection.cursor()
        cur.execute(sql)
        result0 = cur.fetchall()
        #number of PCF
        sql = "SELECT SUM(is_PCF::int) FROM public.data" + whereText 
        cur = self.connection.cursor()
        cur.execute(sql)
        result1 = cur.fetchall()
        #Average Height
        sql = "SELECT AVG( models_original_height) FROM public.data" + whereText 
        cur.execute(sql)
        result2 = cur.fetchall()
        #number of Newtonian
        sql = "SELECT SUM(is_Newton::int) FROM public.data" + whereText 
        cur = self.connection.cursor()
        cur.execute(sql)
        result3 = cur.fetchall()
        #Average Resultant
        sql = "SELECT AVG( models_original_resultant) FROM public.data" + whereText 
        cur.execute(sql)
        result4 = cur.fetchall()
        cur.close()
        return [result0, result1, result2, result3, result4]

    def buildWhereText(self, filters):
        # remove empty filters
        for filter in filters.copy():
            if not filters[filter] or filters[filter] == []:
                del filters[filter]

        if len(filters) == 0:
            return ""

        filterText = " WHERE "
        conditions = []

        for filter, values in filters.items():
            if filter in ['base_field_degree', 'automorphism_group_cardinality','indeterminacy_locus_dimension']:
                conditions.append("CAST(" + filter + " AS integer) IN (" + values + ")")

            elif filter in ['base_field_label']:
                conditions.append(filter + " LIKE '%" + values + "%'")

            else:
                conditions.append(filter + " IN (" + ', '.join(str(e) for e in values) + ")")

        filterText += " AND ".join(conditions)
        return filterText
