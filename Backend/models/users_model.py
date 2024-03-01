from DBConnector import db
from sqlalchemy import Integer, String, Column


class User(db.Model):
    
    __tablename__ = "users"
    
    id = Column(Integer, autoincrement=True, primary_key=True)
    first_name = Column(String)
    last_name = Column(String)

    def __str__(self) -> str:
        return f"{self.first_name} {self.last_name}"
    
    