"use client";
import { FiList, FiLogOut, FiChevronDown, FiUsers } from "react-icons/fi";
import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { useAuthTokenCheck } from "@/utils/hooks/useAuthTokenCheck";

import AttendanceTable from "../components/AttendanceTable";
import EmployeeTable from "../components/EmployeeTable";

export const Space = ({ width = 4 }) => (
  <span style={{ display: "inline-block", width }} />
);

export default function HRDashboard() {
  const [activeTab, setActiveTab] = useState("ATTENDANCE");
  const [today, setToday] = useState("");
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [pageNo, setPageNo] = useState(1);
  const router = useRouter();

  useAuthTokenCheck();

  useEffect(() => {
    const date = new Date();
    const formattedDate = date.toLocaleDateString("id-ID");
    setToday(formattedDate);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("is_hr");
    router.push("/");
  };

  return (
    <>
      {/*HEADER*/}
      <div>
        <div className="font-mono flex justify-end">
          <button
            className="hover:cursor-pointer flex items-center space-x-2 px-8 py-4"
            onClick={handleLogout}
          >
            <FiLogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
        <div className="font-mono w-full flex justify-center mt-12 mb-10">
          <span style={{ fontSize: 40 }}>HR Dashboard</span>
        </div>
      </div>

      {/*TABS*/}
      <div className="font-mono flex flex-row w-4xl mx-auto justify-around">
        <button
          className="flex items-center space-x-2 hover:cursor-pointer"
          style={{
            color: activeTab === "ATTENDANCE" ? "#B22222" : "black",
            fontWeight: activeTab === "ATTENDANCE" ? 700 : 400,
          }}
          onClick={() => {
            setActiveTab("ATTENDANCE");
          }}
        >
          <FiList size={20} />
          <span>Attendance</span>
        </button>
        <button
          className="flex items-center space-x-2 hover:cursor-pointer"
          style={{
            color: activeTab === "EMPLOYEES" ? "#B22222" : "black",
            fontWeight: activeTab === "EMPLOYEES" ? 700 : 400,
          }}
          onClick={() => {
            setActiveTab("EMPLOYEES");
          }}
        >
          <FiUsers size={20} />
          <span>Employees</span>
        </button>
      </div>

      {/*ATTENDANCE TAB */}
      {activeTab == "ATTENDANCE" && (
        <div className="font-mono w-full flex flex-col items-center">
          <div className="relative inline-flex items-center my-8">
            <span style={{ fontSize: 24 }}>{startDate ?? today}</span>
            {endDate && (
              <span style={{ fontSize: 24 }}>
                <Space width={8} />-<Space width={8} />
                {endDate}
              </span>
            )}

            <button
              className="hover:cursor-pointer mx-4 hover:text-[#B22222]"
              onClick={() => {
                setShowDateFilter((prev) => !prev);
              }}
            >
              <FiChevronDown size={20} />
            </button>

            {/* Dropdown panel */}
            {showDateFilter && (
              <div className="absolute top-full left-1/2 transform -translate-x-[40px] mt-2 flex flex-col gap-2 py-4 px-4 text-sm text-black/[.8] font-mono rounded-lg shadow-md w-[300px] bg-white z-10">
                <span>Start date</span>
                <input
                  type="date"
                  onChange={(e) => {
                    const formattedDate = new Date(
                      e.target.value
                    ).toLocaleDateString("id-ID");
                    setStartDate(formattedDate);
                  }}
                  className="mb-2 rounded-lg p-1 border border-black/[.08]"
                />
                <span>End date</span>
                <input
                  type="date"
                  onChange={(e) => {
                    const formattedDate = new Date(
                      e.target.value
                    ).toLocaleDateString("id-ID");
                    setEndDate(formattedDate);
                  }}
                  className="rounded-lg p-1 border border-black/[.08]"
                />
                <div className="flex gap-2 mt-2 justify-end">
                  <button
                    onClick={() => {
                      setStartDate(null);
                      setEndDate(null);
                      setShowDateFilter(false);
                    }}
                  >
                    <span className="border border-black/[.08] rounded-lg px-2 py-1 hover:bg-gray-100">
                      Cancel
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setShowDateFilter(false);
                    }}
                  >
                    <span className="bg-black text-white rounded-lg px-2 py-1">
                      Go
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
          <AttendanceTable />
        </div>
      )}

      {/*EMPLOYEES TAB */}
      {activeTab == "EMPLOYEES" && (
        <>
          <div className="font-mono w-full flex flex-col">
            <div className="mx-auto flex flex-col gap-2 my-8 w-6xl">
              <EmployeeTable />
            </div>
          </div>
        </>
      )}
    </>
  );
}
