"""
Module Docstring
manages  server data queries
"""
import psycopg2
import psycopg2.extras

# important do not store password when dealing with real database
# might want to consider SQL injection down the line
# gets all systems from the database

class PostgresConnector:

    def __init__(self):

        self.connection = psycopg2.connect(
                host='localhost',
                dbname='dad',
                user='dad_user',
                password='dad_pass',
                port='5432')

    def constructLabel(self, data):
        return (
            '1.' +
            data['sigma_one'] +
            '.' + data['sigma_two'] +
            '.' + data['sigma_three'] +
            '.' + str(data['ordinal'])
        )

    def getAllSystems(self):
        columns = '*'
        sql = 'SELECT ' + columns + ' FROM functions_dim_1_NF'
        try:
            with self.connection.cursor() as cur:
                cur.execute(sql)
                result = cur.fetchall()
        except Exception:
            self.connection.rollback()
            result = None
        finally:
            if cur:
                cur.close()
        return result

    # gets a system identified by its label, input is string
    def getSystem(self, ip):
        cur = None
        try:
            sql = f"""
                SELECT *
                FROM functions_dim_1_nf
                JOIN rational_preperiodic_dim_1_nf 
                ON functions_dim_1_nf.function_id = rational_preperiodic_dim_1_nf.function_id
                JOIN graphs_dim_1_nf ON rational_preperiodic_dim_1_nf.graph_id = graphs_dim_1_nf.graph_id
                LEFT JOIN LATERAL UNNEST(COALESCE(functions_dim_1_nf.citations, ARRAY[NULL]::INTEGER[])) AS citation_id ON true
                LEFT JOIN citations ON citations.id = citation_id
                WHERE functions_dim_1_nf.function_id = %s
                """
            with self.connection.cursor(
                cursor_factory=psycopg2.extras.DictCursor
                ) as cur:
                cur.execute(sql, (ip,))
                temp = cur.fetchone()
                if temp:
                    modelLabel = self.constructLabel(temp)
                    result = {'modelLabel': modelLabel, **temp}
                else:
                    result = {}

        except Exception:
            self.connection.rollback()
            result = {}

        finally:
            if cur:
                cur.close()
        print(result)
        return result

    # gets systems that match the passed in filters, input should be json object
    def getFilteredSystems(self, filters):
        # return a list of strings of the form:
        #    label, dimension, degree, polynomials, field_label

        columns = (
            'function_id, sigma_one, sigma_two, sigma_three, ordinal,'
            ' degree, (original_model).coeffs, base_field_label'
        )
        dims = filters['N']
        del filters['N']
        whereText = self.buildWhereText(filters)
        cur = None
        try:
            stats= self.getStatistics(whereText)
            result = []
            if dims == [] or 1 in dims:
                sql = (
                    'SELECT ' +
                    columns +
                    ' FROM functions_dim_1_NF' +
                    whereText
                )
                with self.connection.cursor(
                    cursor_factory=psycopg2.extras.DictCursor
                    ) as cur:
                    cur.execute(sql)
                    # TODO: limit the total number that can be returned
                    mon_dict = {}
                    for row in cur:
                        d = int(row['degree'])
                        if d in mon_dict.keys():
                            mon = mon_dict[d]
                        else:
                            # create the monomial list
                            mon = []
                            for i in range(d+1):
                                if i == 0:
                                    mon.append('x^'+str(d))
                                elif i == d:
                                    mon.append('y^'+str(d))
                                else:
                                    if (d-i) == 1 and i == 1:
                                        mon.append('xy')
                                    elif i == 1:
                                        mon.append('x^'+str(d-i) + 'y')
                                    elif (d-i) == 1:
                                        mon.append('x' + 'y^' + str(i))
                                    else:
                                        mon.append('x^'+str(d-i) + 'y^'+str(i))
                            mon_dict[d] = mon
                        poly = []
                        c = row['coeffs']
                        for j in range(2):
                            first_term = True
                            for i in range(d+1):
                                if c[j][i] != '0':
                                    if c[j][i][0] != '-' and not first_term:
                                        poly += '+'
                                    if c[j][i] == '1':
                                        poly += mon[i]
                                    elif c[j][i] == '-1':
                                        poly += '-' + mon[i]
                                    else:
                                        poly += c[j][i] + mon[i]
                                    first_term = False
                            if j == 0:
                                poly += ' : '
                        poly += ']'
                        label = self.constructLabel(row)
                        result.append(
                            [label, '1',
                            d,
                            poly,
                            row['base_field_label'],
                            row['function_id']]
                            )

        except Exception:
            self.connection.rollback()
            result = []
            stats = []

        finally:
            if cur:
                cur.close()

        return result,stats

    # gets a subset of the systems identified by the labels
    # input should be json list
    def getSelectedSystems(self, labels):
        labels = (
            '(' +
            ', '.join(["'" +
            str(item) +
            "'" for item in labels]) +
            ')'
        )
        columns = '*'
        sql = (
            'SELECT '
            + columns
            + ' FROM functions_dim_1_NF WHERE label in '
            + labels
        )
        try:
            with self.connection.cursor() as cur:
                cur.execute(sql)
                result = cur.fetchall()
        except Exception:
            self.connection.rollback()
            result = None
        return result

    def getStatistics(self, whereText):
        # whereText = self.buildWhereText(filters)
        # number of maps
        cur = None
        try:
            with self.connection.cursor() as cur:
                sql = (
                    'SELECT COUNT( (original_model).height )'
                    ' FROM functions_dim_1_NF'
                    + whereText
                )
                cur.execute(sql)
                maps = cur.fetchall()
                # AUT
                sql = (
                    'SELECT AVG(automorphism_group_cardinality::int)'
                    ' FROM functions_dim_1_NF'
                    + whereText
                )
                cur.execute(sql)
                aut = cur.fetchall()
                # number of PCF
                sql = (
                    'SELECT SUM(is_PCF::int) FROM functions_dim_1_NF'
                    + whereText
                )
                cur.execute(sql)
                pcf = cur.fetchall()
                # Average Height
                sql = (
                    'SELECT AVG( (original_model).height ) ' 
                    'FROM functions_dim_1_NF' +
                    whereText
                )
                cur.execute(sql)
                height = cur.fetchall()
                resultant = 0
        except Exception:
            self.connection.rollback()
            maps = 0
            aut = 0
            pcf = 0
            height = 0
            resultant = 0
        return [maps, aut, pcf, height, resultant]

    def buildWhereText(self, filters):
        # remove empty filters
        # remove ILD because not currently in use
        for fil in filters.copy():
            if (
                not filters[fil]
                or filters[fil] == []
                or (
                    fil =='indeterminacy_locus_dimension'
                    and filters[fil] == '1'
                    )
            ) :
                del filters[fil]

        if len(filters) == 0:
            return ''

        filterText = ' WHERE '
        conditions = []

        for fil, values in filters.items():
            if fil in ['indeterminacy_locus_dimension']:
                conditions.append(
                    'CAST(' + fil + ' AS integer) IN (' + values + ')'
                    )

            elif fil in ['base_field_degree', 'automorphism_group_cardinality']:
                conditions.append(
                    'CAST(' + fil + ' AS integer) IN (' + values + ')'
                    )

            elif fil in ['base_field_label']:
                conditions.append(fil + ' LIKE "%" + values + "%"')

            else:
                conditions.append(
                    fil +
                    ' IN (' +
                    ', '.join(str(e) for e in values)
                    + ')'
                    )

        filterText += ' AND '.join(conditions)
        return filterText
