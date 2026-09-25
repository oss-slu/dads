# Local Database Setup

Runs a local copy of the DADS database in Docker, restored from `schema/dads_prod_backup.sql`. Only your machine can connect to it.

## Prerequisites
* Docker Desktop, running
* Python dependencies from the root `requirements.txt` (`Backend/requirements.txt` is empty)

## Start the database
From the repo root:

```bash
docker compose up -d --wait
```

The first start restores the dump, which takes about 10 seconds (plus the Postgres image download the very first time). `docker compose logs -f db` shows the restore as it runs. Always check it worked, since a failed restore leaves the database empty:

```bash
docker compose exec db psql -U dads -d dads -c "select count(*) from functions_dim_1_nf;"
```

This should print `17535`.

## Connect the backend
```bash
cp Backend/database.ini.example Backend/database.ini
pip install -r requirements.txt
cd Backend
python server.py
```

The first line should be `Connected to the PostgreSQL server.` Run `server.py` from inside `Backend/`, since it reads `database.ini` from the current folder.

## Stop and reset
* `docker compose stop` stops the database. Data is kept.
* `docker compose down` removes the container. Data is kept in the `dads_pgdata` volume.
* `docker compose down -v` also deletes the data. The next `up` restores the dump again.

## Troubleshooting
* **Port 5432 already in use:** another Postgres is running on your machine. Stop it and run `docker compose up -d` again.
* **`relation "functions_dim_1_nf" does not exist`:** the restore failed. Check `docker compose logs db`, then run `docker compose down -v` and start again.
* **`KeyError: 'Section postgresql_local not found in the database.ini file'`:** run `server.py` from `Backend/` and make sure `database.ini` exists.
