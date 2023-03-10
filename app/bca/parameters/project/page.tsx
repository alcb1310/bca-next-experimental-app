"use client"
import PrimaryButton from "@/components/Buttons/PrimaryButton"
import { ProjectType } from "@/types"
import { useEffect, useState } from "react"
import Modal from "./modal"

export default function ProjectsHome() {
  const [projects, setProjects] = useState<ProjectType[]>([])
  const [showModal, setShowModal] = useState<boolean>(false)
  const [selectedProject, setSelectedProject] = useState<
    ProjectType | undefined
  >(undefined)

  useEffect(() => {
    ;(async () => {
      const response = await fetch("/api/projects")
      const data = await response.json()

      setProjects(data.detail)
    })()
  }, [showModal])

  const projectsInfo = projects.map((project) => (
    <tr
      className="even:bg-indigo-50 hover:cursor-pointer hover:bg-indigo-300"
      key={project.uuid}
      onClick={() => {
        setSelectedProject(project)
        setShowModal(true)
        console.log("selected")
      }}
    >
      <td className="border-x-2 p-3">{project.name}</td>
      <td className="border-x-2 p-3">{project.is_active}</td>
    </tr>
  ))

  return (
    <>
      <table className="mx-auto mt-2 table-auto">
        <caption className="text-2xlfont-semibo pb-5 text-left uppercase">
          <h2>Projects</h2>
          <div className="text-base">
            <PrimaryButton
              buttonType="button"
              text="Add"
              onEvent={() => {
                setSelectedProject(undefined)
                setShowModal(true)
                console.log("create")
              }}
            />
          </div>
        </caption>
        <thead className="border-b-2 border-black bg-light font-bold">
          <tr>
            <th className="p-3 text-center">Name</th>
            <th className="p-3 text-center">Active</th>
          </tr>
        </thead>
        <tbody>{projectsInfo}</tbody>
      </table>
      {showModal && (
        <Modal projectData={selectedProject} setShowModal={setShowModal} />
      )}
    </>
  )
}
