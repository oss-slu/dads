import pytest
from ..Backend.PostgresConnector import PostgresConnector

def test_build_where_text():
    connector = PostgresConnector()

    filters = {
        "dimension": [2],
        "degree": [3, 4],
        "is_polynomial": [True],
        "is_Lattes": [],
        "is_Chebyshev": [False],
        "is_Newton": [True],
        "is_pcf": [True],
        "customDegree": "",
        "customDimension": "",
        "automorphism_group_cardinality": "5",
        "base_field_label": "",
        "base_field_degree": "2",
        "indeterminacy_locus_dimension": ""
    }

    # Call the buildWhereText method
    where_clause = connector.buildWhereText(filters)

    # Define the expected WHERE clause
    expected_clause = " WHERE dimension IN (2) AND degree IN (3, 4) AND is_polynomial IN (True) AND is_Chebyshev IN (False) AND is_Newton IN (True) AND is_pcf IN (True) AND automorphism_group_cardinality = '5' AND base_field_label LIKE '%Q%' AND base_field_degree = '2'"

    # Assert that the output matches the expected string
    assert where_clause == expected_clause
