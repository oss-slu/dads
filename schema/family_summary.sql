CREATE VIEW family_summary AS
SELECT
	families_dim_1_nf.name AS family_name,
	families_dim_1_nf.degree,
	families_dim_1_nf.model_coeffs,
	families_dim_1_nf.base_field_label,
	families_dim_1_nf.sigma_one,
	families_dim_1_nf.sigma_two, 
	families_dim_1_nf.model_resultant,
	families_dim_1_nf.is_polynomial,
	families_dim_1_nf.num_critical_points,
	families_dim_1_nf.automorphism_group_cardinality,
	citations.citation
FROM families_dim_1_nf
LEFT JOIN citations ON citations.id = ANY(families_dim_1_nf.citations)
	