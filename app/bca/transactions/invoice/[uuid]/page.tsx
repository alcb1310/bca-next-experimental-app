"use client"

import PrimaryButton from "@/components/Buttons/PrimaryButton"
import { InputElement, SelectElement } from "@/components/Inputs"
import SuccessAlert from "@/components/SuccessAlert"
import { returnTwoDigitFormattedNumber } from "@/helpers"
import { ProjectType, SupplierResponseType } from "@/types"
import { useRouter } from "next/navigation"
import { ParsedUrlQuery } from "querystring"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"

async function getProjects() {
  const response = await fetch("/api/projects")
  return await response.json()
}

async function getSuppliers() {
  const response = await fetch("/api/suppliers")
  return await response.json()
}

type Create = {
  uuid?: string
  project?: string
  supplier?: string
  date?: Date
  invoice_number?: string
  total?: number
}

export default function Detail({ params }: { params: ParsedUrlQuery }) {
  const [invoice, setInvoice] = useState<Create>({
    project: "",
    supplier: "",
    date: new Date(),
    invoice_number: "",
    total: 0,
  })
  const [projects, setProjects] = useState<ProjectType[]>([])
  const [suppliers, setSuppliers] = useState<SupplierResponseType[]>([])
  const [showSuccess, setShowSuccess] = useState<boolean>(false)

  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      const [projectsData, suppliersData] = await Promise.all([
        getProjects(),
        getSuppliers(),
      ])

      setProjects(projectsData.detail)
      setSuppliers(suppliersData.detail)
    })()

    if (params.uuid === "new") {
      setInvoice({
        project: "",
        supplier: "",
        date: new Date(),
        invoice_number: "",
        total: 0,
      })
      return
    }
    ;(async () => {
      const response = await fetch(`/api/invoices/${params.uuid}`)
      const data = await response.json()
      if ("errorStatus" in data.detail) {
        setInvoice({})
        return
      }
      setInvoice({
        uuid: data.detail.uuid,
        project: data.detail.project.uuid,
        supplier: data.detail.supplier.uuid,
        date: new Date(data.detail.date),
        invoice_number: data.detail.invoice_number,
        total: data.detail.total,
      })
    })()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSuccess(false)
    }, 1000)

    if (invoice.uuid === undefined) return () => clearTimeout(timer)

    return () => {
      clearTimeout(timer)
      router.push(`/bca/transactions/invoice/${invoice.uuid}`)
    }
  }, [showSuccess])

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target

    setInvoice((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLElement>) {
    event.preventDefault()

    if (invoice?.uuid) {
      await fetch(`/api/invoices/${invoice.uuid}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(invoice),
      })

      setShowSuccess(true)
      return
    }
    const response = await fetch("/api/invoices", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(invoice),
    })

    const data = await response.json()
    setInvoice((prev) => ({ ...prev, uuid: data.detail.uuid }))
    setShowSuccess(true)
  }
  const dateValue = invoice?.date ? invoice?.date : new Date()
  const month = `0${dateValue.getMonth() + 1}`.slice(-2)
  const day = `0${dateValue.getDate()}`.slice(-2)
  const displayDate = `${dateValue.getFullYear()}-${month}-${day}`

  return (
    <>
      {showSuccess && <SuccessAlert message="Invoice saved successfuly" />}
      <h1>{invoice?.uuid ? "Update invoice" : "Create invoice"}</h1>
      <div className="my-5">
        <form onSubmit={handleSubmit}>
          <SelectElement
            label="Projects"
            error={null}
            inputName="project"
            required
            value={invoice?.project}
            onChange={handleChange}
          >
            {projects.map((project) => (
              <option key={project.uuid} value={project.uuid}>
                {project.name}
              </option>
            ))}
          </SelectElement>

          <SelectElement
            label="Supplier"
            error={null}
            inputName="supplier"
            required
            value={invoice?.supplier}
            onChange={handleChange}
          >
            {suppliers.map((supplier) => (
              <option key={supplier.uuid} value={supplier.uuid}>
                {supplier.name}
              </option>
            ))}
          </SelectElement>

          <InputElement
            label="Date"
            error={null}
            inputName="date"
            required
            inputType="date"
            onChange={handleChange}
            enabled={true}
            value={displayDate}
          />

          <InputElement
            label={"Invoice Number"}
            error={null}
            inputName={"invoice_number"}
            required
            inputType="text"
            onChange={handleChange}
            value={invoice?.invoice_number}
            enabled
          />

          <InputElement
            label={"Total"}
            error={null}
            inputName={"total"}
            required={false}
            inputType="text"
            onChange={handleChange}
            value={returnTwoDigitFormattedNumber(invoice?.total)}
            enabled={false}
          />

          <PrimaryButton
            buttonType="submit"
            text="Submit"
            onEvent={handleSubmit}
          />
        </form>
      </div>
    </>
  )
}
