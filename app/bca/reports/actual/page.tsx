'use client'

import PrimaryButton from '@/components/Buttons/PrimaryButton'
import { SelectElement } from '@/components/Inputs'
import { returnTwoDigitFormattedNumber } from '@/helpers'
import { BudgetFormattedResponseType, ProjectType } from '@/types'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'

export default function ActualHome() {
  const [projects, setProjects] = useState<ProjectType[]>([])
  const [selectedProject, setSelectedProject] = useState<string>('')
  const [level, setLevel] = useState<number>(1)
  const [budgets, setBudgets] = useState<BudgetFormattedResponseType[]>([])

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
    if (event.target.value === '') setLevel(1)
    setLevel(parseInt(event.target.value, 10))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const res = await fetch(
      `/api/budgets?project=${selectedProject}&level=${level}`
    )

    if (!res.ok) {
      console.error('invalid data')
      return
    }

    const data = await res.json()
    setBudgets(data.detail)
  }

  const projectElement = projects.map((project) => {
    return (
      <option key={project.uuid} value={project.uuid}>
        {project.name}
      </option>
    )
  })

  const tableBody = budgets.map((budget) => {
    return (
      <tr key={budget.uuid} className="hover:bg-light">
        <td className="px-3">{budget.budgetItem.code}</td>
        <td className="px-3">{budget.budgetItem.name}</td>
        <td className="px-3 text-right">
          {budget.to_spend_cost
            ? returnTwoDigitFormattedNumber(budget.to_spend_cost)
            : ''}
        </td>
        <td className="px-3 text-right">
          {returnTwoDigitFormattedNumber(budget.to_spend_total)}
        </td>
        <td className="px-3 text-right">
          {budget.spent_quantity
            ? returnTwoDigitFormattedNumber(budget.spent_quantity)
            : ''}
        </td>
        <td className="px-3 text-right">
          {budget.to_spend_cost
            ? returnTwoDigitFormattedNumber(budget.to_spend_cost)
            : ''}
        </td>
        <td className="px-3 text-right">
          {returnTwoDigitFormattedNumber(budget.to_spend_total)}
        </td>
        <td className="px-3 text-right">
          {returnTwoDigitFormattedNumber(budget.updated_budget)}
        </td>
      </tr>
    )
  })

  const tableData = (
    <table className="mx-auto mt-5 table-fixed">
      <thead className="border-b-2 border-black bg-indigo-200 text-center font-bold">
        <tr>
          <th colSpan={2}>Budget Item</th>
          <th colSpan={2}>Spent</th>
          <th colSpan={3}>To Spend</th>
          <th rowSpan={2}>Total</th>
        </tr>
        <tr>
          <th>Code</th>
          <th>Name</th>
          <th>Quantity</th>
          <th>Total</th>
          <th>Quantity</th>
          <th>Cost</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>{tableBody}</tbody>
    </table>
  )

  return (
    <>
      <h1 className="mt-5 text-center text-3xl font-bold">Actual</h1>
      <form onSubmit={handleSubmit}>
        <SelectElement
          label="Project"
          error={null}
          inputName="project"
          required
          value={selectedProject}
          onChange={handleProjectChange}
        >
          {projectElement}
        </SelectElement>
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
          buttonType={'submit'}
          text="Submit"
          onEvent={handleSubmit}
        />
      </form>
      {budgets.length > 0 && tableData}
    </>
  )
}
