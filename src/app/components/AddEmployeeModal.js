import { useState } from "react";

import api from "@/utils/api";
import { useRouter } from "next/navigation";

import { URL_SIGNUP } from "@/constants/api";

export default function AddEmployeeModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    salary_gross: 0,
    position: "",
    division: "",
    address_line1: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <>
      <div className="font-mono fixed inset-0 flex items-center justify-center bg-black/40 z-20">
        <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
          <h2 className="text-lg font-bold mb-4">New Employee</h2>
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
              Password
              <input
                name="password"
                value={form.password}
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
      </div>
    </>
  );
}
