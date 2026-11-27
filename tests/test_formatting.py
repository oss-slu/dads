"""Unit tests for dads.services.formatting."""

from dads.services.formatting import format_polynomial


def test_format_polynomial_degree_two():
    coeffs = [["1", "0", "-2"], ["0", "0", "1"]]
    assert format_polynomial(2, coeffs) == "[x^2-2y^2 : y^2]"