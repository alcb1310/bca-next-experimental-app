'use client'

import PrimaryButton from '@/components/Buttons/PrimaryButton'
import SupplierFormModal from '@/components/Modals/SupplierFormModal'
import { SupplierResponseType } from '@/types'
import { SetStateAction, useEffect, useState } from 'react'

export default function SupplierHome() {
  const [suppliers, setSuppliers] = useState<SupplierResponseType[]>([])
  const [showModal, setShowModal] = useState<boolean>(false)
  const [selectedSupplier, setSelectedSupplier] = useState<
    SupplierResponseType | undefined
  >(undefined)

  useEffect(() => {
    ;(async () => {
      const response = await fetch('/api/suppliers')
      const data = await response.json()
      setSuppliers(data.detail)
    })()
  }, [])

  function handleAddClick() {
    setSelectedSupplier(undefined)
    setShowModal(true)
  }

  const supplierData = suppliers.map((supplier) => (
    <tr
      className="even:bg-indigo-50 hover:bg-indigo-300"
      key={supplier.uuid}
      onClick={() => {
        setSelectedSupplier(supplier)
        setShowModal(true)
      }}
    >
      <td className="border-x-2 p-3">{supplier.supplier_id}</td>
      <td className="border-x-2 p-3">{supplier.name}</td>
      <td className="border-x-2 p-3">{supplier.contact_name}</td>
      <td className="border-x-2 p-3">{supplier.contact_email}</td>
      <td className="border-x-2 p-3">{supplier.contact_phone}</td>
    </tr>
  ))

  return (
    <>
      <div className="flex justify-between">
        <h1 className="pb-5 text-left text-2xl font-semibold uppercase">
          Supplier home
        </h1>
        <PrimaryButton
          buttonType="button"
          text="Add"
          onEvent={handleAddClick}
        />
      </div>
      <table className="mx-auto mt-2 table-auto">
        <thead className="border-b-2 border-black bg-light font-bold">
          <tr>
            <th className="p-3 text-center" rowSpan={2}>
              Id
            </th>
            <th className="p-3 text-center" rowSpan={2}>
              Name
            </th>
            <th className="p-3 text-center" colSpan={3}>
              Contact
            </th>
          </tr>
          <tr>
            <th className="p-3 text-center">Name</th>
            <th className="p-3 text-center">Email</th>
            <th className="p-3 text-center">Phone</th>
          </tr>
        </thead>
        <tbody>{supplierData}</tbody>
      </table>
      {showModal && (
        <SupplierFormModal
          setShowModal={setShowModal}
          supplierData={selectedSupplier}
        />
      )}
    </>
  )
}
