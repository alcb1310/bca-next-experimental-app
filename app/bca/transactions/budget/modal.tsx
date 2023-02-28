"use client"
import PrimaryButton from "@/components/Buttons/PrimaryButton"
import { InputElement, SelectElement } from "@/components/Inputs"
import { returnTwoDigitFormattedNumber } from "@/helpers"
import {
  BudgetFormattedResponseType,
  BudgetItemResponseType,
  ProjectType,
} from "@/types"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"

async function getProjects() {
  const response = await fetch("/api/projects?active=true")
  return await response.json()
}

async function getBudgetItems() {
  const response = await fetch("/api/budget-items?accumulates=false")
  return await response.json()
}

type BudgetData = {
  uuid?: string
  project?: string
  budgetItem?: string
  quantity?: number
  cost?: number
}

export default function Modal({
  budget,
  setShowModal,
}: {
  budget?: BudgetFormattedResponseType
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [projects, setProjects] = useState<ProjectType[]>([])
  const [budgetItems, setBudgetItems] = useState<BudgetItemResponseType[]>([])
  const [budgetToSave, setBudgetToSave] = useState<BudgetData | undefined>(
    undefined
  )
  const [total, setTotal] = useState<number | undefined>(undefined)

  useEffect(() => {
    ;(async () => {
      const [projectsResponse, budgetItemsResponse] = await Promise.all([
        getProjects(),
        getBudgetItems(),
      ])

      setProjects(projectsResponse.detail)
      setBudgetItems(budgetItemsResponse.detail)
    })()

    setBudgetToSave({
      uuid: budget?.uuid,
      project: budget?.project.uuid,
      budgetItem: budget?.budgetItem.uuid,
      quantity: budget?.to_spend_quantity,
      cost: budget?.to_spend_cost,
    })
    totalSaver()
  }, [])

  function totalSaver() {
    if (!budgetToSave?.quantity || !budgetToSave.cost) {
      setTotal(undefined)
      return
    }

    setTotal(budgetToSave?.quantity * budgetToSave?.cost)
  }

  useEffect(() => {
    totalSaver()
  }, [budgetToSave?.quantity, budgetToSave?.cost])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    let savedValue: unknown = value

    if (name === "quantity" || name === "cost") {
      savedValue = parseFloat(value)
      if (Number.isNaN(savedValue)) return
    }

    setBudgetToSave((prev) => ({ ...prev, [name]: savedValue }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
      <div className="relative my-6 mx-auto w-1/2 max-w-3xl">
        <div className="relative flex w-full flex-col rounded-lg border-0 bg-white px-4 shadow-lg outline-none focus:outline-none">
          {/* Show success message*/}
          <div className="flex items-end justify-end rounded-t border-b border-solid border-slate-200 py-5">
            <h2 className="text-center text-xl font-semibold">
              {budgetToSave?.uuid ? "Edit Budget" : "Add Budget"}
            </h2>
          </div>
          <div className="my-5">
            <form onSubmit={handleSubmit}>
              <SelectElement
                label="Projects"
                error={null}
                inputName="project"
                required
                value={budgetToSave?.project}
                onChange={handleChange}
              >
                {projects.map((project) => (
                  <option key={project.uuid} value={project.uuid}>
                    {project.name}
                  </option>
                ))}
              </SelectElement>

              <SelectElement
                label="Budget Item"
                error={null}
                inputName="budgetItem"
                required
                value={budgetToSave?.budgetItem}
                onChange={handleChange}
              >
                {budgetItems.map((bI) => (
                  <option key={bI.uuid} value={bI.uuid}>
                    {bI.name}
                  </option>
                ))}
              </SelectElement>

              <InputElement
                label="Quantity"
                error={null}
                inputName="quantity"
                required
                inputType={"number"}
                value={budgetToSave?.quantity}
                onChange={handleChange}
                enabled
              />

              <InputElement
                label="Cost"
                error={null}
                inputName="cost"
                required
                inputType={"number"}
                onChange={handleChange}
                value={budgetToSave?.cost}
                enabled
              />

              <InputElement
                label="Total"
                error={null}
                inputName="total"
                required
                inputType={"text"}
                onChange={undefined}
                value={returnTwoDigitFormattedNumber(total)}
                enabled={false}
              />

              <PrimaryButton
                buttonType="submit"
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
    </div>
  )
}
