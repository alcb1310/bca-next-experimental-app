"use client"
import PrimaryButton from "@/components/Buttons/PrimaryButton"
import { returnTwoDigitFormattedNumber } from "@/helpers"
import { InvoiceResponseType } from "@/types"
import { useEffect, useState } from "react"

export default function InvoiceHome() {
  const [invoices, setInvoices] = useState<InvoiceResponseType[]>([])

  useEffect(() => {
    ;(async () => {
      const response = await fetch("/api/invoices")
      const data = await response.json()
      setInvoices(data.detail)
    })()
  }, [])

  function addInvoice() {
    return
  }

  const invoicesToDisplay = invoices.map((invoice) => (
    <tr className="hover:bg-indigo-100" key={invoice.uuid}>
      <td className="border-x-2 p-3">
        {new Date(invoice.date).toLocaleDateString()}
      </td>
      <td className="border-x-2 p-3">{invoice.project.name}</td>
      <td className="border-x-2 p-3">{invoice.supplier.name}</td>
      <td className="border-x-2 p-3">{invoice.invoice_number}</td>
      <td className="border-x-2 p-3 text-right">
        {returnTwoDigitFormattedNumber(invoice.total)}
      </td>
    </tr>
  ))

  return (
    <table className="mx-auto mt-2 table-auto">
      <caption className="pb-5 text-left text-2xl font-semibold uppercase ">
        <div className="flex items-center justify-between">
          <p className=" w-1/4"> Invoice</p>
          <div className="w-1/4 text-right text-base">
            <PrimaryButton
              buttonType="button"
              text="Add"
              onEvent={addInvoice}
            />
          </div>
        </div>
      </caption>
      <thead className="border-b-2 border-black bg-indigo-200 font-bold">
        <tr>
          <th className="p-3 text-center">Date</th>
          <th className="p-3 text-center">Project</th>
          <th className="p-3 text-center">Supplier</th>
          <th className="p-3 text-center">Number</th>
          <th className="p-3 text-center"></th>
        </tr>
      </thead>
      <tbody>{invoicesToDisplay}</tbody>
    </table>
  )
}
