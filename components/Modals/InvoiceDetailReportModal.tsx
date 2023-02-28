import { returnTwoDigitFormattedNumber } from "@/helpers"
import { BudgetItemViewResponseType } from "@/types/BudgetItemViewResponseType"
import PrimaryButton from "../Buttons/PrimaryButton"

export default function InvoiceDetailReportModal({
  invoiceData,
  setShowModal,
}: {
  invoiceData: BudgetItemViewResponseType[]
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const showInvoice = invoiceData.map((data) => {
    return (
      <tr key={data.uuid}>
        <td className="px-5">{new Date(data.invoice.date).toLocaleString()}</td>
        <td className="px-5">{data.supplier.name}</td>
        <td className="px-5">{data.invoice.invoice_number}</td>
        <td className="px-5 text-right">
          {returnTwoDigitFormattedNumber(data.total)}
        </td>
      </tr>
    )
  })

  const table = (
    <table className="mx-auto mt-2 table-auto py-5">
      <thead className="border-b-2 border-black bg-indigo-200 font-bold">
        <tr>
          <th className="p-5 text-center">Date</th>
          <th className="p-5 text-center">Supplier</th>
          <th className="p-5 text-center">Invoice Number</th>
          <th className="p-5 text-center">Total</th>
        </tr>
      </thead>
      <tbody>
        {showInvoice}
        <tr>
          <td colSpan={4}>&nbsp;</td>
        </tr>
      </tbody>
    </table>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
      <div className="relative my-6 mx-auto w-auto max-w-3xl">
        <div className="relative flex w-full flex-col rounded-lg border-0 bg-white px-4 shadow-lg outline-none focus:outline-none">
          <div className="flex items-end justify-end rounded-t border-b border-solid border-slate-200 py-5">
            <PrimaryButton
              buttonType="button"
              text="Close"
              onEvent={() => setShowModal(false)}
            />
          </div>
          {table}
        </div>
      </div>
    </div>
  )
}
