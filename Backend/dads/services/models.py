"""Shared model object shape for Postgres and SQLite connectors."""

from __future__ import annotations

from typing import Any, Optional

from psycopg2 import sql

MODEL_NAMES = ("original_model", "reduced_model", "monic_centered")
MODEL_PARTS = ("coeffs", "resultant", "bad_primes", "height", "base_field_label")


def model_from_parts(
    coeffs: Any,
    resultant: Any,
    bad_primes: Any,
    height: Any,
    base_field_label: Any,
) -> Optional[dict[str, Any]]:
    """Build a model dict, or None when every field is null."""
    if (
        coeffs is None
        and resultant is None
        and bad_primes is None
        and height is None
        and base_field_label is None
    ):
        return None
    return {
        "coeffs": coeffs,
        "resultant": resultant,
        "bad_primes": bad_primes,
        "height": height,
        "base_field_label": base_field_label,
    }


def model_field_aliases(table: sql.Composable) -> sql.Composed:
    """SQL fragment: decomposed model fields with __model__part aliases."""
    columns: list[sql.Composable] = []
    for model in MODEL_NAMES:
        for part in MODEL_PARTS:
            alias = sql.Identifier(f"__{model}__{part}")
            columns.append(
                sql.SQL("({tbl}.{mdl}).{prt} AS {alias}").format(
                    tbl=table,
                    mdl=sql.Identifier(model),
                    prt=sql.Identifier(part),
                    alias=alias,
                )
            )
    return sql.SQL(", ").join(columns)


def hydrate_models_in_row(row: dict[str, Any]) -> dict[str, Any]:
    """Replace string composite model columns with objects."""
    if not row:
        return row
    for model in MODEL_NAMES:
        row.pop(model, None)
        parts = {part: row.pop(f"__{model}__{part}", None) for part in MODEL_PARTS}
        row[model] = model_from_parts(**parts)
    return row


def hydrate_models_in_rows(rows: list[dict[str, Any]] | None) -> list[dict[str, Any]] | None:
    if not rows:
        return rows
    return [hydrate_models_in_row(dict(row)) for row in rows]