export type ProjectType = {
  uuid: string
  name: string
  is_active?: boolean
}

export type ProjectCreateType = {
  uuid?: string
  name?: string
  is_active?: boolean
}
