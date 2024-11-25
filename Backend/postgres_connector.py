"""
Module Docstring
manages  server data queries
"""
import psycopg2
import psycopg2.extras
from config import load_config

# important do not store password when dealing with real database
# might want to consider SQL injection down the line
# gets all systems from the database

class PostgresConnector:
    """
    Class Docstring
    Manages connection to a PostgreSQL database and executes queries.

    Attributes:
        connection: A psycopg2 connection object to interact with the database.
    """
    def __init__(self):
        config = load_config()
        try:
            # connecting to the PostgreSQL server
            self.connection = psycopg2.connect(**config)
            print('Connected to the PostgreSQL server.')

        except (psycopg2.DatabaseError, Exception) as error:
            print(error)

    def construct_label(self, data):
        return (
            '1.' +
            data['sigma_one'] +
            '.' + data['sigma_two'] +
            '.' + str(data['ordinal'])
        )

    def get_all_systems(self):
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

    def get_all_families(self):
        columns = '*'
        sql = 'SELECT ' + columns + ' FROM families_dim_1_NF'
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
    def get_system(self, ip):
        cur = None
        try:
            sql = """
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
                    model_label = self.construct_label(temp)
                    result = {'modelLabel': model_label, **temp}
                else:
                    result = {}

        except Exception:
            self.connection.rollback()
            result = {}

        finally:
            if cur:
                cur.close()
        return result

    # gets systems that match the passed in filters, input should be json object
    def get_filtered_systems(self, filters):
        # return a list of strings of the form:
        #    label, dimension, degree, polynomials, field_label

        columns = (
            'functions_dim_1_nf.function_id, sigma_one, sigma_two, ordinal,'
            ' degree, (original_model).coeffs, '
            'functions_dim_1_nf.base_field_label'
        )
        dims = filters['N']
        del filters['N']
        where_text = self.build_where_text(filters)
        print(where_text)
        cur = None
        try:
            stats= self.get_statistics(where_text)
            result = []
            if dims == [] or 1 in dims:
                sql = (f"""
                    SELECT {columns}
                    FROM functions_dim_1_nf
                    JOIN rational_preperiodic_dim_1_nf
                    ON functions_dim_1_nf.function_id = rational_preperiodic_dim_1_nf.function_id
                    AND functions_dim_1_nf.base_field_label = rational_preperiodic_dim_1_nf.base_field_label
                    JOIN graphs_dim_1_nf
                    ON graphs_dim_1_nf.graph_id = rational_preperiodic_dim_1_nf.graph_id
                    {where_text}    
                    """
                )
                with self.connection.cursor(
                    cursor_factory=psycopg2.extras.DictCursor
                    ) as cur:
                    cur.execute(sql)
                    # TODO: limit the total number that can be returned
                    mon_dict = {}
                    for row in cur:
                        d = int(row['degree'])
                        if d in mon_dict:
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
                        poly = '['
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
                        label = self.construct_label(row)
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
    def get_selected_systems(self, labels):
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
            + ' FROM functions_dim_1_NF WHERE'
            + ' base_field_degree || \'.\''
            + ' || sigma_one || \'.\''
            + ' || sigma_two || \'.\''
            + ' || ordinal in '
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

    def get_statistics(self, where_text):
        # whereText = self.buildWhereText(filters)
        # number of maps
        cur = None
        try:
            with self.connection.cursor() as cur:
                sql = (
                    'SELECT COUNT( (original_model).height )'
                    ' FROM functions_dim_1_NF'
                    ' JOIN rational_preperiodic_dim_1_nf'
                    ' ON functions_dim_1_nf.function_id ='
                    ' rational_preperiodic_dim_1_nf.function_id'
                    ' JOIN graphs_dim_1_nf'
                    ' ON graphs_dim_1_nf.graph_id ='
                    ' rational_preperiodic_dim_1_nf.graph_id'
                    + where_text
                )
                cur.execute(sql)
                maps = cur.fetchall()
                # AUT
                sql = (
                    'SELECT AVG(automorphism_group_cardinality::int)'
                    ' FROM functions_dim_1_NF'
                    ' JOIN rational_preperiodic_dim_1_nf'
                    ' ON functions_dim_1_nf.function_id ='
                    ' rational_preperiodic_dim_1_nf.function_id'
                    ' JOIN graphs_dim_1_nf'
                    ' ON graphs_dim_1_nf.graph_id ='
                    ' rational_preperiodic_dim_1_nf.graph_id'
                    + where_text
                )
                cur.execute(sql)
                aut = cur.fetchall()
                # number of PCF
                sql = (
                    'SELECT SUM(is_PCF::int) FROM functions_dim_1_NF'
                    ' JOIN rational_preperiodic_dim_1_nf'
                    ' ON functions_dim_1_nf.function_id ='
                    ' rational_preperiodic_dim_1_nf.function_id'
                    ' JOIN graphs_dim_1_nf'
                    ' ON graphs_dim_1_nf.graph_id ='
                    ' rational_preperiodic_dim_1_nf.graph_id'
                    + where_text
                )
                cur.execute(sql)
                pcf = cur.fetchall()
                # Average Height
                sql = (
                    'SELECT AVG( (original_model).height ) '
                    'FROM functions_dim_1_NF'
                    ' JOIN rational_preperiodic_dim_1_nf'
                    ' ON functions_dim_1_nf.function_id ='
                    ' rational_preperiodic_dim_1_nf.function_id'
                    ' JOIN graphs_dim_1_nf'
                    ' ON graphs_dim_1_nf.graph_id ='
                    ' rational_preperiodic_dim_1_nf.graph_id' +
                    where_text
                )
                cur.execute(sql)
                height = cur.fetchall()
                resultant = 0

                sql = (
                    'SELECT '
                    'AVG(positive_in_degree) AS avg_positive_in_degree, '
                    'MAX(positive_in_degree) AS max_positive_in_degree '
                    'FROM graphs_dim_1_nf '
                    'JOIN functions_dim_1_nf '
                    'ON graphs_dim_1_nf.graph_id = '
                    'CAST(functions_dim_1_nf.critical_portrait_graph_id ' 
                    'AS integer)'
                    + where_text
                )
                cur.execute(sql)
                positive_in_degree_stats = cur.fetchone()
                avg_pc_set = positive_in_degree_stats[0]
                largeset_pc_set = positive_in_degree_stats[1]

                sql = (
                    'SELECT periodic_cardinality'
                    ' FROM graphs_dim_1_nf'
                    ' JOIN rational_preperiodic_dim_1_nf'
                    ' ON graphs_dim_1_nf.graph_id ='
                    ' rational_preperiodic_dim_1_nf.graph_id'
                    ' JOIN functions_dim_1_nf'
                    ' ON functions_dim_1_nf.function_id = '
                    'rational_preperiodic_dim_1_nf.function_id'
                    + where_text
                )
                cur.execute(sql)
                periodic_cardinalities = [row[0] for row in cur.fetchall()]
                avg_num_periodic = sum(periodic_cardinalities) / len(
                    periodic_cardinalities)
                most_periodic = max(periodic_cardinalities)
                sql = (
                    'SELECT periodic_cycles'
                    ' FROM graphs_dim_1_nf'
                    ' JOIN rational_preperiodic_dim_1_nf'
                    ' ON graphs_dim_1_nf.graph_id = '
                    ' rational_preperiodic_dim_1_nf.graph_id'
                    ' JOIN functions_dim_1_nf'
                    ' ON functions_dim_1_nf.function_id = '
                    'rational_preperiodic_dim_1_nf.function_id'
                    + where_text
                )
                cur.execute(sql)
                periodic_cycles = [row[0] for row in cur.fetchall()]
                longest_cycles = [max(val) for val in periodic_cycles if val]
                if len(longest_cycles) > 0:
                    largest_cycle = max(longest_cycles)
                else:
                    largest_cycle = 0

                print (largest_cycle)
                sql = (
                    'SELECT preperiodic_components'
                    ' FROM graphs_dim_1_nf'
                    ' JOIN rational_preperiodic_dim_1_nf'
                    ' ON graphs_dim_1_nf.graph_id = '
                    'rational_preperiodic_dim_1_nf.graph_id'
                    ' JOIN functions_dim_1_nf'
                    ' ON functions_dim_1_nf.function_id = '
                    'rational_preperiodic_dim_1_nf.function_id'
                    + where_text
                )
                cur.execute(sql)
                preperiodic_components = [row[0] for row in cur.fetchall()]
                sql = (
                    'SELECT graphs_dim_1_nf.cardinality'
                    ' FROM graphs_dim_1_nf'
                    ' JOIN rational_preperiodic_dim_1_nf'
                    ' ON graphs_dim_1_nf.graph_id = '
                    'rational_preperiodic_dim_1_nf.graph_id'
                    ' JOIN functions_dim_1_nf'
                    ' ON functions_dim_1_nf.function_id = '
                    'rational_preperiodic_dim_1_nf.function_id'
                    + where_text
                )
                cur.execute(sql)
                cardinalities = [row[0] for row  in cur.fetchall()]
                avg_num_preperiodic = sum(
                    cardinalities
                    ) / len(preperiodic_components)
                most_preperiodic = max(cardinalities)
                component_sizes = [
                    max(comp) for comp in preperiodic_components if comp
                ]
                if len(component_sizes) > 0:
                    largest_comp = max(component_sizes)
                else:
                    largest_comp = 0


        except Exception:
            self.connection.rollback()
            maps = 0
            aut = 0
            pcf = 0
            height = 0
            resultant = 0
            avg_pc_set = 0
            avg_num_periodic = most_periodic = largest_cycle = 0
            avg_num_preperiodic = most_preperiodic = largest_comp = 0
        return [maps, aut, pcf, height, resultant,
                avg_pc_set, largeset_pc_set,
                avg_num_periodic, most_periodic,
                largest_cycle, avg_num_preperiodic,
                most_preperiodic, largest_comp]

    def build_where_text(self, filters):
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

        filter_text = ' WHERE '
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
                conditions.append(
                    f'functions_dim_1_nf.{fil} LIKE \'%{values}%\'')

            elif fil in ['family']:
                print(values)
                query = f"""
                family = ARRAY{psycopg2.extensions.AsIs(values)}
                """
                conditions.append(query)

            elif fil in ['preperiodic_cardinality']:
                conditions.append(f'cardinality = {values}')

            elif fil in ['num_components'] or fil in ['max_tail']:
                conditions.append(f'{fil} = {values}')

            elif fil in ['periodic_cardinality']:
                conditions.append(f'{fil}={int(values)}')

            elif fil == 'periodic_cycles':
                print(
                    f'Filter value for periodic_cycles: {int(values)}'
                )
                conditions.append(
                    '(SELECT MAX(val) '
                    'FROM unnest(graphs_dim_1_nf.periodic_cycles) AS val '
                    'WHERE val IS NOT NULL)='
                    f'{int(values)}'
                )
            elif fil in ['cp_cardinality']:
                conditions.append(f'{fil}={int(values)}')

            elif fil in ['positive_in_degree']:
                conditions.append(f'{fil}={int(values)}')

            else:
                conditions.append(
                    fil +
                    ' IN (' +
                    ', '.join(str(e) for e in values)
                    + ')'
                    )

        filter_text += ' AND '.join(conditions)
        return filter_text

    def get_family(self, family_id):
        columns = '*'
        sql = f'SELECT {columns} FROM families_dim_1_NF WHERE family_id = %s'
        try:
            with self.connection.cursor() as cur:
                cur.execute(sql, (family_id,))
                result = cur.fetchone()
        except Exception as e:
            self.connection.rollback()
            print(f'An error occurred: {e}')
            result = None
        finally:
            if cur:
                cur.close()
        return result
