import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Button,
  Modal,
  IconButton,
  TextField,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

import { toast } from "react-toastify";

import Filter from "../utils/Filter.tsx";
import { EmployeeDetailsProps } from "../types/Types.ts";
import { DateRange } from "@mui/x-date-pickers-pro/models";
import dayjs, { Dayjs } from "dayjs";
import { database } from "../firebase/FireBase.tsx";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import { useTheme } from "@mui/material/styles";
import { useEffect } from "react";
import { deleteDoc, doc } from "firebase/firestore";
// import AdComponent from "../components/AdComponent.tsx"; // Import the Ad Component

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({
  employees,
  onEdit,
}) => {
  const [filters, setFilters] = useState({
    selectedRoles: [] as string[],
    selectedExperience: 10,
    selectedDate: [
      dayjs("2024-11-01"),
      dayjs("2025-11-30"),
    ] as DateRange<Dayjs>,
    searchName: "",
  });
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(database, "employees", id));
      toast.success("Employee deleted successfully!");
    } catch (error) {
      console.error(error);

      toast.error("Error deleting employee.");
    }
  };

  const handleSearch = (e) => {
    setFilters((prev) => ({ ...prev, searchName: e.target.value }));
  };

  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);

  useEffect(() => {
    if (employees) {
      const filteredEmployeesData = Object.entries(employees)
        .map(([id, emp]) => ({ ...(emp as any), id }))
        .filter((emp) => {
          const empExperience = parseInt(emp.experience, 10);
          const roleMatch =
            filters.selectedRoles.length === 0 ||
            filters.selectedRoles.includes(emp.role);
          const experienceMatch =
            filters.selectedExperience === 0 ||
            empExperience <= filters.selectedExperience;
          const dateMatch =
            (!filters.selectedDate[0] ||
              dayjs(emp.joinDate).isAfter(filters.selectedDate[0])) &&
            (!filters.selectedDate[1] ||
              dayjs(emp.joinDate).isBefore(filters.selectedDate[1]));
          const nameMatch = emp.name
            .toLowerCase()
            .includes(filters.searchName.toLowerCase());

          return roleMatch && experienceMatch && dateMatch && nameMatch;
        });
      setFilteredEmployees(filteredEmployeesData);
    }
  }, [filters, employees]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const modalStyle = {
    position: "absolute",
    top: "50%",
    right: "10%",
    transform: "translateY(-50%)",
    maxWidth: 400,
    p: 3,
    border: "1px solid #ccc",
    borderRadius: 2,
    boxShadow: 2,
    backgroundColor: theme.palette.background.paper,
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1, sortable: false },
    { field: "email", headerName: "Email", flex: 1, sortable: false },
    { field: "role", headerName: "Role", flex: 1, sortable: false },
    { field: "skills", headerName: "Skills", flex: 1, sortable: false },
    { field: "experience", headerName: "Experience", flex: 1 },
    { field: "gender", headerName: "Gender", flex: 1, sortable: false },
    { field: "joinDate", headerName: "Join Date", flex: 1 },
    { field: "duration", headerName: "Duration", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <>
          <IconButton
            color="primary"
            onClick={() => handleEditClick(params.row.id, params.row)}
            sx={{ mx: 0.5 }}
          >
            <Edit />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDelete(params.row.id)}
            sx={{ mx: 0.5 }}
          >
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  const handleEditClick = (id: string, employee: any) => {
    console.log("Edit button clicked for ID:", id); // Add logging
    onEdit(id, employee);
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <Container
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "auto",
          }}
        >
          <Container sx={{ padding: 5 }}>
            <SearchIcon sx={{ padding: 2 }} />
            <TextField
              label="Search by Name"
              variant="outlined"
              value={filters.searchName}
              onChange={handleSearch}
              sx={{ mr: 2 }}
            />
          </Container>

          <Button
            style={{ borderRadius: "80px" }}
            variant="contained"
            color="primary"
            onClick={handleOpen}
          >
            <FilterListIcon sx={{ color: "white" }} />
          </Button>
        </Container>
        <Modal open={open} onClose={handleClose}>
          <Box sx={modalStyle}>
            <Filter
              filters={filters}
              setFilters={(newFilters) =>
                setFilters((prev) => ({ ...prev, ...newFilters }))
              }
            />
          </Box>
        </Modal>

        <Box sx={{ margin: 2, height: "auto" }}>
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              fontWeight: "bold",
              textAlign: "center",
              color: "primary.main",
            }}
          >
            Employee List
          </Typography>

          <Box sx={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={filteredEmployees}
              columns={columns}
              pageSizeOptions={[]}
            />
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default EmployeeDetails;
