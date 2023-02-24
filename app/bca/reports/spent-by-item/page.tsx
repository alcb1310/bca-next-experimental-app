'use client'

import PrimaryButton from '@/components/Buttons/PrimaryButton'
import { InputElement, SelectElement } from '@/components/Inputs'
import InvoiceDetailReportModal from '@/components/Modals/InvoiceDetailReportModal'
import { returnTwoDigitFormattedNumber } from '@/helpers'
import { ProjectType } from '@/types'
import { BudgetItemViewResponseType } from '@/types/BudgetItemViewResponseType'
import { budget_item } from '@prisma/client'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'

type SpentByItemReportType = {
  budgetItem: budget_item
  spent: number
}

export default function SpentByItem() {
  const [projects, setProjects] = useState<ProjectType[]>([])
  const [selectedProject, setSelectedProject] = useState<string>('')
  const [level, setLevel] = useState<number>(1)
  const [date, setDate] = useState<string>('')
  const [spentByItem, setSpentByItem] = useState<SpentByItemReportType[]>([])
  const [invoiceDetailsInfo, setInvoiceDetailsInfo] = useState<
    BudgetItemViewResponseType[]
  >([])
  const [showModal, setShowModal] = useState<boolean>(false)

  useEffect(() => {
    ;(async () => {
      const res = await fetch('/api/projects?active=true')
      const data = await res.json()
      setProjects(data.detail)
    })()
  }, [])

  function handleProjectChange(event: ChangeEvent<HTMLInputElement>) {
    setSelectedProject(event.target.value)
  }

  function handleLevelChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target

    if (Number.isNaN(value)) return

    setLevel(parseInt(value, 10))
  }

  function handleDateChange(event: ChangeEvent<HTMLInputElement>) {
    setDate(event.target.value)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const results = await fetch(
      `/api/reports/spent-budget-items?project=${selectedProject}&date=${date}&level=${level}`
    )
    const data = await results.json()
    setSpentByItem(data.detail)
  }

  async function handleItemClick(budgetItemUUID: string) {
    const results = await fetch(
      `/api/reports/spent-budget-items/${budgetItemUUID}?project=${selectedProject}&date=${date}`
    )
    if (!results.ok) return

    const data = await results.json()
    setInvoiceDetailsInfo(data.detail)
    setShowModal(true)
  }

  const projectsOptions = projects.map((project) => (
    <option key={project.uuid} value={project.uuid}>
      {project.name}
    </option>
  ))

  const total = spentByItem.reduce((accum, data) => accum + data.spent, 0)

  const reportDisplayRows = spentByItem.map((data) => (
    <tr
      key={data.budgetItem.uuid}
      className="cursor-pointer even:bg-light hover:bg-indigo-300"
      onClick={() => handleItemClick(data.budgetItem.uuid)}
    >
      <td className="px-3">{data.budgetItem.code}</td>
      <td className="px-3">{data.budgetItem.name}</td>
      <td className="px-3 text-right">
        {returnTwoDigitFormattedNumber(data.spent)}
      </td>
    </tr>
  ))

  const reportDisplayData = (
    <table className="mx-auto mt-2 table-auto">
      <thead className="border-b-2 border-black bg-light font-bold">
        <tr>
          <th className="p-3 text-center">Code</th>
          <th className="p-3 text-center">Name</th>
          <th className="p-3 text-center">Total</th>
        </tr>
      </thead>
      <tbody>
        {reportDisplayRows}
        <tr className="text-right font-extrabold">
          <td colSpan={2} className="p-3 text-right">
            Total
          </td>
          <td className="p-3 text-right">
            {returnTwoDigitFormattedNumber(total)}
          </td>
        </tr>
      </tbody>
    </table>
  )

  return (
    <>
      <h1 className="mt-5 text-center text-3xl font-bold">Spent By Item</h1>
      <form onSubmit={handleSubmit}>
        <SelectElement
          label="Projects"
          error={null}
          inputName="project"
          required
          value={selectedProject}
          onChange={handleProjectChange}
        >
          {projectsOptions}
        </SelectElement>

        <InputElement
          label="Date"
          error={null}
          inputName="date"
          required
          inputType="date"
          onChange={handleDateChange}
          value={date}
          enalbled
        />

        <SelectElement
          label="Level"
          error={null}
          inputName="level"
          required
          value={level}
          onChange={handleLevelChange}
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
        </SelectElement>

        <PrimaryButton
          buttonType="submit"
          text="Search"
          onEvent={handleSubmit}
        />
      </form>
      {spentByItem.length > 0 && reportDisplayData}
      {showModal && (
        <InvoiceDetailReportModal
          invoiceData={invoiceDetailsInfo}
          setShowModal={setShowModal}
        />
      )}
    </>
  )
}
