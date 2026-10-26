"""Verify SQLite export against PostgreSQL."""

import argparse
import json
import sqlite3
import sys
from pathlib import Path

import psycopg2

REPOSITORY_ROOT = Path(__file__).resolve().parents[1]
BACKEND_DIRECTORY = REPOSITORY_ROOT / "Backend"
DATABASE_CONFIG = BACKEND_DIRECTORY / "database.ini"
DEFAULT_SQLITE = REPOSITORY_ROOT / "data" / "exports" / "dads.sqlite"

SAMPLE_FUNCTION_IDS = (11, 2400, 26, 306, 302)

METADATA_KEYS = (
    "schema_version",
    "data_version",
    "built_at",
    "source_dump_sha256",
)

sys.path.insert(0, str(BACKEND_DIRECTORY))
from config import load_config  # pylint: disable=wrong-import-position

SCRIPTS_DIRECTORY = REPOSITORY_ROOT / "scripts"
sys.path.insert(0, str(SCRIPTS_DIRECTORY))
from build_sqlite import EXPORT_TABLES, model_from_parts  # pylint: disable=wrong-import-position


def parse_arguments():
    parser = argparse.ArgumentParser(
        description="Verify SQLite export against PostgreSQL."
    )
    parser.add_argument(
        "--sqlite",
        type=Path,
        default=DEFAULT_SQLITE,
        help=f"path to dads.sqlite (default: {DEFAULT_SQLITE})",
    )
    return parser.parse_args()


def pg_connect():
    config = load_config(filename=str(DATABASE_CONFIG))
    return psycopg2.connect(**config)


def fetch_pg_counts(connection):
    counts = {}
    with connection.cursor() as cursor:
        for table in EXPORT_TABLES:
            cursor.execute(f"SELECT COUNT(*) FROM {table}")
            counts[table] = cursor.fetchone()[0]
    return counts


def fetch_sqlite_counts(connection):
    counts = {}
    for table in EXPORT_TABLES:
        counts[table] = connection.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
    return counts


def fetch_metadata(connection):
    rows = connection.execute("SELECT key, value FROM metadata ORDER BY key").fetchall()
    return dict(rows)


def pg_function_row(connection, function_id):
    query = """
        SELECT
            citations,
            family,
            newton_polynomial_coeffs,
            rational_twists,
            cp_field_of_defn,
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
        WHERE function_id = %s
    """
    with connection.cursor() as cursor:
        cursor.execute(query, (function_id,))
        row = cursor.fetchone()
    if row is None:
        raise ValueError(f"function_id {function_id} not found in Postgres")
    return row


def sqlite_function_row(connection, function_id):
    row = connection.execute(
        """
        SELECT citations, family, newton_polynomial_coeffs, rational_twists,
               cp_field_of_defn, original_model, monic_centered, reduced_model
        FROM functions_dim_1_nf
        WHERE function_id = ?
        """,
        (function_id,),
    ).fetchone()
    if row is None:
        raise ValueError(f"function_id {function_id} not found in SQLite")
    return row


def loads_json_nullable(text):
    if text is None:
        return None
    return json.loads(text)


def compare_function(connection_pg, connection_sqlite, function_id):
    pg_row = pg_function_row(connection_pg, function_id)
    (
        pg_citations,
        pg_family,
        pg_newton,
        pg_twists,
        pg_cp_field,
        om_c,
        om_r,
        om_bp,
        om_h,
        om_l,
        mc_c,
        mc_r,
        mc_bp,
        mc_h,
        mc_l,
        rm_c,
        rm_r,
        rm_bp,
        rm_h,
        rm_l,
    ) = pg_row

    sq_row = sqlite_function_row(connection_sqlite, function_id)
    sq_citations, sq_family, sq_newton, sq_twists, sq_cp_field, sq_om, sq_mc, sq_rm = sq_row

    errors = []
    pairs = [
        ("citations", pg_citations, loads_json_nullable(sq_citations)),
        ("family", pg_family, loads_json_nullable(sq_family)),
        ("newton_polynomial_coeffs", pg_newton, loads_json_nullable(sq_newton)),
        ("rational_twists", pg_twists, loads_json_nullable(sq_twists)),
        ("cp_field_of_defn", pg_cp_field, sq_cp_field),
        (
            "original_model",
            model_from_parts(om_c, om_r, om_bp, om_h, om_l),
            loads_json_nullable(sq_om),
        ),
        (
            "monic_centered",
            model_from_parts(mc_c, mc_r, mc_bp, mc_h, mc_l),
            loads_json_nullable(sq_mc),
        ),
        (
            "reduced_model",
            model_from_parts(rm_c, rm_r, rm_bp, rm_h, rm_l),
            loads_json_nullable(sq_rm),
        ),
    ]
    for name, expected, actual in pairs:
        if expected != actual:
            errors.append(f"function_id {function_id} {name}: pg={expected!r} sqlite={actual!r}")
    return errors


def main():
    arguments = parse_arguments()
    if not arguments.sqlite.is_file():
        print(f"Error: SQLite file not found: {arguments.sqlite}", file=sys.stderr)
        return 1
    if not DATABASE_CONFIG.is_file():
        print(f"Error: missing {DATABASE_CONFIG}", file=sys.stderr)
        return 1

    pg_conn = pg_connect()
    sqlite_conn = sqlite3.connect(arguments.sqlite)

    failed = False
    try:
        pg_counts = fetch_pg_counts(pg_conn)
        sqlite_counts = fetch_sqlite_counts(sqlite_conn)
        print("Row counts:")
        for table in EXPORT_TABLES:
            match = pg_counts[table] == sqlite_counts[table]
            status = "ok" if match else "MISMATCH"
            print(f"  {table}: postgres={pg_counts[table]} sqlite={sqlite_counts[table]} [{status}]")
            if not match:
                failed = True

        metadata = fetch_metadata(sqlite_conn)
        print("Metadata keys:")
        for key in METADATA_KEYS:
            present = key in metadata and metadata[key]
            print(f"  {key}: {'ok' if present else 'MISSING'}")
            if not present:
                failed = True

        print(f"Sample functions {SAMPLE_FUNCTION_IDS}:")
        for function_id in SAMPLE_FUNCTION_IDS:
            errors = compare_function(pg_conn, sqlite_conn, function_id)
            if errors:
                failed = True
                for error in errors:
                    print(f"  {error}")
            else:
                print(f"  function_id {function_id}: ok")

        mc11 = sqlite_conn.execute(
            "SELECT monic_centered FROM functions_dim_1_nf WHERE function_id = 11"
        ).fetchone()[0]
        if mc11 is not None:
            print("  function_id 11 monic_centered should be SQL NULL")
            failed = True
        else:
            print("  function_id 11 monic_centered IS NULL: ok")
    finally:
        pg_conn.close()
        sqlite_conn.close()

    if failed:
        print("Verification failed.", file=sys.stderr)
        return 1
    print("Verification passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
