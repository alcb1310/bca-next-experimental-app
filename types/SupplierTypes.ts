export type SupplierDataType = {
  uuid: string
  name: string
}

export type SupplierResponseType = {
  uuid: string
  supplier_id: string
  name: string
  contact_name?: string | null
  contact_email?: string | null
  contact_phone?: string | null
}
