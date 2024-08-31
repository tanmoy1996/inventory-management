'use client'
import React, { useEffect, useState } from 'react'
import { Box, IconButton } from '@mui/material'
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

interface Props {
  values: any
  errors: any
  touched: any
  handleChange: any
  setFieldValue: any
}

const AddChallanForm: React.FC<Props> = ({ values, handleChange, setFieldValue, errors, touched }: Props) => {
  const dispatch = useAppDispatch()

  const { status: projectStatus, projects } = useAppSelector((state: RootState) => state.projects)
  const { status: employeeStatus, employees } = useAppSelector((state: RootState) => state.employee)

  const [projectOptions, setProjectOptions] = useState<{ label: string; value: string }[]>([])
  const [employeeOptions, setEmployeeOptions] = useState<{ label: string; value: string }[]>([])
  const [projectSearch, setProjectSearch] = useState<string>('')
  const [employeeSearch, setEmployeeSearch] = useState<string>('')

  useEffect(() => {
    dispatch(getProjects({ search: projectSearch, page: 1 }))
  }, [projectSearch])

  useEffect(() => {
    dispatch(getEmployees({ search: employeeSearch, page: 1 }))
  }, [employeeSearch])

  useEffect(() => {
    const formatProjects = projects.map((project: { workDescription: string; client: any; _id: string }) => {
      return {
        label: `${project.workDescription} , ${project.client.name}`,
        value: project._id,
      }
    })
    setProjectOptions(formatProjects)
  }, [projects])

  useEffect(() => {
    const formatEmployees = employees.map((employee: { name: string; _id: string }) => {
      return {
        label: employee.name,
        value: employee._id,
      }
    })
    setEmployeeOptions(formatEmployees)
  }, [employees])

  const deleteItem = (item: any) => {
    const newValues = values.items.filter((currentItem: any) => currentItem._id !== item?._id)
    setFieldValue('items', newValues)
  }

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
      <Box className="flex gap-4 mb-2">
        <TextBox
          name="challanNo"
          label=" Challan Number"
          value={values.challanNo}
          handleChange={handleChange}
          errorMessage={touched.challanNo ? errors.challanNo : ''}
        />
        <UploadButton name="challan" file={values.challan} placeholder="Upload Challan" handleChange={handleChange} />
      </Box>
      <Box className="flex gap-4 mb-2">
        <Box className="w-full">
          <Datepicker
            name="challanDate"
            label="Challan Date"
            value={values.challanDate}
            handleChange={handleChange}
            errorMessage={touched.challanDate ? errors.challanDate : ''}
          />
        </Box>
        <AutoCompleteServer
          options={employeeOptions}
          setSearch={setEmployeeSearch}
          name="takenBy"
          label="Taken By"
          value={values.takenBy}
          handleChange={handleChange}
          errorMessage={touched.takenBy ? errors.takenBy : ''}
          loading={employeeStatus === 'loading'}
        />
      </Box>
      {/* Items Section */}
      {values.items.map((item: any, index: number) => (
        <Box key={index} className="flex items-center gap-4 mb-2">
          <TextBox
            name={`items[${index}].name`}
            label="Item"
            value={values.items[index].name}
            handleChange={handleChange}
            errorMessage=""
          />
          <Box className="w-[150px]">
            <TextBox
              name={`items[${index}].quantity`}
              label="Quantity"
              value={values.items[index].quantity}
              handleChange={handleChange}
              errorMessage=""
            />
          </Box>
          <IconButton className="w-[40px] h-[40px]" sx={{ color: '#C70039' }} onClick={() => deleteItem(item)}>
            <DeleteOutlineOutlinedIcon />
          </IconButton>
        </Box>
      ))}
      <Box className="flex gap-4 mb-2">
        <Checkbox name="isReturned" label="Return PO" value={values.isReturned} handleChange={handleChange} />
      </Box>
    </form>
  )
}

export default AddChallanForm
