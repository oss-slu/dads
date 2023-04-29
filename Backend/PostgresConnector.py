import psycopg2

# important do not store password when dealing with real database
# might want to consider SQL injection down the line
# might want to use database entry ID instead of label for identifying specific systems


# gets all systems from the database
def getAllSystems():
    conn = psycopg2.connect(
        "dbname=dynamSystems user=postgres password=docker")
    cur = conn.cursor()
    columns = 'label, degree, degree, models_original_polys_val, base_field_latex'
    sql = "SELECT " + columns + " FROM public.data"
    cur.execute(sql)
    return cur.fetchall()

# gets a system identified by its label, input is string


def getSystem(label):
    conn = psycopg2.connect(
        "dbname=dynamSystems user=postgres password=docker")
    cur = conn.cursor()
    columns = '*'
    sql = "SELECT " + columns + " FROM public.data WHERE label = '" + label + "'"
    cur.execute(sql)
    return cur.fetchall()

# gets systems that match the passed in filters, input should be json object


def getFilteredSystems(filters):
    conn = psycopg2.connect(
        "dbname=dynamSystems user=postgres password=docker")
    cur = conn.cursor()
    columns = 'label, degree, degree, models_original_polys_val, base_field_latex, *'
    # TODO cant use dimension (N) from some database for some reason, used degree twice for columns, need to fix
    whereText = buildWhereText(filters)
    sql = "SELECT " + columns + " FROM public.data" + whereText
    print(sql)
    cur.execute(sql)
    return cur.fetchall()


# gets a subset of the systems identified by the labels, input should be json list
def getSelectedSystems(labels):
    conn = psycopg2.connect(
        "dbname=dynamSystems user=postgres password=docker")
    cur = conn.cursor()
    labels = "(" + ", ".join(["'" + str(item) + "'" for item in labels]) + ")"
    columns = '*'
    sql = "SELECT " + columns + " FROM public.data WHERE label in " + labels
    cur.execute(sql)
    return cur.fetchall()


# function that builds the WHERE part of SQL query to filter the results
def buildWhereText(filters):
    print(filters)
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



conn = psycopg2.connect("dbname=dynamSystems user=postgres password=docker")
cur = conn.cursor()
columns = 'label, degree, degree, models_original_polys_val, base_field_latex'
sql = "SELECT " + columns + " FROM public.data WHERE is_polynomial in (FALSE)"
cur.execute(sql)
print(cur.fetchall())