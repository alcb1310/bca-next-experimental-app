CREATE VIEW public."BudgetView"
 AS
    SELECT 
        budget.uuid as id, budget.initial_quantity, budget.initial_cost, budget.initial_total,
        budget.spent_quantity, budget.spent_total, budget.to_spend_quantity, budget.to_spend_cost,
        budget.to_spend_total, budget.updated_budget, project.uuid as project_uuid, project.name as project_name,
        budget_item.uuid as budget_item_uuid, budget_item.code, budget_item.name as budget_item_name,
		budget_item.level, budget_item.accumulates, company.uuid as company_uuid, company.name as company_name
    FROM budget
    INNER JOIN company on budget."companyUuid" = company.uuid 
    INNER JOIN project on budget."projectUuid" = project.uuid
    INNER JOIN budget_item on budget."budgetItemUuid" = budget_item.uuid
;
