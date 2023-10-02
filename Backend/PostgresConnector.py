import psycopg2

# important do not store password when dealing with real database
# might want to consider SQL injection down the line
# might want to use database entry ID instead of label for identifying specific systems

# gets all systems from the database

class PostgresConnector:

    def __init__(self):
        self.connection = psycopg2.connect(
                "dbname=dynamSystems user=postgres password=docker")
        self.cursor = self.connection.cursor()



    def getAllSystems(self):
        columns = '*'
        sql = "SELECT " + columns + " FROM public.data"
        self.cursor.execute(sql)
        return self.cursor.fetchall()


# gets a system identified by its label, input is string
    def getSystem(self,label):
        columns = '*'
        sql = "SELECT " + columns + " FROM public.data WHERE label = '" + label + "'"
        self.cursor.execute(sql)
        return self.cursor.fetchall()


# gets systems that match the passed in filters, input should be json object
    def getFilteredSystems(self,filters):
        columns = 'label, N, degree, models_original_polys_val, base_field_latex'
        whereText = buildWhereText(filters)
        sql = "SELECT " + columns + " FROM public.data" + whereText
        self.cursor.execute(sql)
        return self.cursor.fetchall()


# gets a subset of the systems identified by the labels, input should be json list
    def getSelectedSystems(self,labels):
        labels = "(" + ", ".join(["'" + str(item) + "'" for item in labels]) + ")"
        columns = '*'
        sql = "SELECT " + columns + " FROM public.data WHERE label in " + labels
        self.cursor.execute(sql)
        return self.cursor.fetchall()


# function that builds the WHERE part of SQL query to filter the results
    def buildWhereText(self,filters):
    # remove empty filters
        for filter in filters.copy():
            if filters[filter] == []:
                del filters[filter]

        if len(filters) == 0:
            return ""

        filterText = " WHERE "

    # go through each non-empty filter and add it to the list for the WHERE clause
        for index, filter in enumerate(filters):
            filterText += filter + " in " + \
                    "(" + ', '.join(str(e) for e in filters[filter]) + ")"

            if (index != len(filters)-1):
                filterText += " AND "

        return filterText
