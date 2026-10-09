"""Build a SQLite database from the local Docker PostgreSQL DADS instance."""

import argparse
import hashlib
import json
import sqlite3
import sys
from datetime import datetime, timezone
from pathlib import Path

import psycopg2
from psycopg2 import sql

REPOSITORY_ROOT = Path(__file__).resolve().parents[1]
BACKEND_DIRECTORY = REPOSITORY_ROOT / "Backend"
DATABASE_CONFIG = BACKEND_DIRECTORY / "database.ini"
DUMP_SQL_PATH = REPOSITORY_ROOT / "schema" / "dads_prod_backup.sql"
DEFAULT_OUTPUT = REPOSITORY_ROOT / "data" / "exports" / "dads.sqlite"
DEFAULT_DATA_VERSION = "2026.10.1"
SCHEMA_VERSION = "1"

JSON_SEPARATORS = (",", ":")

sys.path.insert(0, str(BACKEND_DIRECTORY))
from config import load_config  # pylint: disable=wrong-import-position


def parse_arguments():
    parser = argparse.ArgumentParser(
        description="Build a SQLite export from local PostgreSQL."
    )
    parser.add_argument(
        "--out",
        type=Path,
        default=DEFAULT_OUTPUT,
        help=f"output SQLite path (default: {DEFAULT_OUTPUT})",
    )
    return parser.parse_args()


def json_text(value):
    if value is None:
        return None
    return json.dumps(value, separators=JSON_SEPARATORS)


def bool_to_sqlite(value):
    if value is None:
        return None
    return 1 if value else 0


def composite_model_is_null(coeffs, resultant, bad_primes, height, base_field_label):
    return (
        coeffs is None
        and resultant is None
        and bad_primes is None
        and height is None
        and base_field_label is None
    )


def pack_model(coeffs, resultant, bad_primes, height, base_field_label):
    if composite_model_is_null(coeffs, resultant, bad_primes, height, base_field_label):
        return None
    payload = {
        "coeffs": coeffs,
        "resultant": resultant,
        "bad_primes": bad_primes,
        "height": height,
        "base_field_label": base_field_label,
    }
    return json.dumps(payload, separators=JSON_SEPARATORS)


def sha256_file(path):
    digest = hashlib.sha256()
    with path.open("rb") as dump_file:
        for chunk in iter(lambda: dump_file.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def connect_postgres():
    config = load_config(filename=str(DATABASE_CONFIG))
    return psycopg2.connect(**config)


def create_sqlite_schema(connection):
    connection.executescript(
        """
        CREATE TABLE citations (
            label TEXT NOT NULL,
            authors TEXT,
            journal TEXT,
            year INTEGER,
            citation TEXT,
            mathscinet TEXT,
            id INTEGER PRIMARY KEY
        );

        CREATE TABLE families_dim_1_nf (
            family_id INTEGER PRIMARY KEY,
            name TEXT,
            degree INTEGER,
            num_parameters INTEGER,
            model_coeffs TEXT,
            model_resultant TEXT,
            base_field_label TEXT,
            base_field_degree INTEGER,
            sigma_one TEXT,
            sigma_two TEXT,
            ordinal INTEGER,
            citations TEXT,
            is_polynomial INTEGER,
            num_critical_points INTEGER,
            automorphism_group_cardinality INTEGER
        );

        CREATE TABLE graphs_dim_1_nf (
            graph_id INTEGER PRIMARY KEY,
            cardinality INTEGER,
            edges TEXT,
            num_components INTEGER,
            periodic_cycles TEXT,
            periodic_cardinality INTEGER,
            preperiodic_components TEXT,
            positive_in_degree INTEGER,
            max_tail INTEGER,
            type INTEGER
        );

        CREATE TABLE functions_dim_1_nf (
            function_id INTEGER PRIMARY KEY,
            degree INTEGER,
            base_field_label TEXT,
            base_field_degree INTEGER,
            sigma_one TEXT,
            sigma_two TEXT,
            ordinal INTEGER,
            citations TEXT,
            family TEXT,
            original_model TEXT,
            monic_centered TEXT,
            reduced_model TEXT,
            newton_polynomial_coeffs TEXT,
            display_model TEXT,
            is_polynomial INTEGER,
            is_chebyshev INTEGER,
            is_newton INTEGER,
            is_lattes INTEGER,
            is_pcf INTEGER,
            cp_cardinality INTEGER,
            cp_field_of_defn TEXT,
            automorphism_group_cardinality INTEGER,
            rational_twists TEXT,
            critical_portrait_graph_id TEXT
        );

        CREATE TABLE rational_preperiodic_dim_1_nf (
            id INTEGER PRIMARY KEY,
            function_id INTEGER,
            base_field_label TEXT,
            rational_periodic_points TEXT,
            graph_id INTEGER
        );

        CREATE INDEX idx_rational_preperiodic_function_id
            ON rational_preperiodic_dim_1_nf (function_id);
        CREATE INDEX idx_rational_preperiodic_graph_id
            ON rational_preperiodic_dim_1_nf (graph_id);

        CREATE TABLE metadata (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        );
        """
    )


def insert_metadata(connection, built_at, source_dump_sha256):
    rows = [
        ("schema_version", SCHEMA_VERSION),
        ("data_version", DEFAULT_DATA_VERSION),
        ("built_at", built_at),
        ("source_dump_sha256", source_dump_sha256),
    ]
    connection.executemany(
        "INSERT INTO metadata (key, value) VALUES (?, ?)",
        rows,
    )


def copy_citations(pg_conn, sqlite_conn):
    query = """
        SELECT label, authors, journal, year, citation, mathscinet, id
        FROM citations
        ORDER BY id
    """
    insert_sql = """
        INSERT INTO citations (
            label, authors, journal, year, citation, mathscinet, id
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    """
    with pg_conn.cursor() as cursor:
        cursor.execute(query)
        rows = [
            (
                label,
                json_text(authors),
                journal,
                year,
                citation,
                mathscinet,
                row_id,
            )
            for label, authors, journal, year, citation, mathscinet, row_id in cursor
        ]
    sqlite_conn.executemany(insert_sql, rows)
    return len(rows)


def copy_families(pg_conn, sqlite_conn):
    query = """
        SELECT family_id, name, degree, num_parameters, model_coeffs,
               model_resultant, base_field_label, base_field_degree,
               sigma_one, sigma_two, ordinal, citations, is_polynomial,
               num_critical_points, automorphism_group_cardinality
        FROM families_dim_1_nf
        ORDER BY family_id
    """
    insert_sql = """
        INSERT INTO families_dim_1_nf (
            family_id, name, degree, num_parameters, model_coeffs,
            model_resultant, base_field_label, base_field_degree,
            sigma_one, sigma_two, ordinal, citations, is_polynomial,
            num_critical_points, automorphism_group_cardinality
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """
    with pg_conn.cursor() as cursor:
        cursor.execute(query)
        rows = [
            (
                family_id,
                name,
                degree,
                num_parameters,
                json_text(model_coeffs),
                model_resultant,
                base_field_label,
                base_field_degree,
                sigma_one,
                sigma_two,
                ordinal,
                json_text(citations),
                bool_to_sqlite(is_polynomial),
                num_critical_points,
                automorphism_group_cardinality,
            )
            for family_id, name, degree, num_parameters, model_coeffs,
            model_resultant, base_field_label, base_field_degree,
            sigma_one, sigma_two, ordinal, citations, is_polynomial,
            num_critical_points, automorphism_group_cardinality in cursor
        ]
    sqlite_conn.executemany(insert_sql, rows)
    return len(rows)


def copy_graphs(pg_conn, sqlite_conn):
    query = """
        SELECT graph_id, cardinality, edges, num_components, periodic_cycles,
               periodic_cardinality, preperiodic_components, positive_in_degree,
               max_tail, type
        FROM graphs_dim_1_nf
        ORDER BY graph_id
    """
    insert_sql = """
        INSERT INTO graphs_dim_1_nf (
            graph_id, cardinality, edges, num_components, periodic_cycles,
            periodic_cardinality, preperiodic_components, positive_in_degree,
            max_tail, type
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """
    with pg_conn.cursor() as cursor:
        cursor.execute(query)
        rows = [
            (
                graph_id,
                cardinality,
                json_text(edges),
                num_components,
                json_text(periodic_cycles),
                periodic_cardinality,
                json_text(preperiodic_components),
                positive_in_degree,
                max_tail,
                graph_type,
            )
            for graph_id, cardinality, edges, num_components, periodic_cycles,
            periodic_cardinality, preperiodic_components, positive_in_degree,
            max_tail, graph_type in cursor
        ]
    sqlite_conn.executemany(insert_sql, rows)
    return len(rows)


def copy_rational_preperiodic(pg_conn, sqlite_conn):
    query = """
        SELECT id, function_id, base_field_label, rational_periodic_points, graph_id
        FROM rational_preperiodic_dim_1_nf
        ORDER BY id
    """
    insert_sql = """
        INSERT INTO rational_preperiodic_dim_1_nf (
            id, function_id, base_field_label, rational_periodic_points, graph_id
        ) VALUES (?, ?, ?, ?, ?)
    """
    with pg_conn.cursor() as cursor:
        cursor.execute(query)
        rows = [
            (
                row_id,
                function_id,
                base_field_label,
                json_text(rational_periodic_points),
                graph_id,
            )
            for row_id, function_id, base_field_label, rational_periodic_points, graph_id in cursor
        ]
    sqlite_conn.executemany(insert_sql, rows)
    return len(rows)


def copy_functions(pg_conn, sqlite_conn):
    query = """
        SELECT
            function_id,
            degree,
            base_field_label,
            base_field_degree,
            sigma_one,
            sigma_two,
            ordinal,
            citations,
            family,
            newton_polynomial_coeffs,
            display_model::text,
            is_polynomial,
            is_chebyshev,
            is_newton,
            is_lattes,
            is_pcf,
            cp_cardinality,
            cp_field_of_defn,
            automorphism_group_cardinality,
            rational_twists,
            critical_portrait_graph_id,
            (original_model).coeffs,
            (original_model).resultant,
            (original_model).bad_primes,
            (original_model).height,
            (original_model).base_field_label,
            (monic_centered).coeffs,
            (monic_centered).resultant,
            (monic_centered).bad_primes,
            (monic_centered).height,
            (monic_centered).base_field_label,
            (reduced_model).coeffs,
            (reduced_model).resultant,
            (reduced_model).bad_primes,
            (reduced_model).height,
            (reduced_model).base_field_label
        FROM functions_dim_1_nf
        ORDER BY function_id
    """
    insert_sql = """
        INSERT INTO functions_dim_1_nf (
            function_id, degree, base_field_label, base_field_degree,
            sigma_one, sigma_two, ordinal, citations, family,
            original_model, monic_centered, reduced_model,
            newton_polynomial_coeffs, display_model,
            is_polynomial, is_chebyshev, is_newton, is_lattes, is_pcf,
            cp_cardinality, cp_field_of_defn, automorphism_group_cardinality,
            rational_twists, critical_portrait_graph_id
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
    """
    with pg_conn.cursor() as cursor:
        cursor.execute(query)
        rows = []
        for row in cursor:
            (
                function_id,
                degree,
                base_field_label,
                base_field_degree,
                sigma_one,
                sigma_two,
                ordinal,
                citations,
                family,
                newton_polynomial_coeffs,
                display_model,
                is_polynomial,
                is_chebyshev,
                is_newton,
                is_lattes,
                is_pcf,
                cp_cardinality,
                cp_field_of_defn,
                automorphism_group_cardinality,
                rational_twists,
                critical_portrait_graph_id,
                om_coeffs,
                om_resultant,
                om_bad_primes,
                om_height,
                om_label,
                mc_coeffs,
                mc_resultant,
                mc_bad_primes,
                mc_height,
                mc_label,
                rm_coeffs,
                rm_resultant,
                rm_bad_primes,
                rm_height,
                rm_label,
            ) = row
            rows.append(
                (
                    function_id,
                    degree,
                    base_field_label,
                    base_field_degree,
                    sigma_one,
                    sigma_two,
                    ordinal,
                    json_text(citations),
                    json_text(family),
                    pack_model(om_coeffs, om_resultant, om_bad_primes, om_height, om_label),
                    pack_model(mc_coeffs, mc_resultant, mc_bad_primes, mc_height, mc_label),
                    pack_model(rm_coeffs, rm_resultant, rm_bad_primes, rm_height, rm_label),
                    json_text(newton_polynomial_coeffs),
                    display_model,
                    bool_to_sqlite(is_polynomial),
                    bool_to_sqlite(is_chebyshev),
                    bool_to_sqlite(is_newton),
                    bool_to_sqlite(is_lattes),
                    bool_to_sqlite(is_pcf),
                    cp_cardinality,
                    cp_field_of_defn,
                    automorphism_group_cardinality,
                    json_text(rational_twists),
                    critical_portrait_graph_id,
                )
            )
    sqlite_conn.executemany(insert_sql, rows)
    return len(rows)


def postgres_row_counts(pg_conn):
    tables = [
        "citations",
        "families_dim_1_nf",
        "graphs_dim_1_nf",
        "functions_dim_1_nf",
        "rational_preperiodic_dim_1_nf",
    ]
    counts = {}
    with pg_conn.cursor() as cursor:
        for table in tables:
            cursor.execute(
                sql.SQL("SELECT COUNT(*) FROM {}").format(sql.Identifier(table))
            )
            counts[table] = cursor.fetchone()[0]
    return counts


def build_sqlite(output_path):
    if not DATABASE_CONFIG.is_file():
        raise FileNotFoundError(
            f"Missing {DATABASE_CONFIG}. Copy Backend/database.ini.example "
            "to Backend/database.ini and start Docker Postgres."
        )
    if not DUMP_SQL_PATH.is_file():
        raise FileNotFoundError(f"Missing dump file at {DUMP_SQL_PATH}")

    built_at = datetime.now(timezone.utc).isoformat()
    source_dump_sha256 = sha256_file(DUMP_SQL_PATH)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    if output_path.exists():
        output_path.unlink()

    pg_conn = connect_postgres()
    sqlite_conn = sqlite3_connect(output_path)

    try:
        create_sqlite_schema(sqlite_conn)
        counts = {
            "citations": copy_citations(pg_conn, sqlite_conn),
            "families_dim_1_nf": copy_families(pg_conn, sqlite_conn),
            "graphs_dim_1_nf": copy_graphs(pg_conn, sqlite_conn),
            "functions_dim_1_nf": copy_functions(pg_conn, sqlite_conn),
            "rational_preperiodic_dim_1_nf": copy_rational_preperiodic(
                pg_conn, sqlite_conn
            ),
        }
        insert_metadata(sqlite_conn, built_at, source_dump_sha256)
        sqlite_conn.commit()

        pg_counts = postgres_row_counts(pg_conn)
        for table, row_count in counts.items():
            if row_count != pg_counts[table]:
                raise RuntimeError(
                    f"Row count mismatch for {table}: "
                    f"sqlite={row_count} postgres={pg_counts[table]}"
                )
    finally:
        pg_conn.close()
        sqlite_conn.close()

    return counts, output_path


def sqlite3_connect(output_path):
    return sqlite3.connect(output_path)


def main():
    arguments = parse_arguments()
    try:
        counts, output_path = build_sqlite(arguments.out)
    except (FileNotFoundError, OSError, psycopg2.Error, RuntimeError) as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1

    for table in sorted(counts):
        print(f"{table}: {counts[table]} rows")
    print(f"Wrote {output_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
