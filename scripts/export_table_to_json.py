"""Export an approved PostgreSQL table to a JSON file."""

import argparse
import json
import sys
from pathlib import Path

import psycopg2
from psycopg2 import sql


REPOSITORY_ROOT = Path(__file__).resolve().parents[1]
BACKEND_DIRECTORY = REPOSITORY_ROOT / "Backend"
DATABASE_CONFIG = BACKEND_DIRECTORY / "database.ini"

# Import the existing configuration loader without duplicating its behavior.
sys.path.insert(0, str(BACKEND_DIRECTORY))
from config import load_config  # pylint: disable=wrong-import-position


ALLOWED_TABLES = {
    "graphs_dim_1_nf": "graph_id",
    "functions_dim_1_nf": "function_id",
    "families_dim_1_nf": "family_id",
    "rational_preperiodic_dim_1_nf": "id",
    "citations": "id",
}


def positive_integer(value):
    """Return a positive integer for argparse."""
    parsed_value = int(value)
    if parsed_value < 1:
        raise argparse.ArgumentTypeError("--limit must be a positive integer")
    return parsed_value


def parse_arguments():
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(
        description="Export an approved PostgreSQL table to JSON."
    )
    parser.add_argument("table", help="name of the table to export")
    parser.add_argument(
        "--limit",
        type=positive_integer,
        help="maximum number of rows to export",
    )
    parser.add_argument(
        "--out",
        type=Path,
        help="output path (default: <table>.json in the current directory)",
    )
    return parser.parse_args()


def rows_to_dicts(cursor, rows):
    """Convert query tuples to dictionaries using cursor column names."""
    column_names = [description[0] for description in cursor.description]
    return [dict(zip(column_names, row)) for row in rows]


def fetch_rows(table, limit=None):
    """Fetch rows from an allowed table in deterministic primary-key order."""
    config = load_config(filename=str(DATABASE_CONFIG))
    connection = psycopg2.connect(**config)

    try:
        query = sql.SQL("SELECT * FROM {} ORDER BY {}").format(
            sql.Identifier(table),
            sql.Identifier(ALLOWED_TABLES[table]),
        )
        parameters = None
        if limit is not None:
            query += sql.SQL(" LIMIT %s")
            parameters = (limit,)

        with connection.cursor() as cursor:
            cursor.execute(query, parameters)
            return rows_to_dicts(cursor, cursor.fetchall())
    finally:
        connection.close()


def write_json(rows, output_path):
    """Write rows as a UTF-8 JSON array."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as output_file:
        json.dump(rows, output_file, ensure_ascii=False, indent=2)
        output_file.write("\n")


def main():
    """Run the table export."""
    arguments = parse_arguments()

    if arguments.table not in ALLOWED_TABLES:
        allowed_names = ", ".join(ALLOWED_TABLES)
        print(
            f"Error: table '{arguments.table}' is not allowed. "
            f"Choose one of: {allowed_names}",
            file=sys.stderr,
        )
        return 1

    output_path = arguments.out or Path(f"{arguments.table}.json")

    try:
        rows = fetch_rows(arguments.table, arguments.limit)
        write_json(rows, output_path)
    except (KeyError, OSError, psycopg2.Error) as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1

    print(f"Wrote {len(rows)} rows to {output_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
