import { DateRange } from "@mui/x-date-pickers-pro/models";
import { Dayjs } from "dayjs";

export interface Employee {
    id: string;
    name: string;
    email: string;
    role: string;
    skills: string;
    experience: string;
    joinDate: string;
    duration: string;
    gender: string;
}

export interface EmployeeDetailsProps {
    employees: Record<string, Employee>;
    onEdit: (id: string, employee: Employee) => void;
}
  
export interface FilterProps {
    filters: {
      selectedRoles: string[];
      selectedExperience: number;
      selectedDate: DateRange<Dayjs>;
    };
    setFilters: (newFilters: Partial<FilterProps["filters"]>) => void; 
  }
  