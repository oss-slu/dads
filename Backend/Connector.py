import psycopg2


#important do not store password when dealing with real database

def getAllSystems():
    conn = psycopg2.connect("dbname=dynamSystems user=postgres password=docker")
    cur = conn.cursor()
    columns = 'label, degree, degree, models_original_polys_val, base_field_latex'
    sql = "SELECT " + columns + " FROM public.data"
    cur.execute(sql)
    return cur.fetchall()

def getSystem(label):
    conn = psycopg2.connect("dbname=dynamSystems user=postgres password=docker")
    cur = conn.cursor()
    columns = 'label, degree, degree, models_original_polys_val, base_field_latex'
    sql = "SELECT " + columns + " FROM public.data WHERE label = '" + label + "'"
    cur.execute(sql)
    return cur.fetchall()


def getFilteredSystems(filters):
    conn = psycopg2.connect("dbname=dynamSystems user=postgres password=docker")
    cur = conn.cursor()

    columns = 'label, degree, degree, models_original_polys_val, base_field_latex'
    whereText = filterText(filters)

    sql = "SELECT " + columns + " FROM public.data" + whereText

    cur.execute(sql)
    return cur.fetchall()




def filterText(filters):

    filterText = " WHERE "

    #remove empty filters
    for filter in filters.copy():
        if filters[filter] == []:
            del filters[filter]

    if len(filters) == 0:
        return ""

    for index, filter in enumerate(filters):    
        if(len(filters[filter]) == 0):
            continue

        filterText += filter + " in " + "(" + ', '.join(str(e) for e in filters[filter]) + ")"

        if(index != len(filters)-1):
            filterText += " AND "

    return filterText
