# PostgreSQL JSON Export

`export_table_to_json.py` exports one approved DADS PostgreSQL table to a JSON
array. Rows are ordered by the table's primary key so limited exports and
committed samples are reproducible.

## Usage

Run the script from the repository root:

```bash
python scripts/export_table_to_json.py TABLE [--limit N] [--out PATH]
```

The script reads connection settings from `Backend/database.ini`. To configure
the local Docker database:

```bash
cp Backend/database.ini.example Backend/database.ini
docker compose up -d --wait
```

The existing `load_config()` function is reused by adding `Backend/` to
`sys.path` and passing it the full path to `Backend/database.ini`.

Allowed table names are:

- `graphs_dim_1_nf`
- `functions_dim_1_nf`
- `families_dim_1_nf`
- `rational_preperiodic_dim_1_nf`
- `citations`

If `--out` is omitted, the script writes `<table>.json` in the current
directory. Parent directories in an explicit output path are created
automatically. `--limit` must be a positive integer.

Examples:

```bash
python scripts/export_table_to_json.py graphs_dim_1_nf
python scripts/export_table_to_json.py functions_dim_1_nf \
  --limit 5 \
  --out data/samples/functions_dim_1_nf.sample.json
```

An unapproved table name prints the allowed names and exits with status 1.
Table and column identifiers are composed with `psycopg2.sql.Identifier`;
user input is never interpolated directly into SQL.

## Findings

The PostgreSQL scalar and array values tested in these exports convert cleanly:

- Integer and real columns become JSON numbers.
- PostgreSQL arrays become JSON arrays. This includes `edges`,
  `periodic_cycles`, and `preperiodic_components` in `graphs_dim_1_nf`, and
  columns such as `citations`, `family`, and `newton_polynomial_coeffs` in
  `functions_dim_1_nf`.
- Booleans become JSON `true` or `false`.
- SQL `NULL` becomes JSON `null`.
- Character fields and the `display_model` enum become JSON strings.

All 35 rows of `graphs_dim_1_nf` exported without special conversion. In
particular, `edges` and `periodic_cycles` are JSON arrays rather than
PostgreSQL array strings.

The exception is PostgreSQL's custom composite `model_type`. The
`original_model`, `monic_centered`, and `reduced_model` columns in
`functions_dim_1_nf` are returned by psycopg2 as single strings. One exported
example is:

```text
("{{2,0,1},{0,0,2}}",16,{2},0.6931472,1.1.1.1)
```

The five comma-separated parts correspond, in order, to:

1. `coeffs` (`character varying[]`)
2. `resultant` (`character varying`)
3. `bad_primes` (`integer[]`)
4. `height` (`real`)
5. `base_field_label` (`character varying(15)`)

A missing field inside the composite is represented by an empty position, not
JSON `null`. For example, a missing height appears as:

```text
("{{1,0,1},{0,0,1}}",1,{},,1.1.1.1)
```

The frontend currently parses these strings by hand.
`splitOutermostCommas()` in `ModelsTable.js` tracks nested braces while
splitting the composite. That table displays the coefficients, resultant, and
bad primes; it does not display the composite height and uses
`cp_field_of_defn` for its field link. CSV export in `ExploreSystems.js` uses a
separate `getEntryFromModelString()` helper to extract all five positions.

For SQLite, two reasonable approaches are:

1. Convert each model to a JSON object with the five named fields and store
   that object in a `TEXT` column, using SQLite's JSON functions when querying.
2. Normalize models into a separate table with columns for each field and a
   foreign key back to the function.

The JSON-object approach is closest to the current data shape and avoids
continuing to depend on positional composite-string parsing.

# SQLite build

`build_sqlite.py` copies the five approved tables from local PostgreSQL into a
single SQLite file for offline desktop use.

## Usage

From the repository root:

```bash
python scripts/build_sqlite.py [--out PATH]
```

Connection settings come from `Backend/database.ini` (same as the JSON export).
Default output is `data/exports/dads.sqlite`. The file is gitignored; do not
commit it.

Models in `functions_dim_1_nf` are read with decomposed `SELECT` columns such
as `(original_model).coeffs` and stored as JSON objects in `TEXT` columns with
the same names as PostgreSQL.

### Optional: verify against Postgres

`verify_sqlite_export.py` is a **local QA helper** (not used by the app or CI).
Run it after a successful build when Docker Postgres and `Backend/database.ini`
are available:

```bash
python scripts/verify_sqlite_export.py
```

It checks row counts, metadata keys, and five sample `function_id` values
(11, 2400, 26, 306, 302). System **11** has a NULL `monic_centered` model;
**2400** has a NULL `height` inside `monic_centered` in Postgres.

Unit tests without Postgres:

```bash
python -m pytest tests/test_build_sqlite.py -q
```

## Findings (SQLite build)

- Decomposing `model_type` in SQL returns real `NULL`s for missing subfields
  and for whole-model `NULL` (for example system 11 `monic_centered`).
- Casting `display_model` with `::text` yields the enum label string for
  SQLite `TEXT` storage.
