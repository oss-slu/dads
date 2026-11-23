"""SQLite connector: read-only queries against a built dads.sqlite export."""

from __future__ import annotations

import json
import sqlite3
from pathlib import Path
from typing import Any, Optional

from psycopg2 import sql

from dads.connectors.base import DadsConnector
from dads.services.formatting import format_search_result_row
from dads.services.labels import construct_label
from dads.services.models import MODEL_NAMES

EXPECTED_SCHEMA_VERSION = "2"

FUNCTION_PREFIX_COLUMNS = frozenset(
    {
        "function_id",
        "degree",
        "sigma_one",
        "sigma_two",
        "ordinal",
        "base_field_label",
    }
)

FUNCTION_JSON_ARRAY_COLUMNS = frozenset(
    {
        "family",
        "newton_polynomial_coeffs",
        "rational_twists",
    }
)

FUNCTION_BOOL_COLUMNS = frozenset(
    {
        "is_polynomial",
        "is_chebyshev",
        "is_newton",
        "is_lattes",
        "is_pcf",
    }
)

FILTER_BOOL_COLUMNS = FUNCTION_BOOL_COLUMNS | {"is_Lattes", "is_Chebyshev", "is_Newton", "is_pcf"}

GRAPH_JSON_ARRAY_COLUMNS = frozenset(
    {
        "edges",
        "periodic_cycles",
        "preperiodic_components",
    }
)

FAMILY_JSON_COLUMNS = frozenset(
    {
        "model_coeffs",
        "citations",
    }
)


def _loads_nullable(text: Any) -> Any:
    if text is None:
        return None
    if isinstance(text, (list, dict, bool, int, float)):
        return text
    return json.loads(text)


def _bool_from_sqlite(value: Any) -> Any:
    if value is None:
        return None
    return bool(value)


class SqliteConnector(DadsConnector):
    """Read-only SQLite backend using the export from build_sqlite.py."""

    def __init__(self, path: str | Path) -> None:
        self._path = str(path)
        self.connection: Optional[sqlite3.Connection] = None
        self.connect()

    def connect(self) -> None:
        """Open the database read-only and verify schema_version."""
        resolved = Path(self._path).resolve()
        if not resolved.is_file():
            raise FileNotFoundError(
                f"DADS SQLite database not found: {resolved}"
            )
        if self.connection is not None:
            try:
                self.connection.close()
            except sqlite3.Error:
                pass
        self.connection = sqlite3.connect(
            f"file:{resolved}?mode=ro", uri=True, check_same_thread=False
        )
        self.connection.row_factory = sqlite3.Row
        version = self.connection.execute(
            "SELECT value FROM metadata WHERE key = 'schema_version'"
        ).fetchone()
        if version is None:
            raise ValueError(
                f"Invalid DADS SQLite file (missing metadata): {resolved}"
            )
        if version[0] != EXPECTED_SCHEMA_VERSION:
            raise ValueError(
                f"Unsupported schema_version {version[0]!r} in {resolved} "
                f"(expected {EXPECTED_SCHEMA_VERSION!r})"
            )
        print(f"Connected to DADS SQLite: {resolved}")

    def is_connection_active(self) -> bool:
        try:
            if self.connection is None:
                return False
            self.connection.execute("SELECT 1")
            return True
        except sqlite3.Error:
            return False

    def _row_to_dict(
        self, cursor: sqlite3.Cursor, row: Optional[sqlite3.Row]
    ) -> Optional[dict[str, Any]]:
        if row is None:
            return None
        data: dict[str, Any] = {}
        for index, desc in enumerate(cursor.description or ()):
            data[desc[0]] = row[index]
        return data

    def _rows_to_dicts(
        self, cursor: sqlite3.Cursor, rows: list[sqlite3.Row]
    ) -> list[dict[str, Any]]:
        return [self._row_to_dict(cursor, row) for row in rows if row is not None]

    def _decode_citations_array(self, value: Any) -> Any:
        parsed = _loads_nullable(value)
        if parsed is None:
            return None
        return parsed

    def _decode_function_fields(self, row: dict[str, Any]) -> dict[str, Any]:
        for column in FUNCTION_JSON_ARRAY_COLUMNS:
            if column in row:
                row[column] = _loads_nullable(row[column])
        for column in FUNCTION_BOOL_COLUMNS:
            if column in row:
                row[column] = _bool_from_sqlite(row[column])
        for model in MODEL_NAMES:
            if model in row:
                row[model] = _loads_nullable(row[model])
        if "citations" in row:
            row["citations"] = self._decode_citations_array(row.get("citations"))
        return row

    def _decode_graph_fields(self, row: dict[str, Any]) -> dict[str, Any]:
        for column in GRAPH_JSON_ARRAY_COLUMNS:
            if column in row:
                row[column] = _loads_nullable(row[column])
        return row

    def _decode_citation_fields(self, row: dict[str, Any]) -> dict[str, Any]:
        authors = row.get("authors")
        if isinstance(authors, str) and authors.startswith("["):
            row["authors"] = _loads_nullable(authors)
        return row

    def _decode_family_fields(self, row: dict[str, Any]) -> dict[str, Any]:
        for column in FAMILY_JSON_COLUMNS:
            if column in row:
                row[column] = _loads_nullable(row[column])
        if "is_polynomial" in row:
            row["is_polynomial"] = _bool_from_sqlite(row["is_polynomial"])
        return row

    def try_query(
        self,
        query: str,
        params: Optional[list[Any] | tuple[Any, ...]] = None,
        fetch: str = "all",
    ) -> Any:
        if not self.is_connection_active():
            self.connect()
        if params is None:
            params = []
        cursor = self.connection.execute(query, params)
        if fetch == "all":
            return self._rows_to_dicts(cursor, cursor.fetchall())
        if fetch == "one":
            return self._row_to_dict(cursor, cursor.fetchone())
        raise ValueError(f"Unknown fetch mode: {fetch}")

    def construct_label(self, data: dict[str, Any]) -> str:
        return construct_label(data)

    def get_rational_periodic_data(self, function_id: Any) -> list[dict[str, Any]]:
        query = """
            SELECT * FROM rational_preperiodic_dim_1_nf
            WHERE function_id = ?
        """
        rows = self.try_query(query, (function_id,), fetch="all") or []
        for row in rows:
            if "rational_periodic_points" in row:
                row["rational_periodic_points"] = _loads_nullable(
                    row["rational_periodic_points"]
                )
        return rows

    def get_graph_metadata(self, graph_id: Any) -> dict[str, Any]:
        query = """
            SELECT cardinality, periodic_cycles, preperiodic_components, max_tail
            FROM graphs_dim_1_nf
            WHERE graph_id = ?
        """
        result = self.try_query(query, (graph_id,), fetch="one")
        if not result:
            return {}
        result = self._decode_graph_fields(result)
        return result

    def get_label(self, function_id: Any) -> Optional[str]:
        query = """
            SELECT sigma_one, sigma_two, ordinal
            FROM functions_dim_1_nf WHERE function_id = ?
        """
        result = self.try_query(query, (function_id,), fetch="one")
        return self.construct_label(result) if result else None

    def get_graph_data(self, graph_id: Any) -> Optional[dict[str, Any]]:
        query = "SELECT * FROM graphs_dim_1_nf WHERE graph_id = ?"
        result = self.try_query(query, (graph_id,), fetch="one")
        return self._decode_graph_fields(result) if result else None

    def get_all_systems(self) -> list[dict[str, Any]]:
        rows = self.try_query("SELECT * FROM functions_dim_1_nf", fetch="all") or []
        return [self._decode_function_fields(row) for row in rows]

    def get_all_families(self) -> list[dict[str, Any]]:
        rows = self.try_query("SELECT * FROM families_dim_1_nf", fetch="all") or []
        return [self._decode_family_fields(row) for row in rows]

    def get_system(self, function_id: Any) -> dict[str, Any]:
        query = """
            SELECT f.base_field_label AS functions_base_field_label,
                f.function_id, f.degree, f.base_field_label, f.base_field_degree,
                f.sigma_one, f.sigma_two, f.ordinal, f.citations, f.family,
                f.original_model, f.monic_centered, f.reduced_model,
                f.newton_polynomial_coeffs, f.display_model,
                f.is_polynomial, f.is_chebyshev, f.is_newton, f.is_lattes, f.is_pcf,
                f.cp_cardinality, f.cp_field_of_defn, f.automorphism_group_cardinality,
                f.rational_twists, f.critical_portrait_graph_id,
                r.id, r.function_id, r.base_field_label, r.rational_periodic_points,
                r.graph_id,
                g.graph_id, g.cardinality, g.edges, g.num_components, g.periodic_cycles,
                g.periodic_cardinality, g.preperiodic_components, g.positive_in_degree,
                g.max_tail, g.type,
                je.value AS citation_id,
                c.label, c.authors, c.journal, c.year, c.citation, c.mathscinet, c.id
            FROM functions_dim_1_nf f
            JOIN rational_preperiodic_dim_1_nf r ON f.function_id = r.function_id
            JOIN graphs_dim_1_nf g ON r.graph_id = g.graph_id
            LEFT JOIN json_each(
                CASE
                    WHEN f.citations IS NULL OR f.citations = 'null' THEN '[null]'
                    WHEN f.citations = '[]' THEN '[null]'
                    ELSE f.citations
                END
            ) AS je ON 1 = 1
            LEFT JOIN citations c ON c.id = je.value
            WHERE f.function_id = ?
            LIMIT 1
        """
        result = self.try_query(query, (function_id,), fetch="one")
        if not result:
            return {}
        result = self._decode_function_fields(result)
        result = self._decode_graph_fields(result)
        result = self._decode_citation_fields(result)
        if "critical_portrait_graph_id" in result:
            value = result["critical_portrait_graph_id"]
            if value is not None:
                result["critical_portrait_graph_id"] = str(value)
        if "rational_periodic_points" in result:
            result["rational_periodic_points"] = _loads_nullable(
                result["rational_periodic_points"]
            )
        result["modelLabel"] = self.construct_label(result)
        return result

    def get_filtered_systems(
        self, filters: dict[str, Any]
    ) -> tuple[list[list[Any]], Any]:
        where_sql, params = self.build_where_text(filters)
        stats = self.get_statistics(where_sql, params)
        fragment = self._where_fragment(where_sql)
        query = f"""
            SELECT f.function_id, f.sigma_one, f.sigma_two, f.ordinal, f.degree,
                   json_extract(f.original_model, '$.coeffs') AS coeffs,
                   f.base_field_label
            FROM functions_dim_1_nf f
            JOIN rational_preperiodic_dim_1_nf r ON f.function_id = r.function_id
            JOIN graphs_dim_1_nf g ON g.graph_id = r.graph_id
            {fragment}
        """
        rows = self.try_query(query, params, fetch="all") or []
        result: list[list[Any]] = []
        if rows:
            mon_dict: dict[int, list[str]] = {}
            for row in rows:
                if row.get("coeffs") is not None:
                    row["coeffs"] = json.loads(row["coeffs"])
                result.append(format_search_result_row(row, mon_dict))
        return result, stats

    def get_selected_systems(self, labels: list[str]) -> list[dict[str, Any]]:
        if not labels:
            return []
        placeholders = ", ".join("?" * len(labels))
        query = f"""
            SELECT * FROM functions_dim_1_nf
            WHERE (
                CAST(base_field_degree AS TEXT) || '.' ||
                TRIM(sigma_one) || '.' ||
                TRIM(sigma_two) || '.' ||
                CAST(ordinal AS TEXT)
            ) IN ({placeholders})
        """
        rows = self.try_query(query, labels, fetch="all") or []
        return [self._decode_function_fields(row) for row in rows]

    def _where_fragment(self, where_sql: Any) -> str:
        if where_sql is None or where_sql == "" or where_sql == sql.SQL(""):
            return ""
        if isinstance(where_sql, sql.Composed):
            return where_sql.as_string(self.connection)  # type: ignore[arg-type]
        return str(where_sql)

    def get_statistics(self, where_sql: Any, params: list[Any]) -> Any:
        fragment = self._where_fragment(where_sql)
        query = f"""
            SELECT count(*) AS count
            FROM functions_dim_1_nf f
            JOIN rational_preperiodic_dim_1_nf r ON f.function_id = r.function_id
            JOIN graphs_dim_1_nf g ON g.graph_id = r.graph_id
            {fragment}
        """
        result = self.try_query(query, params, fetch="one")
        if result:
            return result.get("count", next(iter(result.values()), 0))
        return 0

    def get_family(self, family_id: Any) -> Optional[dict[str, Any]]:
        query = """
            SELECT familiesTable.*,
                citationsTable.citation
            FROM families_dim_1_nf familiesTable
            LEFT JOIN citations citationsTable
                ON citationsTable.id IN (
                    SELECT value FROM json_each(
                        CASE
                            WHEN familiesTable.citations IS NULL
                                 OR familiesTable.citations = 'null'
                            THEN '[null]'
                            WHEN familiesTable.citations = '[]'
                            THEN '[null]'
                            ELSE familiesTable.citations
                        END
                    )
                )
            WHERE familiesTable.family_id = ?
            LIMIT 1
        """
        result = self.try_query(query, (family_id,), fetch="one")
        return self._decode_family_fields(result) if result else result

    def get_filtered_families(self, filters: dict[str, Any]) -> list[dict[str, Any]]:
        where_sql, params = self.build_where_text(filters)
        query = f"SELECT * FROM families_dim_1_nf {self._where_fragment(where_sql)}"
        rows = self.try_query(query, params, fetch="all") or []
        return [self._decode_family_fields(row) for row in rows]

    def _qualified_column(self, fil: str) -> str:
        column = fil
        if fil == "is_Lattes":
            column = "is_lattes"
        elif fil == "is_Chebyshev":
            column = "is_chebyshev"
        elif fil == "is_Newton":
            column = "is_newton"
        if column in FUNCTION_PREFIX_COLUMNS:
            return f"f.{column}"
        return column

    def _sql_bool(self, value: Any) -> int:
        return 1 if value else 0

    def apply_filter_logic(
        self, fil: str, values: Any, conditions: list[str]
    ) -> Any:
        ident = self._qualified_column(fil)

        if fil == "model_label":
            conditions.append(
                "(f.base_field_degree || '.' || TRIM(f.sigma_one) || '.' || "
                "TRIM(f.sigma_two) || '.' || TRIM(CAST(f.ordinal AS TEXT))) "
                "LIKE ?"
            )
            return f"%{str(values).strip()}%"

        if fil == "periodic_cycles":
            conditions.append(
                "(SELECT MAX(CAST(val.value AS INTEGER)) FROM json_each(g.periodic_cycles) "
                "AS val WHERE val.value IS NOT NULL) = ?"
            )
            return int(values)

        if fil == "family":
            family_ids = values if isinstance(values, list) else [values]
            placeholders = ", ".join("?" * len(family_ids))
            conditions.append(
                f"EXISTS (SELECT 1 FROM json_each(f.family) AS fam "
                f"WHERE CAST(fam.value AS INTEGER) IN ({placeholders}))"
            )
            return family_ids

        if isinstance(values, list):
            placeholders = ", ".join("?" * len(values))
            conditions.append(f"{ident} IN ({placeholders})")
            if fil in FILTER_BOOL_COLUMNS:
                return [self._sql_bool(v) for v in values]
            return values

        if fil in [
            "base_field_label",
            "sigma_one",
            "sigma_two",
            "name",
            "journal_label",
        ]:
            conditions.append(f"{ident} LIKE ?")
            return f"%{str(values)}%"

        conditions.append(f"{ident} = ?")
        if fil in ["family_id", "function_id", "degree"]:
            return int(values)
        if fil in FILTER_BOOL_COLUMNS:
            return self._sql_bool(values)
        return values

    def build_where_text(
        self, filters: dict[str, Any]
    ) -> tuple[Any, list[Any]]:
        active_filters: dict[str, Any] = {}
        for key, value in filters.items():
            if value and value != [] and not (
                key == "indeterminacy_locus_dimension" and value == "1"
            ):
                active_filters[key] = value

        if not active_filters:
            return sql.SQL(""), []

        conditions: list[str] = []
        params: list[Any] = []
        for fil, values in active_filters.items():
            processed_val = self.apply_filter_logic(fil, values, conditions)
            if fil == "family":
                params.extend(processed_val)
            elif isinstance(processed_val, list):
                params.extend(processed_val)
            else:
                params.append(processed_val)

        where_fragment = " WHERE " + " AND ".join(conditions)
        return where_fragment, params