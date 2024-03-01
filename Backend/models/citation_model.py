from sqlalchemy.dialects.postgresql import ARRAY
from DBConnector import db
from sqlalchemy import Column, String, Integer, Sequence

CITATION_SEQUENCE = Sequence("citation_id_serial")

class CitationsModel(db.Model):

    __tablename__ = "citations"

    label = Column("label", String, primary_key=True)
    authors = Column("authors", ARRAY(String))
    journal = Column("journal", String)
    year = Column("year", Integer)
    citation = Column("citation", String)
    mathscinet = Column("mathscinet", String)
    id = Column("id", Integer, CITATION_SEQUENCE,
                server_default=CITATION_SEQUENCE.next_value())