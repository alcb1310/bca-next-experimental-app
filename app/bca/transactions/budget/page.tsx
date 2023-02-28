"use client"
import PrimaryButton from "@/components/Buttons/PrimaryButton"
import { returnTwoDigitFormattedNumber } from "@/helpers"
import { BudgetFormattedResponseType } from "@/types/BudgetResponseType"
import { useEffect, useState } from "react"
import Modal from "./modal"

export default function BudgetHome() {
  const [budgets, setBudgets] = useState<BudgetFormattedResponseType[]>([])
  const [showModal, setShowModal] = useState<boolean>(false)
  const [selectedBudget, setSelectedBudget] = useState<
    BudgetFormattedResponseType | undefined
  >(undefined)

  useEffect(() => {
    ;(async () => {
      const response = await fetch("/api/budgets?accumulates=false")
      const data = await response.json()

      setBudgets(data.detail)
    })()
  }, [showModal])

  const budgetDisplayData = budgets.map((budget) => (
    <tr
      key={budget.uuid}
      className={"even:bg-indigo-50 hover:cursor-pointer hover:bg-indigo-300"}
      onClick={() => {
        setSelectedBudget(budget)
        setShowModal(true)
      }}
    >
      <td className="border-x-2 p-3">{budget.project.name}</td>
      <td className="border-x-2 p-3">{budget.budgetItem.code}</td>
      <td className="border-x-2 p-3">{budget.budgetItem.name}</td>
      <td className="border-x-2 p-3">
        {budget.spent_quantity !== null
          ? returnTwoDigitFormattedNumber(budget.spent_quantity)
          : ""}
      </td>
      <td className="border-x-2 p-3">
        {returnTwoDigitFormattedNumber(budget.spent_total)}
      </td>
      <td className="border-x-2 p-3">
        {budget.to_spend_quantity !== null
          ? returnTwoDigitFormattedNumber(budget.to_spend_quantity)
          : ""}
      </td>

      <td className="border-x-2 p-3">
        {budget.to_spend_cost !== null
          ? returnTwoDigitFormattedNumber(budget.to_spend_cost)
          : ""}
      </td>
      <td className="border-x-2 p-3">
        {returnTwoDigitFormattedNumber(budget.to_spend_total)}
      </td>
    </tr>
  ))

  return (
    <>
      <table className="mx-auto mt-2 table-auto">
        <caption className="pb-5 text-left text-2xl font-semibold uppercase">
          <div className="flex items-center justify-between">
            <p className="w-1/4">Budget</p>
            <div className="w-1/4 text-right text-base">
              <PrimaryButton
                buttonType="button"
                text="Add"
                onEvent={() => {
                  setSelectedBudget(undefined)
                  setShowModal(true)
                }}
              />
            </div>
          </div>
        </caption>
        <thead className="border-b-2 border-black bg-light font-bold">
          <tr>
            <th className="p-3 text-center" rowSpan={2}>
              Project
            </th>
            <th className="p-3 text-center" colSpan={2}>
              Budget Item
            </th>
            <th className="p-3 text-center" colSpan={2}>
              Spent
            </th>
            <th className="p-3 text-center" colSpan={3}>
              To Spend
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
      {showModal && (
        <Modal setShowModal={setShowModal} budget={selectedBudget} />
      )}
    </>
  )
}
