"use client"
import PrimaryButton from "@/components/Buttons/PrimaryButton"
import { InputElement, SelectElement } from "@/components/Inputs"
import { returnTwoDigitFormattedNumber } from "@/helpers"
import { ProjectType } from "@/types"
import { HistoricResponseType } from "@/types/HistoricResponseType"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"

export default function HistoricHome() {
  const [projects, setProjects] = useState<ProjectType[]>([])
  const [selectedProject, setSelectedProject] = useState<string>("")
  const [date, setDate] = useState<string>("")
  const [level, setLevel] = useState<number>(1)
  const [historics, setHistorics] = useState<HistoricResponseType[]>([])

  useEffect(() => {
    ;(async () => {
      const res = await fetch("/api/projects")
      const data = await res.json()
      setProjects(data.detail)
    })()
  }, [])

  function handleProjectSelect(event: ChangeEvent<HTMLInputElement>) {
    setSelectedProject(event.target.value)
  }

  function handleDateChange(event: ChangeEvent<HTMLInputElement>) {
    setDate(event.target.value)
  }

  function handleLevelChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target

    if (Number.isNaN(value)) return

    setLevel(parseInt(value, 10))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = await fetch(
      `/api/reports/historic?project=${selectedProject}&level=${level}&date=${date}`
    )
    const historicReport = await data.json()

    setHistorics(historicReport.detail)
  }

  const budgetDisplayData = historics.map((budget) => {
    return (
      <tr
        key={budget.uuid}
        className={budget.budgetItem.accumulates ? "font-bold" : "font-normal"}
      >
        <td>{budget.budgetItem.code}</td>
        <td>{budget.budgetItem.name}</td>
        <td className="text-right">
          {budget.spent_quantity === null
            ? null
            : returnTwoDigitFormattedNumber(budget.spent_quantity)}
        </td>
        <td className="text-right">
          {returnTwoDigitFormattedNumber(budget.spent_total)}
        </td>
        <td className="text-right">
          {budget.to_spend_quantity === null
            ? null
            : returnTwoDigitFormattedNumber(budget.to_spend_quantity)}
        </td>
        <td className="text-right">
          {budget.to_spend_cost === null
            ? null
            : returnTwoDigitFormattedNumber(budget.to_spend_cost)}
        </td>
        <td className="text-right">
          {returnTwoDigitFormattedNumber(budget.to_spend_total)}
        </td>
        <td className="text-right">
          {returnTwoDigitFormattedNumber(budget.updated_budget)}
        </td>
      </tr>
    )
  })

  const historicsTable = (
    <table className="mx-auto mt-2 table-auto">
      <thead className="border-b-2 border-black bg-light font-bold">
        <tr>
          <th colSpan={2} className="p-3 text-center">
            Budget Item
          </th>
          <th colSpan={2} className="p-3 text-center">
            Spent
          </th>
          <th colSpan={3} className="p-3 text-center">
            To Spend
          </th>
          <th className="p-3 text-center" rowSpan={2}>
            Total
          </th>
        </tr>
        <tr>
          <th className="p-3 text-center">Code</th>
          <th className="p-3 text-center">Name</th>
          <th className="p-3 text-center">Quantity</th>
          <th className="p-3 text-center">Total</th>
          <th className="p-3 text-center">Quantity</th>
          <th className="p-3 text-center">Cost</th>
          <th className="p-3 text-center">Total</th>
        </tr>
      </thead>
      <tbody>{budgetDisplayData}</tbody>
    </table>
  )

  return (
    <>
      <h1 className="mt-5 text-center text-3xl font-bold">Historic</h1>
      <form onSubmit={handleSubmit}>
        <SelectElement
          label="Project"
          error={null}
          inputName="project"
          required
          value={selectedProject}
          onChange={handleProjectSelect}
        >
          {projects.map((project) => (
            <option key={project.uuid} value={project.uuid}>
              {project.name}
            </option>
          ))}
        </SelectElement>
        <InputElement
          label="date"
          error={null}
          inputName="date"
          required
          inputType="date"
          onChange={handleDateChange}
          value={date}
          enabled
        />
        <SelectElement
          label="level"
          error={null}
          inputName="lavel"
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
          buttonType="button"
          text="Submit"
          onEvent={handleSubmit}
        />
      </form>
      {historics.length > 0 && historicsTable}
    </>
  )
}
