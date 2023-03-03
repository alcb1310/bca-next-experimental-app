import prisma from "@/prisma/client"
import { cookies } from "next/headers"
import { returnTwoDigitFormattedNumber } from "@/helpers"
import { getUserByEmail, validateCookieInformation } from "@/helpers/api/users"
import LinkButton from "@/components/Buttons/LinkButton"
import { InvoiceResponseType } from "@/types"

async function getInvoices(
  cookie: string | undefined
): Promise<InvoiceResponseType[]> {
  if (cookie === undefined) throw new Error("Invalid cookie")
  const token = validateCookieInformation(cookie)
  if (token === false) throw new Error("Invalid cookie")
  const user = await getUserByEmail(token)
  if (user === null) throw new Error("Invalid cookie")
  return await prisma.invoice.findMany({
    where: {
      companyUuid: user.companyUuid,
    },
    select: {
      uuid: true,
      invoice_number: true,
      date: true,
      total: true,
      project: {
        select: {
          uuid: true,
          name: true,
        },
      },
      supplier: {
        select: {
          uuid: true,
          name: true,
        },
      },
    },
    orderBy: [
      {
        date: "desc",
      },
      {
        supplier: {
          name: "asc",
        },
      },
    ],
  })
}

export default async function InvoiceHome() {
  const cookieStore = cookies()
  const cookieValue = cookieStore.get("bca-token")

  const invoices: InvoiceResponseType[] = await getInvoices(cookieValue?.value)

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
      <td className="border-x-2 p-3 text-right">
        <LinkButton
          text="Edit"
          buttonColor={"bg-gray-200"}
          textColor={"text-gray-800"}
          link={`/bca/transactions/invoice/${invoice.uuid}`}
        />
      </td>
    </tr>
  ))
  return (
    <table className="mx-auto mt-2 table-auto">
      <caption className="pb-5 text-left text-2xl font-semibold uppercase ">
        <div className="flex items-center justify-between">
          <p className=" w-1/4"> Invoice</p>
          <div className="w-1/4 text-right text-base">
            <LinkButton
              text="Add"
              buttonColor="bg-light"
              textColor="bg-dark"
              link="/bca/transactions/invoice/new"
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
          <th className="p-3 text-center">Total</th>
          <th>&nbsp;</th>
        </tr>
      </thead>
      <tbody>{invoicesToDisplay}</tbody>
    </table>
  )
}
