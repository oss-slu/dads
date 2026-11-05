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
