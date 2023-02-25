'use client'
import { ErrorInterface, SupplierResponseType } from '@/types'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import PrimaryButton from '../Buttons/PrimaryButton'
import SecondaryButton from '../Buttons/SecondaryButton'
import { InputElement } from '../Inputs'
import SuccessAlert from '../SuccessAlert'

type SupplierCreate = {
  uuid?: string
  supplier_id?: string
  name?: string
  contact_name?: string
  contact_email?: string
  contact_phone?: string
}

export default function SupplierFormModal({
  supplierData,
  setShowModal,
}: {
  supplierData?: SupplierResponseType
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [supplier, setSupplier] = useState<SupplierCreate | undefined>(
    supplierData as SupplierCreate
  )
  const [error, setError] = useState<ErrorInterface | null>(null)
  const [showSuccess, setShowSuccess] = useState<boolean>(false)

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target

    setSupplier((prevSupplier) => ({ ...prevSupplier, [name]: value }))
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSuccess(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [showSuccess])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (supplier?.uuid) {
      const result = await fetch(`/api/suppliers/${supplier.uuid}`, {
        method: 'PUT',
        body: JSON.stringify(supplier),
        headers: {
          'Content-type': 'application/json',
        },
      })

      const data = await result.json()

      if ('errorStatus' in data.detail) {
        setError(data.detail)
        return
      }

      setSupplier(data.detail as SupplierCreate)
      setShowSuccess(true)
      return
    }

    const result = await fetch('/api/suppliers', {
      method: 'POST',
      body: JSON.stringify(supplier),
      headers: {
        'Content-type': 'application/json',
      },
    })

    const data = await result.json()

    if ('errorStatus' in data.detail) {
      setError(data.detail)
      return
    }

    setSupplier(data.detail as SupplierCreate)
    setShowSuccess(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
      <div className="relative my-6 mx-auto w-96 max-w-3xl">
        <div className="relative flex w-full flex-col rounded-lg border-0 bg-white px-4 shadow-lg outline-none focus:outline-none">
          {showSuccess && <SuccessAlert message="Supplier saved successfuly" />}
          <div className="flex items-end justify-end rounded-t border-b border-solid border-slate-200 py-5">
            <h2 className="text-center text-xl font-semibold">
              {supplier?.uuid ? 'Edit Supplier' : 'Add Supplier'}
            </h2>
          </div>
          <div className="mb-5">
            <form onSubmit={handleSubmit}>
              <InputElement
                label="Id"
                error={error}
                inputName="supplier_id"
                required
                inputType={'text'}
                onChange={handleChange}
                value={supplier?.supplier_id}
                enabled
              />

              <InputElement
                label="Name"
                error={error}
                inputName="name"
                required
                inputType={'text'}
                onChange={handleChange}
                value={supplier?.name}
                enabled
              />

              <InputElement
                label="Contact Name"
                error={error}
                inputName="contact_name"
                required={false}
                inputType={'text'}
                onChange={handleChange}
                value={supplier?.contact_name ? supplier.contact_name : ''}
                enabled
              />

              <InputElement
                label="Contact e-mail"
                error={error}
                inputName="contact_email"
                required={false}
                inputType={'text'}
                onChange={handleChange}
                value={supplier?.contact_email ? supplier.contact_email : ''}
                enabled
              />

              <InputElement
                label="Contact Phone"
                error={error}
                inputName="contact_phone"
                required={false}
                inputType={'text'}
                onChange={handleChange}
                value={supplier?.contact_phone ? supplier.contact_phone : ''}
                enabled
              />

              <PrimaryButton
                buttonType="submit"
                text="Save"
                onEvent={handleSubmit}
              />
              <SecondaryButton
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
