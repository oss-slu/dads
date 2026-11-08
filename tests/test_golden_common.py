"""Unit tests for golden snapshot normalization."""

from golden_common import first_diff, normalize_body, prepare_snapshot


def test_round_floats_and_sort_search_rows():
    body = {
        "statistics": 2,
        "results": [
            ["b", "1", 2, "[]", "1.1.1.1", 10],
            ["a", "1", 2, "[]", "1.1.1.1", 3],
        ],
    }
    normalized = normalize_body(body)
    assert normalized["results"][0][-1] == 3
    assert normalized["results"][1][-1] == 10


def test_compact_large_results():
    rows = [["row", "1", 2, "[]", "1.1.1.1", i] for i in range(600)]
    snapshot = prepare_snapshot(200, {"results": rows, "statistics": 600}, compact_large=True)
    compact = snapshot["body"]["results"]
    assert compact["row_count"] == 600
    assert len(compact["preview"]) == 20
    assert len(compact["sha256"]) == 64


def test_first_diff_reports_path():
    expected = {"a": 1, "b": {"c": 3}}
    actual = {"a": 1, "b": {"c": 4}}
    assert first_diff(expected, actual) == "b.c: 3 != 4"


def test_does_not_sort_rational_periodic_points():
    body = {
        "function_id": 7,
        "rational_periodic_points": [
            ["-1", "1"],
            ["1", "0"],
            ["2", "1"],
        ],
    }
    normalized = normalize_body(body)
    assert normalized["rational_periodic_points"] == [
        ["-1", "1"],
        ["1", "0"],
        ["2", "1"],
    ]


def test_sorts_top_level_record_list_not_inner_points():
    body = [
        {
            "function_id": 7,
            "id": 7,
            "rational_periodic_points": [["2", "1"], ["1", "0"]],
        },
        {
            "function_id": 3,
            "id": 3,
            "rational_periodic_points": [["0", "0"]],
        },
    ]
    normalized = normalize_body(body)
    assert [row["id"] for row in normalized] == [3, 7]
    assert normalized[1]["rational_periodic_points"] == [["2", "1"], ["1", "0"]]
