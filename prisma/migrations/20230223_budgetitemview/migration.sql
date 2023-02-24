CREATE VIEW public."BudgetItemView"
AS
select 
invoice_detail.uuid as id, invoice_detail.quantity, invoice_detail.cost, invoice_detail.total,
company.uuid as company_uuid, company.name as company_name, budget_item.uuid as budget_item_uuid,
budget_item.code, budget_item.name as budget_item_name, budget_item.accumulates, budget_item.level,
invoice.uuid as invoice_uuid, invoice.invoice_number, invoice.date
from invoice_detail
inner join company on invoice_detail."companyUuid" = company.uuid
inner join budget_item on invoice_detail."budgetItemUuid" = budget_item.uuid
inner join invoice on invoice_detail."invoiceUuid" = invoice.uuid;
