drop view public."BudgetItemView";

create view public."BudgetItemView"
as
 SELECT invoice_detail.uuid AS id,
    invoice_detail.quantity,
    invoice_detail.cost,
    invoice_detail.total,
    company.uuid AS company_uuid,
    company.name AS company_name,
    budget_item.uuid AS budget_item_uuid,
    budget_item.code,
    budget_item.name AS budget_item_name,
    budget_item.accumulates,
    budget_item.level,
    invoice.uuid AS invoice_uuid,
    invoice.invoice_number,
    invoice.date,
	project.uuid AS project_uuid,
	project.name AS project_name
   FROM invoice_detail
     JOIN company ON invoice_detail."companyUuid" = company.uuid
     JOIN budget_item ON invoice_detail."budgetItemUuid" = budget_item.uuid
     JOIN invoice ON invoice_detail."invoiceUuid" = invoice.uuid
	 JOIN project ON invoice."projectUuid" = project.uuid
;
