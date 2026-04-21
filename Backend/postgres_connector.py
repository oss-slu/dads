"""
Module Docstring
manages  server data queries
"""
import psycopg2
import psycopg2.extras
from psycopg2 import sql
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
        self.connect()

    def connect(self):
        config = load_config()
        if not hasattr(self, 'connection') or self.connection is None or self.connection.closed:
            try:
                self.connection = psycopg2.connect(**config)
                print('Connected to the PostgreSQL server.')
            except (psycopg2.DatabaseError, Exception) as error:
                print(f"Database connection error: {error}")
                self.connection = None

    def is_connection_active(self):
        try:
            with self.connection.cursor() as cur:
                cur.execute('SELECT 1')
            return True
        except Exception:
            return False

    def rows_to_dicts(self, cursor, rows):
        try:
            if rows is None:
                return None
            colnames = [desc[0] for desc in cursor.description]
            if not isinstance(rows, list):
                rows = [rows]
            return [dict(zip(colnames, row)) for row in rows if row]
        except Exception as e:
            print(f"Error occurred while converting rows to dictionaries: {e}")
            return None

    def try_query(self, sql_query, params=None, fetch="all"):
        if not self.is_connection_active():
            self.connect()

        result = None
        cur = None

        try:
            with self.connection.cursor() as cur:
                cur.execute(sql_query, params)
                if fetch == "all":
                    rows = cur.fetchall()
                    result = self.rows_to_dicts(cur, rows)
                elif fetch == "one":
                    rows = cur.fetchone()
                    dicts = self.rows_to_dicts(cur, [rows])
                    result = dicts[0] if dicts else None

        except Exception as e:
            if self.connection: self.connection.rollback()
            raise e
            
        finally:
            if cur:
                cur.close()

        return result

    def get_rational_periodic_data(self, function_id):
        query = """SELECT * FROM rational_preperiodic_dim_1_nf
                WHERE function_id = %s"""
        result = self.try_query(query, (function_id,), fetch="all")
        
        return result

    def get_graph_metadata(self, graph_id):
        query = sql.SQL("""
            SELECT cardinality, periodic_cycles, preperiodic_components, max_tail
            FROM graphs_dim_1_nf
            WHERE graph_id = %s
        """)
        result = self.try_query(query, (graph_id,), fetch="one")

        if not result:
            return {}
        return result

    def get_label(self, function_id):
        query = sql.SQL("""
            SELECT sigma_one, sigma_two, ordinal
            FROM functions_dim_1_nf WHERE function_id = %s
        """)
        result = self.try_query(query, (function_id,), fetch="one")
        return self.construct_label(result) if result else None

    def get_graph_data(self, graph_id):
        # Get all graph data associated with that graph ID
        query = sql.SQL("SELECT * FROM graphs_dim_1_nf WHERE graph_id = %s")
        return self.try_query(query, (graph_id,), fetch="one")

    def construct_label(self, data):
        return (
            '1.' +
            data['sigma_one'] +
            '.' + data['sigma_two'] +
            '.' + str(data['ordinal'])
        )

    def get_all_systems(self):
        query = sql.SQL("SELECT * FROM functions_dim_1_nf")
        return self.try_query(query)

    def get_all_families(self):
        query = sql.SQL("SELECT * FROM families_dim_1_nf")
        return self.try_query(query)

    # gets a system identified by its label, input is string
    def get_system(self, function_id):
        query = sql.SQL("""
            SELECT f.base_field_label AS functions_base_field_label, *
            FROM functions_dim_1_nf f
            JOIN rational_preperiodic_dim_1_nf r ON f.function_id = r.function_id
            JOIN graphs_dim_1_nf g ON r.graph_id = g.graph_id
            LEFT JOIN LATERAL UNNEST(COALESCE(f.citations, ARRAY[NULL]::INTEGER[])) AS citation_id ON true
            LEFT JOIN citations c ON c.id = citation_id
            WHERE f.function_id = %s
        """)
        result = self.try_query(query, (function_id,), fetch="one")
        
        if result:
            result['modelLabel'] = self.construct_label(result)
            return result
        return {}

    # gets systems that match the passed in filters, input should be json object
    def get_filtered_systems(self, filters):
        where_sql, params = self.build_where_text(filters)
        stats = self.get_statistics(where_sql, params)
        
        query = sql.SQL("""
            SELECT f.function_id, f.sigma_one, f.sigma_two, f.ordinal, f.degree, 
                   (f.original_model).coeffs, f.base_field_label
            FROM functions_dim_1_nf f
            JOIN rational_preperiodic_dim_1_nf r ON f.function_id = r.function_id
            JOIN graphs_dim_1_nf g ON g.graph_id = r.graph_id
            {} 
        """).format(where_sql)
        
        rows = self.try_query(query, params, fetch='all')
        result = []

        if rows:
            mon_dict = {}
            for row in rows:
                try:
                    d = int(row[4])
                    coeffs = row[5]
                    field_label = row[6]
                    func_id = row[0]
                except (KeyError, TypeError):
                    d = int(row['degree'])
                    coeffs = row['coeffs']
                    field_label = row['base_field_label']
                    func_id = row['function_id']
                
                if d not in mon_dict:
                    mon = []
                    for i in range(d+1):
                        if i == 0: mon.append('x^'+str(d))
                        elif i == d: mon.append('y^'+str(d))
                        else:
                            term = 'x' if (d-i) == 1 else 'x^'+str(d-i)
                            term += 'y' if i == 1 else 'y^'+str(i)
                            mon.append(term)
                    mon_dict[d] = mon
                else:
                    mon = mon_dict[d]
                
                poly = '['
                for j in range(2):
                    first_term = True
                    for i in range(d+1):
                        val = str(coeffs[j][i])
                        if val != '0':
                            if val[0] != '-' and not first_term:
                                poly += '+'
                            if val == '1': poly += mon[i]
                            elif val == '-1': poly += '-' + mon[i]
                            else: poly += val + mon[i]
                            first_term = False
                    if j == 0: poly += ' : '
                poly += ']'
                
                label = self.construct_label(row)
                result.append([label, '1', d, poly, field_label, func_id])
                
        return result, stats
        
    def get_selected_systems(self, labels):
        if not labels:
            return []
        query = sql.SQL("""
            SELECT * FROM functions_dim_1_nf 
            WHERE (
                CAST(base_field_degree AS TEXT) || '.' || 
                TRIM(sigma_one) || '.' || 
                TRIM(sigma_two) || '.' || 
                CAST(ordinal AS TEXT)
            ) IN ({})
        """).format(
            sql.SQL(', ').join(sql.Placeholder() * len(labels))
        )
        return self.try_query(query, labels, fetch="all")

    def get_statistics(self, where_sql, params):
        query = sql.SQL("""
            SELECT count(*)
            FROM functions_dim_1_nf f
            JOIN rational_preperiodic_dim_1_nf r ON f.function_id = r.function_id
            JOIN graphs_dim_1_nf g ON g.graph_id = r.graph_id
            {}
        """).format(where_sql)

        result = self.try_query(query, params, fetch='one')

        if result:
            try:
                return result[0]
            except KeyError:
                return result['count']
        return 0

    def get_family(self, family_id):
        # We grab all family data
        # and the associated citation as well
        query = '''
            SELECT familiesTable.*,
            citationsTable.citation
            FROM families_dim_1_NF familiesTable
            LEFT JOIN citations citationsTable
            ON citationsTable.id
            = ANY(familiesTable.citations)
            WHERE familiesTable.family_id = %s
        '''
        result = self.try_query(query, (family_id,), fetch="one")
        
        return result
    
    # dreyes: gets families that match the passed in filters, input should be json object, similar to get_filtered_systems but for families instead of systems
    def get_filtered_families(self, filters):
        """
        Get families matching the provided filters.
        Filters can include: family_id, name, degree
        """
        where_sql, params = self.build_where_text(filters)
        query = sql.SQL("SELECT * FROM families_dim_1_nf {}").format(where_sql)
        
        result = self.try_query(query, params, fetch="all")
        return result

    # a bug exists when filtering for dimension 2 because the table being pulled from only contains systems dim 1. database should be refactored to fix bug, these systems should be contained in 1 table.
    def apply_filter_logic(self, fil, values, conditions):
        if fil in ['function_id', 'degree', 'sigma_one', 'sigma_two', 'ordinal', 'base_field_label']:
            ident = sql.SQL("f.{}").format(sql.Identifier(fil))
        else:
            ident = sql.Identifier(fil)

        if fil == 'model_label':
            sql_piece = sql.SQL("""
                CONCAT('1.', TRIM(sigma_one), '.', TRIM(sigma_two), '.', 
                TRIM(CAST(ordinal AS TEXT))) ILIKE {}
            """)
            conditions.append(sql_piece.format(sql.Placeholder()))
            return f"%{str(values).strip()}%"
        
        if fil == 'periodic_cycles':
            sql_piece = sql.SQL("""
                (SELECT MAX(val) FROM unnest(g.periodic_cycles) AS val 
                WHERE val IS NOT NULL) = {}
            """)
            conditions.append(sql_piece.format(sql.Placeholder()))
            return int(values)
        
        if isinstance(values, list):
            placeholders = sql.SQL(', ').join(sql.Placeholder() * len(values))
            sql_piece = sql.SQL("{} IN ({})")
            conditions.append(sql_piece.format(ident, placeholders))
            return values
        
        if fil in ['base_field_label', 'sigma_one', 'sigma_two', 'name', 'journal_label']:
            sql_piece = sql.SQL("{} ILIKE {}")
            conditions.append(sql_piece.format(ident, sql.Placeholder()))
            return f"%{str(values)}%"
        
        sql_piece = sql.SQL("{} = {}")
        conditions.append(sql_piece.format(ident, sql.Placeholder()))

        if fil in ['family_id', 'function_id', 'degree']:
            return int(values)
        return values
    
    def build_where_text(self, filters):
        active_filters = {}
        for key, value in filters.items():
            if value and value != [] and not (key == 'indeterminacy_locus_dimension' and value == '1'):
                active_filters[key] = value

        if not active_filters:
            return sql.SQL(""), []
        
        conditions = []
        params = []
        for fil, values in active_filters.items():
            processed_val = self.apply_filter_logic(fil, values, conditions)
            
            if isinstance(processed_val, list):
                params.extend(processed_val)
            else:
                params.append(processed_val)

        where_fragment = sql.SQL(" WHERE ") + sql.SQL(" AND ").join(conditions)
        
        return where_fragment, params
        # for fil, values in filters.items():
        #     if fil == 'family_id':
        #         # Exact match for family_id (numeric)
        #         conditions.append(f'family_id = {int(values)}')

        #     elif fil == 'name':
        #         # Text search with ILIKE for partial matching
        #         conditions.append(
        #             f"name ILIKE '%' || TRIM('{values}') || '%'"
        #         )

        #     elif fil == 'degree':
        #         # Array of degrees: degree IN (2, 3)
        #         if isinstance(values, list) and len(values) > 0:
        #             conditions.append(
        #                 'degree IN (' + ', '.join(str(e) for e in values) + ')'
        #             )
        #         else:
        #             # Single value
        #             conditions.append(f'degree = {int(values)}')

        #     elif fil == 'dimension':
        #         # families_dim_1_nf only contains dimension 1 objects
        #         dims = values if isinstance(values, list) else [values]
        #         dims = [int(d) for d in dims]
        #         if 1 not in dims:
        #             # Requested dimension is not present in this table
        #             conditions.append('1 = 0')

        #     elif fil == 'is_polynomial':
        #         # Same style as system filter: IN (...)
        #         conditions.append(
        #             'is_polynomial IN (' + ', '.join(str(v) for v in values) + ')'
        #         )

        #     elif fil == 'base_field_label':
        #         # Partial match, case-insensitive
        #         conditions.append(
        #             f"base_field_label ILIKE '%' || TRIM('{values}') || '%'"
        #         )

        # filter_text += ' AND '.join(conditions)
        # return filter_text  
