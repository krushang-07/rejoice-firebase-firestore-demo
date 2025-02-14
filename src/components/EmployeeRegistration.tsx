import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Button,
  Typography,
  Box,
  SelectChangeEvent,
  Modal,
  Container,
} from "@mui/material";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { DateRange } from "@mui/x-date-pickers-pro/models";
import dayjs, { Dayjs } from "dayjs";

import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  limit,
  startAfter,
  orderBy,
  endBefore,
  limitToLast,
  getDoc,
} from "firebase/firestore";

import EmployeeDetails from "./EmployeeDetails.tsx";
import { toast } from "react-toastify";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { database } from "../firebase/FireBase.tsx";
import BadgeIcon from "@mui/icons-material/Badge";
import { useTheme } from "@mui/material/styles";

const EmployeeRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    skills: "",
    experience: "",
    gender: "",
    joinDate: "",
    duration: "",
    agreement: false,
  });

  const theme = useTheme();

  const modalStyle = {
    maxWidth: 400,
    mx: "auto",
    p: 3,
    border: "1px solid #ccc",
    borderRadius: 2,
    boxShadow: 2,
    mt: 4,
    backgroundColor: theme.palette.background.paper,
  };

  const [employees, setEmployees] = useState<{ [key: string]: any }>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [value, setValue] = useState<DateRange<Dayjs>>([dayjs(), dayjs()]);
  const [open, setOpen] = useState(false);

  const handleDateChange = (newValue: DateRange<Dayjs>) => {
    setValue(newValue);
    setFormData((prev) => ({
      ...prev,
      joinDate: newValue[0] ? newValue[0].format("YYYY-MM-DD") : "",
      duration: newValue[1] ? newValue[1].format("YYYY-MM-DD") : "",
    }));
  };

  const handleChange = (
    e:
      | React.ChangeEvent<
          | HTMLInputElement
          | { name?: string; value: any }
          | { type: string; checked: boolean }
        >
      | SelectChangeEvent<string>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name!]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    let newErrors: { [key: string]: string } = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
      isValid = false;
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Valid email is required.";
      isValid = false;
    }
    if (!formData.role) {
      newErrors.role = "Please select a role.";
      isValid = false;
    }
    if (!formData.skills.trim()) {
      newErrors.skills = "Please enter at least one skill.";
      isValid = false;
    }
    if (!formData.experience.trim()) {
      newErrors.experience = "Please enter your experience.";
      isValid = false;
    }
    if (!formData.gender) {
      newErrors.gender = "Please select a gender.";
      isValid = false;
    }
    if (!formData.joinDate || !formData.duration) {
      newErrors.joinDate = "Please select a date range.";
      isValid = false;
    }
    if (!formData.agreement) {
      newErrors.agreement = "You must agree to the terms.";
      isValid = false;
    }

    setErrors(newErrors);
    if (!isValid) {
      console.error("Form validation errors:", newErrors);
    }
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        if (editingId) {
          // console.log("Editing document with ID:", editingId);
          const employeeRef = doc(database, "employees", editingId);
          const docSnap = await getDoc(employeeRef);
          if (docSnap.exists()) {
            await updateDoc(employeeRef, {
              ...formData,
              updatedAt: Date.now(),
            });
            toast.success("Employee Updated Successfully!");
          } else {
            toast.error("No document to update.");
          }
        } else {
          await addDoc(collection(database, "employees"), {
            ...formData,
            createdAt: Date.now(),
          });
          toast.success("Employee Registered Successfully!");
        }
        setFormData({
          name: "",
          email: "",
          role: "",
          skills: "",
          experience: "",
          gender: "",
          joinDate: "",
          duration: "",
          agreement: false,
        });
        setEditingId(null);
      } catch (error) {
        toast.error("Error processing request.");
        console.error("Error updating document:", error);
      }
    }
  };

  const lastVisibleRef = useRef<any>(null);
  const firstVisibleRef = useRef<any>(null);
  const [isFirstPage, setIsFirstPage] = useState(true);
  const [isLastPage, setIsLastPage] = useState(false);
  const itemPerPage: number = 5;

  const fetchData = async (direction = "next") => {
    let employeeQuery;

    if (direction === "next" && lastVisibleRef.current) {
      employeeQuery = query(
        collection(database, "employees"),
        orderBy("createdAt"),
        startAfter(lastVisibleRef.current),
        limit(itemPerPage)
      );
    } else if (direction === "prev" && firstVisibleRef.current) {
      employeeQuery = query(
        collection(database, "employees"),
        orderBy("createdAt"),
        endBefore(firstVisibleRef.current),
        limitToLast(itemPerPage)
      );
    } else {
      employeeQuery = query(
        collection(database, "employees"),
        orderBy("createdAt"),
        limit(itemPerPage)
      );
    }

    const querySnapshot = await getDocs(employeeQuery);

    if (!querySnapshot.empty) {
      const employeesData: { [key: string]: any } = {};
      querySnapshot.docs.forEach((doc) => {
        employeesData[doc.id] = doc.data();
      });

      setEmployees(employeesData);
      firstVisibleRef.current = querySnapshot.docs[0];
      lastVisibleRef.current =
        querySnapshot.docs[querySnapshot.docs.length - 1];

      setIsFirstPage(
        direction === "prev" && querySnapshot.docs.length < itemPerPage
      );

      setIsLastPage(querySnapshot.docs.length < itemPerPage);
    } else {
      if (direction === "next") setIsLastPage(true);
      if (direction === "prev") setIsFirstPage(true);
    }
  };

  useEffect(() => {
    fetchData("next");
  }, []);

  const handleNext = () => {
    if (!isLastPage) fetchData("next");
  };

  const handlePrev = () => {
    if (!isFirstPage) fetchData("prev");
  };

  const handleEdit = (id: string, employee: any) => {
    setEditingId(id);
    setFormData(employee);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Typography
          sx={{
            display: "flex",
            justifyContent: "center",
            fontSize: 40,
            margin: 8,
          }}
        >
          Firebase FireStore Database CRUD
        </Typography>
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "auto",
          }}
        >
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Add Employee <BadgeIcon />
          </Button>
        </Container>

        <Modal open={open} onClose={handleClose}>
          <Box sx={modalStyle}>
            <Typography
              sx={{ display: "flex", justifyContent: "center" }}
              variant="h5"
              gutterBottom
            >
              {editingId ? "Edit Employee" : "Employee Registration"}
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                margin="dense"
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                margin="dense"
              />

              <FormControl fullWidth margin="dense" error={!!errors.role}>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  label="Role"
                >
                  <MenuItem value="Developer">Developer</MenuItem>
                  <MenuItem value="Designer">Designer</MenuItem>
                  <MenuItem value="Manager">Manager</MenuItem>
                  <MenuItem value="Tester">Tester</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                error={!!errors.skills}
                helperText={errors.skills}
                margin="dense"
              />
              <TextField
                fullWidth
                label="Experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                error={!!errors.experience}
                helperText={errors.experience}
                margin="dense"
              />
              <DemoItem
                label="JoinDate-EndDate"
                sx={{ font: "revert-layer", margin: 3 }}
                component="DateRangePicker"
              >
                <DateRangePicker value={value} onChange={handleDateChange} />
              </DemoItem>

              <FormControl margin="dense" error={!!errors.gender}>
                <Typography>Gender</Typography>
                <RadioGroup
                  row
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="Male"
                    control={<Radio />}
                    label="Male"
                  />
                  <FormControlLabel
                    value="Female"
                    control={<Radio />}
                    label="Female"
                  />
                </RadioGroup>
              </FormControl>

              <FormControlLabel
                control={
                  <Checkbox
                    name="agreement"
                    checked={formData.agreement}
                    onChange={handleChange}
                  />
                }
                label="I agree to the terms"
              />
              <Typography color="error" variant="caption">
                {errors.agreement}
              </Typography>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                {editingId ? "Update Employee" : "Add to Database"}
              </Button>
            </form>
          </Box>
        </Modal>
        <EmployeeDetails employees={employees} onEdit={handleEdit} />
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button onClick={handlePrev} disabled={isFirstPage}>
            Prev
          </Button>
          <Button onClick={handleNext} disabled={isLastPage}>
            Next
          </Button>
        </Box>
      </LocalizationProvider>
    </>
  );
};

export default EmployeeRegistrationForm;
