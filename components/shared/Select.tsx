'use client'
import React from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { Box, Chip, Checkbox, Paper } from '@mui/material'
import { isArray } from 'lodash'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />
const checkedIcon = <CheckBoxIcon fontSize="small" />

interface Props {
  options: { label: string; value: string | number }[]
  setValues: (values: string | number | (string | number)[]) => void
  width?: string
  multiple?: boolean
  placeholder?: string
}

const Select: React.FC<Props> = (props) => {
  const { options, setValues, width = '150px', multiple = false, placeholder = '' } = props

  const [optionsSelected, setPptionsSelected] = React.useState<(string | number)[]>([])

  const handleChange = (
    event: React.SyntheticEvent<Element, Event>,
    objSelected: { label: string; value: string | number }[] | { label: string; value: string | number } | null,
  ) => {
    if (objSelected) {
      const res: string | number | (string | number)[] = isArray(objSelected)
        ? objSelected?.map((item: { value: string | number }) => item.value)
        : objSelected?.value
      setValues(res)
      if (multiple && isArray(res)) {
        setPptionsSelected(res)
      }
    }
  }

  return (
    <Box className="flex gap-2">
      <Autocomplete
        options={options}
        limitTags={1}
        size="small"
        popupIcon={<KeyboardArrowDownIcon />}
        sx={{ minWidth: '150px', width: { width } }}
        onChange={handleChange}
        PaperComponent={({ children }) => <Paper style={{ background: 'white' }}>{children}</Paper>}
        componentsProps={{ popper: { style: { width: 'fit-content' }, placement: 'bottom-end' } }}
        fullWidth
        getOptionLabel={(option) => option.label}
        multiple={multiple}
        disableListWrap
        disableClearable={multiple}
        disableCloseOnSelect={multiple}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            {multiple && (
              <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
            )}
            {option.label}
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            sx={{
              background: '#fff',
              borderRadius: '4px',
              '& .MuiChip-root': {
                borderRadius: 1,
              },
            }}
            margin="dense"
            placeholder={multiple && optionsSelected.length > 0 ? '' : placeholder}
            variant="outlined"
          />
        )}
        renderTags={(tagValue) => {
          return (
            <Box className="flex flex-nowrap overflow-hidden items-center" width={width}>
              {tagValue
                .filter((option, idx) => idx == 0)
                .map((option, index) => (
                  <Chip sx={{ margin: '0 2px', height: 28 }} key={index} label={option.label} />
                ))}
              {tagValue.length > 1 && <span>{`+${tagValue.length - 1}`}</span>}
            </Box>
          )
        }}
      />
    </Box>
  )
}

export default Select
