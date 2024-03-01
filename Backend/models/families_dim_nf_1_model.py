from DBConnector import db
from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.dialects.postgresql import ARRAY
import sqlalchemy.types as types

# Define the user-defined type
class SigmaInvariantsType(types.TypeDecorator):
    impl = ARRAY(types.VARCHAR)

    def process_bind_param(self, value, dialect):
        if value is not None:
            return f"({','.join(value['one'])},{','.join(value['two'])},{','.join(value['three'])})"
        return None

    def process_result_value(self, value, dialect):
        if value is not None:
            parts = value.strip("()").split(',')
            return {
                'one': parts[0].split(','),
                'two': parts[1].split(','),
                'three': parts[2].split(',')
            }
        return None


# class FamiliesDimNF1Model(db.Model):
    
#     __tablename__ = "families_dim_1_NF"
    
#     label = Column("label", String, primary_key=True) # varchar(%s) PRIMARY KEY,
#     degree = Column("degree", Integer) # integer,
#     num_parameters = Column("num_parameters", Integer) #integer,
#     model_coeffs = Column("model_coeffs", ARRAY(String)) #varchar[],
#     model_resultant = Column("model_resultant", String) #varchar,
#     base_field_label = Column("base_field_label", String) #varchar(%s),
#     base_field_degree = Column("base_field_degree", Integer)  #integer,
#     sigma_invariants = #Column("sigma_invariants", ARRAY((ARRAY(String),))  #sigma_invariants_type,
#     citations = Column("citations", ARRAY(Integer))  #integer[],
#     is_polynomial = Column("is_polynomial", Boolean)  #boolean,
#     num_critical_points = Column("num_critical_points", Integer)  #integer,
#     automorphism_group_cardinality = Column("automorphism_group_cardinality", Integer)  #integer