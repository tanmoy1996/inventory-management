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

const AddBillForm: React.FC<Props> = ({ values, handleChange, setFieldValue, errors, touched }: Props) => {
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

  // useEffect(() => {
  //   const formatEmployees = employees.map((employee: { name: string; _id: string }) => {
  //     return {
  //       label: employee.name,
  //       value: employee._id,
  //     }
  //   })
  //   setEmployeeOptions(formatEmployees)
  // }, [employees])

  const deleteChallan = (challanNo: string) => {
    const newValues = values.challans.filter((currentChallan: any) => currentChallan.challanNo !== challanNo)
    setFieldValue('challans', newValues)
  }

  const handleProjectSelection = (selectedProject: { target: { value: string } }) => {
    const selectedProjectIndex = projects.findIndex((project) => project._id === selectedProject.target.value)
    // console.log(projects[selectedProjectIndex])
    setSelectedProject(projects[selectedProjectIndex])
    handleChange(selectedProject)
    handleChange({
      target: {
        name: 'client',
        value: projects[selectedProjectIndex].client._id,
      },
    })
    handleChange({
      target: {
        name: 'challans',
        value: projects[selectedProjectIndex].challans.map((challan: any) => {
          return { _id: challan._id, challanNo: challan.challanNo }
        }),
      },
    })
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
          handleChange={handleProjectSelection}
          errorMessage={touched.project ? errors.project : ''}
          loading={projectStatus === 'loading'}
        />
      </Box>
      <Box className="mb-2">
        <TextBox
          name="client"
          label={selectedProject?.client?.name || 'Client'}
          value={selectedProject?.client?.name}
          handleChange={handleChange}
          disabled={true}
          errorMessage={touched.client ? errors.client : ''}
        />
      </Box>
      <Box className="flex gap-4 mb-2">
        <TextBox
          name="invoiceNo"
          label="Bill Number"
          value={values.invoiceNo}
          handleChange={handleChange}
          errorMessage={touched.invoiceNo ? errors.invoiceNo : ''}
        />
        <UploadButton name="invoice" file={values.invoice} placeholder="Upload Bill" handleChange={handleChange} />
      </Box>
      <Box className="flex gap-4 mb-2">
        <Box className="w-full">
          <Datepicker
            name="invoiceDate"
            label="Bill Date"
            value={values.invoiceDate}
            handleChange={handleChange}
            errorMessage={touched.invoiceDate ? errors.invoiceDate : ''}
          />
        </Box>
        <TextBox
          name="totalAmount"
          label="Total Amount"
          value={values.totalAmount}
          handleChange={handleChange}
          errorMessage={touched.totalAmount ? errors.totalAmount : ''}
        />
      </Box>
      <Box className="flex gap-4 mb-2">
        <TextBox
          name="sgst"
          label="SGST"
          value={values.sgst}
          handleChange={handleChange}
          errorMessage={touched.sgst ? errors.sgst : ''}
        />
        <TextBox
          name="cgst"
          label="CGST"
          value={values.cgst}
          handleChange={handleChange}
          errorMessage={touched.cgst ? errors.cgst : ''}
        />
        <TextBox
          name="igst"
          label="IGST"
          value={values.igst}
          handleChange={handleChange}
          errorMessage={touched.igst ? errors.igst : ''}
        />
      </Box>
      <Box className="flex gap-4 mb-2">
        <TextBox
          name="roundOff"
          label="Round Off"
          value={values.roundOff}
          handleChange={handleChange}
          errorMessage={touched.roundOff ? errors.roundOff : ''}
        />
        <TextBox
          name="grossAmount"
          label="Gross Amount"
          value={values.grossAmount}
          handleChange={handleChange}
          errorMessage={touched.grossAmount ? errors.grossAmount : ''}
        />
      </Box>
      <Box>
        <Typography>Challans</Typography>
        <Box className="flex gap-2">
          {values.challans.map((challan: any, idx: number) => {
            return <Chip key={idx} label={challan.challanNo} onDelete={() => deleteChallan(challan.challanNo)} />
          })}
        </Box>
      </Box>
      <Box className="flex gap-4 mb-2">
        <Checkbox
          name="isPaymentReceived"
          label="Payment Received?"
          value={values.isPaymentReceived}
          handleChange={handleChange}
        />
      </Box>
    </form>
  )
}

export default AddBillForm
