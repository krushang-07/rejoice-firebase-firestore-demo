import { Box, Slider, Typography } from "@mui/material";
import React from "react";
import Select from "react-select";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo/DemoContainer";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FilterProps } from "../types/Types";

const Filter: React.FC<FilterProps> = ({ filters, setFilters }) => {
  const options = [
    { value: "Developer", label: "Developer" },
    { value: "Designer", label: "Designer" },
    { value: "Manager", label: "Manager" },
    { value: "Tester", label: "Tester" },
  ];

  const handleRoleChange = (selectedOptions) => {
    setFilters({
      selectedRoles: selectedOptions
        ? selectedOptions.map((opt) => opt.value)
        : [],
    });
  };
  const handleExperienceChange = (_event: Event, newValue) => {
    setFilters({ selectedExperience: newValue as number });
  };

  const handleDateChange = (newDate) => {
    setFilters({ selectedDate: newDate });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <Typography
          variant="h5"
          sx={{ mb: 2, fontWeight: "bold", textAlign: "center", marginTop: 5 }}
        >
          Filter Details
        </Typography>
        <Box sx={{ width: 300, alignContent: "center" }}>
          <Typography variant="h6">Filter based on Role:</Typography>
          <Select
            isMulti
            options={options}
            closeMenuOnSelect={false}
            placeholder="Filter based on Role"
            value={options.filter((opt) =>
              filters.selectedRoles.includes(opt.value)
            )}
            onChange={handleRoleChange}
            styles={{
              control: (provided) => ({
                ...provided,
                backgroundColor: "black",
                "&:hover": {
                  backgroundColor: "black",
                  color: "black",
                },
              }),
              menu: (provided) => ({
                ...provided,
                backgroundColor: "black",
              }),
              multiValue: (provided) => ({
                ...provided,
                backgroundColor: "black",
              }),
              option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isFocused
                  ? "black"
                  : provided.backgroundColor,
                "&:hover": {
                  backgroundColor: "white",
                  color: "black",
                },
              }),
            }}
          />

          <Typography variant="h6" sx={{ mt: 2 }}>
            Filter based on Experience:
          </Typography>
          <Slider
            value={filters.selectedExperience}
            defaultValue={1}
            onChange={handleExperienceChange}
            aria-label="Experience"
            valueLabelDisplay="auto"
            step={1}
            marks
            min={1}
            max={10}
          />
          <Typography variant="h6" sx={{ mt: 1, mb: 2 }}>
            Filter based on Training Duration:
          </Typography>
          <DemoContainer components={["DateRangePicker"]}>
            <DateRangePicker
              value={filters.selectedDate}
              onChange={handleDateChange}
            />
          </DemoContainer>
        </Box>
      </div>
    </LocalizationProvider>
  );
};

export default Filter;
