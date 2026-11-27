"""Tests for dads.services.models."""

from dads.services.models import hydrate_models_in_row, model_from_parts


def test_model_from_parts_all_null():
    assert model_from_parts(None, None, None, None, None) is None


def test_model_from_parts_full():
    model = model_from_parts(
        [[["4", "4", "4"]]],
        "496",
        [2, 31],
        1.3862944,
        "1.1.1.1",
    )
    assert model is not None
    assert model["resultant"] == "496"
    assert model["bad_primes"] == [2, 31]


def test_hydrate_monic_centered_null():
    row = {
        "function_id": 11,
        "original_model": "legacy-string",
        "__original_model__coeffs": [[["4", "4", "4"]]],
        "__original_model__resultant": "496",
        "__original_model__bad_primes": [2, 31],
        "__original_model__height": 1.3862944,
        "__original_model__base_field_label": "1.1.1.1",
        "__monic_centered__coeffs": None,
        "__monic_centered__resultant": None,
        "__monic_centered__bad_primes": None,
        "__monic_centered__height": None,
        "__monic_centered__base_field_label": None,
        "__reduced_model__coeffs": [[["4", "4", "4"]]],
        "__reduced_model__resultant": "496",
        "__reduced_model__bad_primes": [2, 31],
        "__reduced_model__height": 1.3862944,
        "__reduced_model__base_field_label": "1.1.1.1",
    }
    hydrate_models_in_row(row)
    assert row["monic_centered"] is None
    assert row["original_model"]["resultant"] == "496"
    assert "legacy-string" not in row.get("original_model", "")