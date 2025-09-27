import { useState, useEffect } from "react";
import {
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
} from "react-icons/fa";

import api from "@/utils/api";
import { URL_USER, URL_SIGNUP } from "@/constants/api";
import EditEmployeeModal from "./EditEmployeeModal";
import AddEmployeeModal from "./AddEmployeeModal";

export default function EmployeeTable() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(2);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get(
          `${URL_USER}?count=${count}&page=${page}`
        );
        setLastPage(Math.ceil(response.headers["x-total-count"] / count));
        setEmployees(response.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, [showEditModal, showAddModal, page, count]);

  const handleRowClick = (employee) => {
    setSelected(employee);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelected(null);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const handleEditEmployee = async (data) => {
    try {
      await api.patch(`${URL_USER}/${selected.document_no}`, data);
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.document_no === selected.document_no ? data : emp
        )
      );
      handleCloseEditModal();
    } catch (e) {
      console.error("Failed to update employee data: ", e);
    }
  };

  const handleAddEmployee = async (form) => {
    if (form.division == "HR") {
      form.is_hr = true;
    } else {
      form.is_hr = false;
    }
    try {
      const res = await api.post(URL_SIGNUP, form);
      console.log(res.data);
      handleCloseAddModal();
    } catch (e) {
      console.error("Failed to add employee: ", e);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <button
        onClick={() => {
          setShowAddModal(true);
        }}
        className="hover:cursor-pointer px-4 flex justify-end text-[#b22222] font-bold"
      >
        + Add Employee
      </button>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Email</th>
              <th className="py-2 px-4 border-b text-left">Salary (Gross)</th>
              <th className="py-2 px-4 border-b text-left">Division</th>
              <th className="py-2 px-4 border-b text-left">Position</th>
              <th className="py-2 px-4 border-b text-left">Address</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr
                key={emp.document_no}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleRowClick(emp)}
              >
                <td className="py-2 px-4 border-b">{emp.name}</td>
                <td className="py-2 px-4 border-b">{emp.email}</td>
                <td className="py-2 px-4 border-b">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(emp.salary_gross)}
                </td>
                <td className="py-2 px-4 border-b">{emp.division}</td>
                <td className="py-2 px-4 border-b">{emp.position}</td>
                <td className="py-2 px-4 border-b">{emp.address_line1}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/**TABLE FOOTER */}
        <div className="py-2 flex flex-row items-center justify-between">
          <div>
            Showing{" "}
            <span>
              <input
                className="w-[30px] focus:outline-none"
                type="number"
                min={1}
                value={count}
                onChange={(e) => {
                  setCount(e.target.value);
                }}
              ></input>
            </span>{" "}
            per page
          </div>
          <div className="items-center flex gap-2">
            <button
              onClick={() => {
                setPage(1);
              }}
            >
              <FaAngleDoubleLeft size={18} className="hover:cursor-pointer" />
            </button>
            <button
              onClick={() => {
                if (page == 1) return;
                setPage((prev) => prev - 1);
              }}
            >
              <FaAngleLeft size={18} className="hover:cursor-pointer" />
            </button>
            <span>
              {page}/{lastPage}{" "}
            </span>
            <button
              onClick={() => {
                if (page == lastPage) {
                  setPage(1);
                  return;
                }
                setPage((prev) => prev + 1);
              }}
            >
              <FaAngleRight size={18} className="hover:cursor-pointer" />
            </button>
            <button
              onClick={() => {
                setPage(lastPage);
              }}
            >
              <FaAngleDoubleRight size={18} className="hover:cursor-pointer" />
            </button>
          </div>
        </div>

        {showEditModal && selected && (
          <EditEmployeeModal
            employee={selected}
            onClose={handleCloseEditModal}
            onSave={handleEditEmployee}
          />
        )}

        {showAddModal && (
          <AddEmployeeModal
            onClose={() => {
              setShowAddModal(false);
            }}
            onSave={handleAddEmployee}
          />
        )}
      </div>
    </>
  );
}
