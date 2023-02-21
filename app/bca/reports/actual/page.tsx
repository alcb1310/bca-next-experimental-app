'use client'

import PrimaryButton from '@/components/Buttons/PrimaryButton'
import { SelectElement } from '@/components/Inputs'
import { ProjectType } from '@/types'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'

export default function ActualHome() {
  const [projects, setProjects] = useState<ProjectType[]>([])
  const [selectedProject, setSelectedProject] = useState<string>('')
  const [level, setLevel] = useState<number>(1)

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
      `/api/budget?project=${selectedProject}&level=${level}`
    )
  }

  const projectElement = projects.map((project) => {
    return (
      <option key={project.uuid} value={project.uuid}>
        {project.name}
      </option>
    )
  })

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
    </>
  )
}
