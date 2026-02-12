CREATE VIEW quadratic_systems AS
SELECT 
    functions_dim_1_nf.function_id,
    families_dim_1_nf.name AS family_name,
    functions_dim_1_nf.degree,
    functions_dim_1_nf.original_model
FROM functions_dim_1_nf
JOIN families_dim_1_nf ON functions_dim_1_nf.family = families_dim_1_nf.family_id
WHERE functions_dim_1_nf.degree = 2;