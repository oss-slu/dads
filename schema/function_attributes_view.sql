CREATE VIEW function_attributes_view AS
SELECT
	functions_dim_1_nf.is_newton,
	functions_dim_1_nf.is_polynomial,
	functions_dim_1_nf.is_pcf,
	functions_dim_1_nf.is_lattes,
	functions_dim_1_nf.is_chebyshev,
	functions_dim_1_nf.automorphism_group_cardinality
FROM functions_dim_1_nf