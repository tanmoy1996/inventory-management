'use client'
import React, { useEffect, useState } from 'react'
import { Box, Chip, IconButton, Typography } from '@mui/material'
import TextBox from '@/components/shared/Textbox'
import AutoCompleteServer from '@/components/shared/AutoCompleteServer'
import UploadButton from '../shared/UploadButton'
import { useAppSelector } from '@/hooks'
import { RootState } from '@/store'
import { useAppDispatch } from '@/hooks'
import { getProjects } from '@/store/slices/projects'
import Datepicker from '@/components/shared/Datepicker'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import { getEmployees } from '@/store/slices/employee'
import Checkbox from '../shared/Checkbox'
import { isObject } from 'lodash'

interface Props {
  values: any
  errors: any
  touched: any
  handleChange: any
  setFieldValue: any
}

const AddAttandanceForm: React.FC<Props> = ({ values, handleChange, setFieldValue, errors, touched }: Props) => {
  const dispatch = useAppDispatch()

  const { status: projectStatus, projects } = useAppSelector((state: RootState) => state.projects)
  // const { status: employeeStatus, employees } = useAppSelector((state: RootState) => state.employee)

  const [projectOptions, setProjectOptions] = useState<{ label: string; value: string }[]>([])
  // const [employeeOptions, setEmployeeOptions] = useState<{ label: string; value: string }[]>([])
  const [projectSearch, setProjectSearch] = useState<string>('')
  // const [employeeSearch, setEmployeeSearch] = useState<string>('')
  const [selectedProject, setSelectedProject] = useState<any>(null)

  useEffect(() => {
    dispatch(getProjects({ search: projectSearch, page: 1 }))
  }, [projectSearch])

  // useEffect(() => {
  //   dispatch(getEmployees({ search: employeeSearch, page: 1 }))
  // }, [employeeSearch])

  useEffect(() => {
    const formatProjects = projects.map((project: { workDescription: string; client: any; _id: string }) => {
      return {
        label: `${project.workDescription} , ${project.client.name}`,
        value: project._id,
      }
    })
    setProjectOptions(formatProjects)
  }, [projects])

  return (
    <form>
      <Box className="mb-2">
        <AutoCompleteServer
          options={projectOptions}
          setSearch={setProjectSearch}
          name="project"
          label="Project"
          value={values.project}
          handleChange={handleChange}
          errorMessage={touched.project ? errors.project : ''}
          loading={projectStatus === 'loading'}
        />
      </Box>
      <Box className="mb-2">
        <TextBox
          name="workDone"
          label="Work Done"
          value={values.workDone}
          handleChange={handleChange}
          errorMessage={touched.workDone ? errors.workDone : ''}
        />
      </Box>
    </form>
  )
}

export default AddAttandanceForm
