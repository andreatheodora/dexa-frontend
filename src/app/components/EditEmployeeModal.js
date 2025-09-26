import { useState } from "react";
import { FiTrash } from "react-icons/fi";
import api from "@/utils/api";
import { URL_USER } from "@/constants/api";

export default function EditEmployeeModal({ employee, onClose, onSave }) {
  const [form, setForm] = useState({
    salary_gross: employee.salary_gross ?? 0,
    address_line1: employee.address_line1 ?? "",
    position: employee.position ?? "",
    division: employee.division ?? "",
    ...employee,
  });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  const handleDeleteUser = async () => {
    try {
      await api.delete(`${URL_USER}/${form.document_no}`);
      console.log("Deleted user ", form.document_no);
      setShowDeleteConfirmation(false);
      onClose();
    } catch (e) {
      console.error("Error deleted user:", e);
      setShowDeleteConfirmation(false);
      onClose();
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-20">
        <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
          <div className="flex flex-row justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Edit Employee</h2>
            <button
              className="flex justify-center items-center hover:cursor-pointer"
              onClick={() => {
                setShowDeleteConfirmation(true);
              }}
            >
              <FiTrash size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label>
              Name
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-2 border border-black rounded"
              />
            </label>
            <label>
              Email
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </label>
            <label>
              Division
              <select
                name="division"
                value={form.division}
                onChange={handleChange}
                className="w-full p-2 border rounded appearance-none bg-transparent h-12"
              >
                <option value="">Select division</option>
                <option value="HR">HR</option>
                <option value="RND">RND</option>
                <option value="IT">IT</option>
                <option value="ACCOUNTING">ACCOUNTING</option>
                <option value="OPERATIONS">OPERATIONS</option>
              </select>
            </label>
            <label>
              Position
              <select
                name="position"
                value={form.position}
                onChange={handleChange}
                className="w-full p-2 border rounded appearance-none bg-transparent h-12"
              >
                <option value="">Select position</option>
                <option value="EMPLOYEE">EMPLOYEE</option>
                <option value="MANAGER">MANAGER</option>
              </select>
            </label>
            <label>
              Salary (Gross)
              <input
                name="salary_gross"
                type="number"
                value={form.salary_gross}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </label>
            <label>
              Address
              <input
                name="address_line1"
                value={form.address_line1}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </label>

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="border border-black/[.08] rounded-lg px-2 py-1 hover:bg-gray-100 hover:cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-black/[.8] text-white rounded-lg px-2 py-1 hover:bg-black/[.6] hover:cursor-pointer"
              >
                Save
              </button>
            </div>
          </form>
        </div>

        {showDeleteConfirmation && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-20">
            <div className="items-center flex flex-col gap-4 bg-white p-6 rounded-lg shadow-lg w-[500px] z-30">
              <h2 className="text-lg font-bold text-[#b22222]">
                Delete Employee
              </h2>
              <span className="text-center">
                Are you sure to delete this employee?
              </span>
              <div className="flex gap-4 flex-row">
                <button
                  onClick={handleDeleteUser}
                  className="border border-black/[.08] rounded-lg px-5 py-1 hover:bg-gray-100 hover:cursor-pointer"
                >
                  Yes
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirmation(false);
                  }}
                  className="bg-black/[.8] text-white rounded-lg px-5 py-1 hover:bg-black/[.6] hover:cursor-pointer"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
