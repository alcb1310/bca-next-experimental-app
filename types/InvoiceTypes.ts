import { ProjectType, SupplierDataType } from "."

export type InvoiceDataType = {
  uuid: string
  invoice_number: string
  date: Date
}

export type InvoiceResponseType = {
  uuid: string
  invoice_number: string
  date: Date
  total: number
  project: ProjectType
  supplier: SupplierDataType
}
