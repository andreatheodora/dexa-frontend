"use client";
import "react-datepicker/dist/react-datepicker.css";

import { FiList, FiLogOut, FiChevronDown, FiUsers } from "react-icons/fi";
import { useState, useEffect } from "react";
import { months } from "@/constants/string";
import { useRouter } from "next/navigation";

import { useAuthTokenCheck } from "@/utils/hooks/useAuthTokenCheck";

import AttendanceTable from "../components/AttendanceTable";
import EmployeeTable from "../components/EmployeeTable";

export default function HRDashboard() {
  const [activeTab, setActiveTab] = useState("ATTENDANCE");
  const [dateFilter, setDateFilter] = useState("All time");
  const [showDateFilter, setShowDateFilter] = useState(false);
  const router = useRouter();
  const [tableKey, setTableKey] = useState(0);

  const [displayName, setDisplayName] = useState("");

  //filter variables
  const [date, setDate] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [pageNo, setPageNo] = useState(1);

  //current date
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentDate, setCurrentDate] = useState(new Date().getDate());

  useAuthTokenCheck();

  useEffect(() => {
    const today = new Date();
    setCurrentYear(today.getFullYear());

    setDisplayName(localStorage.getItem("name"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("is_hr");
    localStorage.removeItem("name");
    router.push("/");
  };

  const handleFilterChange = (e) => {
    console.log(e.target.value);
    if (e.target.name == "date") {
      const date = e.target.value.split("-")[2];
      const month = e.target.value.split("-")[1];
      const year = e.target.value.split("-")[0];
      setDate(date);
      setMonth(month);
      setYear(year);
      setDateFilter(`${date} ${months[month - 1]} ${year}`);
    } else if (e.target.name == "month") {
      const month = e.target.value.toString().split("-")[1];
      const year = e.target.value.toString().split("-")[0];
      console.log(e.target.value);
      setMonth(month);
      setYear(year);
      setDateFilter(`${months[month - 1]} ${year}`);
    } else if (e.target.name == "year") {
      setYear(e.target.value);
      setDateFilter(e.target.value);
    }
  };

  useEffect(() => {
    console.log(`${year} ${month} ${date}`);
  }, [year, month, date]);

  const handleResetFilter = () => {
    setDate("");
    setMonth("");
    setYear("");
    setDateFilter("All time");
    setShowDateFilter(false);
    setTableKey((prev) => prev + 1);
  };

  const handleSetFilter = () => {
    setShowDateFilter(false);
    setTableKey((prev) => prev + 1);
  };

  return (
    <>
      {/*HEADER*/}
      <div>
        <div className="font-mono flex flex-row w-full mb-4 justify-between">
          <div className="text-sm px-8 py-4">
            <span className="text-[#b22222] font-bold">HR</span>
            <span className="mx-2">| {displayName}</span>
          </div>
          <button
            className="hover:cursor-pointer flex items-center space-x-2 px-8 py-4"
            onClick={handleLogout}
          >
            <FiLogOut size={18} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/*TABS*/}
      <div className="font-mono flex flex-row w-full mx-auto justify-around">
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
            <span style={{ fontSize: 24 }}>{dateFilter}</span>
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
                <span>Date</span>
                <input
                  name="date"
                  type="date"
                  defaultValue={`${currentYear}-${currentMonth
                    .toString()
                    .padStart(2, "0")}-${currentDate}`}
                  onChange={handleFilterChange}
                  className="mb-2 rounded-lg focus:outline-none p-1 border border-black/[.08]"
                />
                <span>Month</span>
                <input
                  name="month"
                  type="month"
                  placeholder="yyyy-mm"
                  defaultValue={`${currentYear}-${currentMonth
                    .toString()
                    .padStart(2, "0")}`}
                  //onChange={handleFilterChange}
                  onBlur={handleFilterChange}
                  className="mb-2 rounded-lg focus:outline-none p-1 border border-black/[.08]"
                />
                <span>Year</span>
                <input
                  name="year"
                  type="number"
                  defaultValue={currentYear}
                  min={0}
                  onChange={handleFilterChange}
                  className="mb-2 rounded-lg focus:outline-none p-1 border border-black/[.08]"
                />
                <div className="flex gap-2 mt-2 justify-end">
                  <button onClick={handleResetFilter}>
                    <span className="border border-black/[.08] rounded-lg px-2 py-1 hover:bg-gray-100">
                      Clear
                    </span>
                  </button>
                  <button onClick={handleSetFilter}>
                    <span className="bg-black text-white rounded-lg px-2 py-1">
                      Go
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
          <AttendanceTable
            key={tableKey}
            year={year}
            month={month}
            date={date}
            userDocNo={""}
          />
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
