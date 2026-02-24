CREATE VIEW function_details_view AS
SELECT
	functions_dim_1_nf.function_id,
	functions_dim_1_nf.original_model,
	functions_dim_1_nf.degree,
	functions_dim_1_nf.base_field_label,
	families_dim_1_nf.name AS family_type
FROM functions_dim_1_nf
JOIN families_dim_1_nf ON families_dim_1_nf.family_id = ANY(functions_dim_1_nf.family)
