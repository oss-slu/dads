import psycopg2

# important do not store password when dealing with real database
# might want to consider SQL injection down the line
# might want to use database entry ID instead of label for identifying specific systems

# gets all systems from the database

class PostgresConnector:

    def __init__(self):
        self.connection = psycopg2.connect(
                "dbname=dynamSystems user=postgres password=docker")


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

    def buildWhereText(self, filters):
        # TESTING, REMOVE:
        print(filters)
        # remove empty filters
        for filter in filters.copy():
            if not filters[filter] or filters[filter] == []:
                del filters[filter]

        if len(filters) == 0:
            return ""

        filterText = " WHERE "
        conditions = []

        if 'base_field_degree' in filters:
            # CASTING ERROR, for some reason base_field degree is being evaluated as boolean, even though it has the
            # same formating as the other integer query fields like degree. TO FIX before merge
            conditions.append("CAST(base_field_degree AS integer) IN (" + str(filters['base_field_degree']) + ")")
            
        if 'indeterminacy_locus_dimension' in filters:
            conditions.append("CAST(indeterminacy_locus_dimension AS integer) IN (" + str(filters['indeterminacy_locus_dimension']) + ")")


        if 'base_field_label' in filters:
            conditions.append("base_field_label LIKE '%" + filters['base_field_label'] + "%'")

        for filter, values in filters.items():
            if filter not in ['base_field_degree', 'base_field_label', 'indeterminacy_locus_dimension']:
                conditions.append(filter + " IN (" + ', '.join(str(e) for e in values) + ")")

        filterText += " AND ".join(conditions)
        return filterText
