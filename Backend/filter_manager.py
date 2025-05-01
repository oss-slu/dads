def build_where_text(filters):
    if not filters:
        return ''

    where_clauses = []
    for key, value in filters.items():
        if isinstance(value, list):
            formatted_values = ', '.join(f"'{v}'" for v in value)
            where_clauses.append(f"{key} IN ({formatted_values})")
        else:
            where_clauses.append(f"{key} = '{value}'")

    return ' WHERE ' + ' AND '.join(where_clauses)
