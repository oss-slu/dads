from sqlalchemy import URL
from sqlalchemy.orm import DeclarativeBase
from flask_sqlalchemy import SQLAlchemy
import os

DB_URL = URL.create(
    drivername= "postgresql+psycopg2",
    username= os.environ.get("POSTGRES_USER", "dad_user"), #"dad_user",
    password= os.environ.get("POSTGRES_PASSWORD", "dad_pass"), #"dad_pass",
    host= os.environ.get("DB_HOST_FOR_BACKEND", "localhost"), #"localhost",
    port= os.environ.get("DB_PORT_FOR_BACKEND", 5432), # 5432,
    database= os.environ.get("POSTGRES_DB", "dad"), #"dad"
)


class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)