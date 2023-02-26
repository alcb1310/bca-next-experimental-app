'use client'
import PrimaryButton from '@/components/Buttons/PrimaryButton'
import { CheckboxElement, InputElement } from '@/components/Inputs'
import SuccessAlert from '@/components/SuccessAlert'
import { ErrorInterface, ProjectCreateType, ProjectType } from '@/types'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'

export default function Modal({
  projectData,
  setShowModal,
}: {
  projectData: ProjectType | undefined
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [project, setProject] = useState<ProjectCreateType | undefined>(
    projectData as ProjectCreateType
  )
  const [error, setError] = useState<ErrorInterface | null>(null)
  const [showSuccess, setShowSuccess] = useState<boolean>(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSuccess(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [showSuccess])

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value, checked } = event.target
    setProject((prevProject) => ({
      ...prevProject,
      [name]: name === 'is_active' ? checked : value,
    }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (project?.uuid) {
      const response = await fetch(`/api/projects/${project.uuid}`, {
        method: 'PUT',
        body: JSON.stringify(project),
        headers: {
          'Content-type': 'application/json',
        },
      })

      const data = await response.json()
      if ('errorStatus' in data.detail) {
        setError(data.detail)
        return
      }

      setProject(data.detail)
      setShowSuccess(true)
      return
    }
    const saveData = {
      name: project?.name,
      is_active: project?.is_active === undefined ? false : project.is_active,
    }

    const response = await fetch('/api/projects', {
      method: 'POST',
      body: JSON.stringify(saveData),
      headers: {
        'Content-type': 'application/json',
      },
    })

    const data = await response.json()
    if ('errorStatus' in data.detail) {
      setError(data.detail)
      return
    }

    setProject(data.detail)
    setShowSuccess(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
      <div className="relative my-6 mx-auto w-96 max-w-3xl">
        <div className="relative flex w-full flex-col rounded-lg border-0 bg-white px-4 shadow-lg outline-none focus:outline-none">
          {showSuccess && <SuccessAlert message="Project saved successfuly" />}
          <div className="flex items-end justify-end rounded-t border-b border-solid border-slate-200 py-5">
            <h2 className="text-center text-xl font-semibold">
              {project?.uuid ? 'Edit Project' : 'Add Project'}
            </h2>
          </div>
          <div className="mb-5">
            <form onSubmit={handleSubmit}>
              <InputElement
                label="Name"
                error={error}
                inputName="name"
                required
                inputType="text"
                onChange={handleChange}
                value={project?.name}
                enabled
              />

              <CheckboxElement
                name="is_active"
                label="Active"
                required
                checked={
                  project?.is_active === undefined ? false : project.is_active
                }
                onChange={handleChange}
                error={error}
              />

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
    </div>
  )
}
