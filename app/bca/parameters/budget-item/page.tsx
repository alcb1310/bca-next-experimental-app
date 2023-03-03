"use client"

import PrimaryButton from "@/components/Buttons/PrimaryButton"
import { BudgetItemResponseType } from "@/types"
import { useEffect, useState } from "react"
import Modal from "./modal"

export default function BudgetItemHome() {
  const [budgetItems, setBudgetItems] = useState<BudgetItemResponseType[]>([])
  const [showModalInfo, setShowModalInfo] = useState<boolean>(false)
  const [selectedBudgetItem, setSelectedBudgetItem] = useState<
    BudgetItemResponseType | undefined
  >(undefined)

  useEffect(() => {
    ;(async () => {
      const response = await fetch("/api/budget-items")
      const data = await response.json()
      setBudgetItems(data.detail)
    })()
  }, [showModalInfo])

  const budgetItemsData = budgetItems.map((budgetItem) => (
    <tr
      className="even:bg-indigo-50 hover:cursor-pointer hover:bg-indigo-300"
      key={budgetItem.uuid}
      onClick={() => {
        setSelectedBudgetItem(budgetItem)
        setShowModalInfo(true)
      }}
    >
      <td className="border-x-2 p-3">{budgetItem.code}</td>
      <td className="border-x-2 p-3">{budgetItem.name}</td>
      <td className="border-x-2 p-3">{budgetItem.level}</td>
      <td className="border-x-2 p-3">{budgetItem.accumulates}</td>
      <td className="border-x-2 p-3">{budgetItem.budget_item?.code}</td>
    </tr>
  ))

  return (
    <>
      <table className="mx-auto mt-2 table-auto">
        <caption className="mb-5">
          <div className="flex items-center justify-between">
            <h1 className="pb-5 text-2xl font-semibold uppercase">
              {" "}
              Budget Items
            </h1>
            <PrimaryButton
              buttonType="button"
              text="Add"
              onEvent={() => {
                setSelectedBudgetItem(undefined)
                setShowModalInfo(true)
              }}
            />
          </div>
        </caption>
        <thead className="border-b-2 border-black bg-light font-bold">
          <tr>
            <th className="p-3 text-center">Code</th>
            <th className="p-3 text-center">Name</th>
            <th className="p-3 text-center">Level</th>
            <th className="p-3 text-center">Accumulates</th>
            <th className="p-3 text-center">Parent</th>
          </tr>
        </thead>
        <tbody>{budgetItemsData}</tbody>
      </table>
      {showModalInfo && (
        <Modal
          setShowModal={setShowModalInfo}
          selectedBudgetItem={selectedBudgetItem}
        />
      )}
    </>
  )
}
