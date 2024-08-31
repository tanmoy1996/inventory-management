"use client";
import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useDebouncedValue } from "@/hooks";

interface Props {
  setSearch: (search: string) => void;
  placeholder?: string;
  width?: string;
}

const Search: React.FC<Props> = (props) => {
  const { setSearch, width = "450px", placeholder = "Search" } = props;

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300);

  useEffect(() => {
    setSearch(debouncedSearchTerm.toLocaleLowerCase());
  }, [debouncedSearchTerm]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchTerm(value);
  };

  return (
    <TextField
      placeholder={placeholder}
      margin="none"
      size="small"
      hiddenLabel
      value={searchTerm}
      onChange={handleChange}
      fullWidth
      sx={{
        minWidth: { sm: "100%", md: width },
        background: "#fff",
        borderRadius: "4px",
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchOutlinedIcon />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default Search;
