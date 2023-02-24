CREATE VIEW public."HistoricView"
AS
SELECT
historic.uuid AS id, historic.date, historic.initial_quantity, historic.initial_cost, historic.initial_total, 
historic.spent_quantity, historic.spent_total, historic.to_spend_quantity, historic.to_spend_cost, historic.to_spend_total,
historic.updated_budget, company.uuid AS company_uuid, company.name AS company_name, project.uuid as project_uuid,
project.name AS project_name, budget_item.uuid AS budget_item_uuid, budget_item.code, budget_item.name as budget_item_name,
budget_item.accumulates, budget_item.level
from historic
INNER JOIN company ON historic."companyUuid" = company.uuid
INNER JOIN project ON historic."projectUuid" = project.uuid
INNER JOIN budget_item ON historic."budgetItemUuid" = budget_item.uuid
;
