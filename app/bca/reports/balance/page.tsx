'use client'

import PrimaryButton from '@/components/Buttons/PrimaryButton'
import { InputElement, SelectElement } from '@/components/Inputs'
import { returnTwoDigitFormattedNumber } from '@/helpers'
import { Balance } from '@/types'
import { useState, use, useEffect, ChangeEvent, FormEvent } from 'react'

type ProjectType = {
  uuid: string
  name: string
}

export default function BalanceHome() {
  const [projects, setProjects] = useState<ProjectType[]>([])
  const [selectedProject, setSelectedProject] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [balance, setBalance] = useState<Balance[]>([])

  useEffect(() => {
    ;(async () => {
      const res = await fetch('/api/projects?active=true')
      const data = await res.json()
      setProjects(data.detail)
    })()
  }, [])

  function handleSelectedProjectChange(event: ChangeEvent<HTMLInputElement>) {
    setSelectedProject(event.target.value)
  }

  function handleDateChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target
    setSelectedDate(value)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const res = await fetch(
      `/api/reports/balance?project=${selectedProject}&date=${selectedDate}`
    )
    const data = await res.json()

    setBalance(data.detail)
  }

  const projectsOptions = projects.map((project) => (
    <option key={project.uuid} value={project.uuid}>
      {project.name}
    </option>
  ))

  const balanceReport = balance.map((info) => {
    return (
      <tr key={info.uuid} className="even:bg-indigo-100 hover:bg-indigo-200">
        <td className="px-3">{info.supplier?.name}</td>
        <td className="px-3 text-right">{info.invoice_number}</td>
        <td className="px-3 text-center">{new Date(info.date).toDateString()}</td>
        <td className="px-3 text-right">
          {returnTwoDigitFormattedNumber(info.total)}
        </td>
      </tr>
    )
  })

  const total = balance.reduce((accum, current) => {
    return accum + current.total
  }, 0)

  const tableData = (
    <table className="mx-auto mt-5 table-fixed">
      <caption className="pb-5 text-left text-xl font-semibold uppercase ">
        <p className=" w-1/4">
          Total:
          <span className="ml-3">{returnTwoDigitFormattedNumber(total)}</span>
        </p>
      </caption>
      <thead className="border-b-2 border-black bg-indigo-200 font-bold">
        <tr>
          <th className="w-1/3 p-3 text-center">Supplier</th>
          <th className="w-1/3 p-3 text-center">Invoice Number</th>
          <th className="w-1/3 p-3 text-center">Date</th>
          <th className="w-1/3 p-3 text-center">Total</th>
        </tr>
      </thead>
      <tbody>
        {balanceReport}
        <tr className="text-right font-extrabold">
          <td colSpan={3} className="p-3 text-right">
            Total:
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
      <h1 className="mt-5 text-center text-3xl font-bold">Balance</h1>
      <form onSubmit={handleSubmit}>
        <SelectElement
          label="Projects"
          error={null}
          inputName="projects"
          required={true}
          value={selectedProject}
          onChange={handleSelectedProjectChange}
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
          value={selectedDate}
          enabled
        />
        <PrimaryButton
          buttonType="button"
          text="Submit"
          onEvent={handleSubmit}
        />
      </form>
      {balance.length > 0 && tableData}
    </>
  )
}
