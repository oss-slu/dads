"""Format polynomial models as display strings for search results."""

from __future__ import annotations

from typing import Any

from dads.services.labels import construct_label


def _monomials_for_degree(degree: int) -> list[str]:
    monomials: list[str] = []
    for i in range(degree + 1):
        if i == 0:
            monomials.append('x^' + str(degree))
        elif i == degree:
            monomials.append('y^' + str(degree))
        else:
            term = 'x' if (degree - i) == 1 else 'x^' + str(degree - i)
            term += 'y' if i == 1 else 'y^' + str(i)
            monomials.append(term)
    return monomials


def format_polynomial(degree: int, coeffs: Any) -> str:
    """Render a bivariate model as the bracketed string used in search results."""
    monomials = _monomials_for_degree(degree)
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
    return poly


def assemble_filtered_system_result(
    *,
    function_id: Any,
    sigma_one: Any,
    sigma_two: Any,
    ordinal: Any,
    degree: Any,
    coeffs: Any,
    base_field_label: Any,
) -> list[Any]:
    """Build one `/get_filtered_systems` results entry from explicit fields."""
    label = construct_label(
        {'sigma_one': sigma_one, 'sigma_two': sigma_two, 'ordinal': ordinal}
    )
    degree_int = int(degree)
    poly = format_polynomial(degree_int, coeffs)
    return [label, '1', degree_int, poly, base_field_label, function_id]