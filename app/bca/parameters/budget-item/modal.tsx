"use client"

import PrimaryButton from "@/components/Buttons/PrimaryButton"
import {
  CheckboxElement,
  InputElement,
  SelectElement,
} from "@/components/Inputs"
import SuccessAlert from "@/components/SuccessAlert"
import { BudgetItemResponseType, ErrorInterface } from "@/types"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"

type BudgetItemCreateType = {
  uuid?: string
  code?: string
  name?: string
  accumulates?: boolean
  level?: number
  parentUuid?: string
}

export default function Modal({
  selectedBudgetItem,
  setShowModal,
}: {
  selectedBudgetItem?: BudgetItemResponseType
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [budgetItem, setBudgetItem] = useState<
    BudgetItemCreateType | undefined
  >(
    selectedBudgetItem === undefined
      ? undefined
      : {
          uuid: selectedBudgetItem.uuid,
          code: selectedBudgetItem.code,
          name: selectedBudgetItem.name,
          accumulates: selectedBudgetItem.accumulates,
          level: selectedBudgetItem.level,
          parentUuid: selectedBudgetItem.budget_item?.uuid,
        }
  )
  const [error, setError] = useState<ErrorInterface | null>(null)
  const [showSuccess, setShowSuccess] = useState<boolean>(false)
  const [parentBudgetItems, setParentBudgetItems] = useState<
    BudgetItemResponseType[]
  >([])

  useEffect(() => {
    ;(async () => {
      const response = await fetch("/api/budget-items?accumulates=true")
      const data = await response.json()

      setParentBudgetItems(data.detail)
    })()

    const timer = setTimeout(() => {
      setShowSuccess(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [showSuccess])

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value, checked } = event.target

    let savedValue: any = value

    if (name === "level") savedValue = parseInt(value, 0)

    setBudgetItem((prevBudgetItem) => ({
      ...prevBudgetItem,
      [name]: name !== "accumulates" ? savedValue : checked,
    }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (budgetItem?.uuid) {
      const response = await fetch(`/api/budget-items/${budgetItem.uuid}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(budgetItem),
      })

      const data = await response.json()
      if ("errorStatus" in data.detail) {
        setError(data.detail)
        return
      }

      setBudgetItem({
        uuid: data.detail.uuid,
        code: data.detail.code,
        name: data.detail.name,
        accumulates: data.detail.accumulates,
        level: data.detail.level,
        parentUuid: data.detail.budget_item?.uuid,
      })

      setShowSuccess(true)
      return
    }

    const createData = {
      uuid: budgetItem?.uuid,
      code: budgetItem?.code,
      name: budgetItem?.name,
      level: budgetItem?.level,
      accumulates:
        budgetItem?.accumulates === undefined ? false : budgetItem.accumulates,
      parentUuid: budgetItem?.parentUuid,
    }

    const response = await fetch("/api/budget-items", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(createData),
    })

    const data = await response.json()

    if ("errorStatus" in data.detail) {
      setError(data.detail)
      return
    }

    setBudgetItem({
      uuid: data.detail.uuid,
      code: data.detail.code,
      name: data.detail.name,
      accumulates: data.detail.accumulates,
      level: data.detail.level,
      parentUuid: data.detail.budget_item?.uuid,
    })
    setShowSuccess(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
      <div className="relative my-6 mx-auto w-96 max-w-3xl">
        <div className="relative flex w-full flex-col rounded-lg border-0 bg-white px-4 shadow-lg outline-none focus:outline-none">
          {showSuccess && (
            <SuccessAlert message="Budget Item saved successfuly" />
          )}
          <div className="flex items-end justify-end rounded-t border-b border-solid border-slate-200 py-5">
            <h2 className="text-center text-xl font-semibold">
              {budgetItem?.uuid ? "Edit Budget Item" : "Add Budget Item"}
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="mb-5">
            <InputElement
              label="Code"
              error={error}
              inputName="code"
              required
              inputType="text"
              onChange={handleChange}
              value={budgetItem?.code}
              enabled
            />

            <InputElement
              label="Name"
              error={error}
              inputName="name"
              required
              inputType="text"
              onChange={handleChange}
              value={budgetItem?.name}
              enabled
            />

            <InputElement
              label="Level"
              error={error}
              inputName="level"
              required
              inputType="number"
              onChange={handleChange}
              value={budgetItem?.level}
              enabled
            />

            <CheckboxElement
              name="accumulates"
              label="Accumulates"
              required
              checked={budgetItem?.accumulates ? budgetItem.accumulates : false}
              onChange={handleChange}
              error={error}
            />

            <SelectElement
              label="Parent"
              error={error}
              inputName="parentUuid"
              required={false}
              value={budgetItem?.parentUuid}
              onChange={handleChange}
            >
              {parentBudgetItems.map((item) => (
                <option key={item.uuid} value={item.uuid}>
                  {item.name}
                </option>
              ))}
            </SelectElement>

            <PrimaryButton
              buttonType="button"
              text="Submit"
              onEvent={handleSubmit}
            />
            <PrimaryButton
              buttonType="button"
              text="Close"
              onEvent={() => setShowModal(false)}
            />
          </form>
        </div>
      </div>
    </div>
  )
}
