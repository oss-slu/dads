"""Format polynomial models as display strings for search results."""

from dads.services.labels import construct_label


def format_search_result_row(row, mon_dict: dict) -> list:
    """Turn one filtered-systems SQL row into the API result list format."""
    try:
        degree = int(row[4])
        coeffs = row[5]
        field_label = row[6]
        func_id = row[0]
        label_row = row
    except (KeyError, TypeError):
        degree = int(row['degree'])
        coeffs = row['coeffs']
        field_label = row['base_field_label']
        func_id = row['function_id']
        label_row = row

    if degree not in mon_dict:
        monomials = []
        for i in range(degree + 1):
            if i == 0:
                monomials.append('x^' + str(degree))
            elif i == degree:
                monomials.append('y^' + str(degree))
            else:
                term = 'x' if (degree - i) == 1 else 'x^' + str(degree - i)
                term += 'y' if i == 1 else 'y^' + str(i)
                monomials.append(term)
        mon_dict[degree] = monomials
    else:
        monomials = mon_dict[degree]

    poly = '['
    for j in range(2):
        first_term = True
        for i in range(degree + 1):
            val = str(coeffs[j][i])
            if val != '0':
                if val[0] != '-' and not first_term:
                    poly += '+'
                if val == '1':
                    poly += monomials[i]
                elif val == '-1':
                    poly += '-' + monomials[i]
                else:
                    poly += val + monomials[i]
                first_term = False
        if j == 0:
            poly += ' : '
    poly += ']'

    label = construct_label(label_row)
    return [label, '1', degree, poly, field_label, func_id]
