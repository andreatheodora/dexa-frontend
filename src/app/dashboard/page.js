"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import api from "../../utils/api";
import {
  URL_CHECK_STATUS,
  URL_TAP_IN,
  URL_TAP_OUT,
  URL_UPLOAD,
} from "@/constants/api";

import { FaCamera } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useAuthTokenCheck } from "@/utils/hooks/useAuthTokenCheck";
import { months, dayNames } from "@/constants/string";

export default function Dashboard() {
  const [isWorking, setIsWorking] = useState(false);
  // const [tapInTime, setTapInTime] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [displayDate, setDisplayDate] = useState("");
  const [dayComplete, setDayComplete] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setFirstName(localStorage.getItem("name").split(" ")[0]);
  }, []);

  useAuthTokenCheck();

  const today = new Date();
  const day = dayNames[today.getDay()];
  const date = today.getDate();
  const month = today.getMonth();
  const year = today.getFullYear();
  useEffect(() => {
    setDisplayDate(`${date} ${months[month]} ${year}`);
  }, []);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const { data } = await api.get(URL_CHECK_STATUS);
        console.log(data);
        if (data.status === "IN") {
          setIsWorking(true);
          //setTapInTime(new Date(data.tap_in_time));
          const elapsed = Math.floor(
            (new Date() - new Date(data.tap_in_time)) / 1000
          );
          setSeconds(elapsed);
        }

        if (data.tap_out_time) {
          setDayComplete(true);
        }
      } catch (e) {
        console.error(e.response?.data?.message || e.message);
      }
    };

    fetchAttendanceData();
  }, []);

  useEffect(() => {
    if (isWorking) {
      const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [isWorking]);

  const handleTap = async () => {
    const action = isWorking ? "OUT" : "IN";
    const url = action === "IN" ? URL_TAP_IN : URL_TAP_OUT;
    try {
      const { data } = await api.get(url, { action });
      if (action === "IN") {
        setIsWorking(true);
        //setTapInTime(new Date(data.timestamp));
        setSeconds(0);
      } else {
        setIsWorking(false);
        setDayComplete(true);
        //setTapInTime(null);
        setSeconds(0);
      }
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  // Format time as hh:mm:ss
  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const handleFileChange = (e) => {
    const newFile = e.target.files[0];
    if (newFile) {
      setFile(newFile);
      setShowUploadModal(true);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(newFile);
    }
  };

  const handleCancelImage = () => {
    setFile(null);
    setPreview(null);
    setShowUploadModal(false);
  };

  const handleUploadImage = async () => {
    const formData = new FormData();

    setLoading(true);
    try {
      formData.append("file", file);
      const response = await api.post(URL_UPLOAD, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setLoading(false);
      setPreview(null);
      setFile(null);
      setShowUploadModal(false);
      console.log("Upload successful: ", response.data);
    } catch (e) {
      setLoading(false);
      console.error("Upload failed: ", e.response?.data || e.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("is_hr");
    localStorage.removeItem("name");
    router.push("/");
  };

  return (
    <div className="h-screen">
      <div className="font-mono flex flex-row justify-between">
        <span className="px-8 py-4 text-sm">Hello, {firstName}</span>
        <button
          className="hover:cursor-pointer flex items-center space-x-2 px-8 py-4"
          onClick={handleLogout}
        >
          <FiLogOut size={18} />
          <span className="text-sm">Logout</span>
        </button>
      </div>
      <div className="font-mono flex flex-col items-center justify-between h-[90vh] py-12">
        <div className="flex flex-col gap-2 text-center justify-center">
          <h3>{day.toUpperCase()}</h3>
          <h2>{displayDate}</h2>
        </div>

        {!dayComplete && (
          <>
            <h2 style={{ fontSize: 124 }}>
              {isWorking ? formatTime(seconds) : "00:00:00"}
            </h2>

            <button
              type="submit"
              onClick={handleTap}
              style={{ fontSize: 24, fontWeight: 180 }}
              className="hover:cursor-pointer font-sans rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] px-15 py-4 sm:w-auto"
            >
              {isWorking ? "End Workday" : "Start Workday"}
            </button>
          </>
        )}

        {dayComplete && <h2 style={{ fontSize: 64 }}>Day complete!</h2>}

        <div className="mt-6">
          <input
            id="fileUpload"
            type="file"
            disabled={dayComplete}
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          {!file && !dayComplete && (
            <button
              onClick={() => fileInputRef.current.click()}
              className="hover:cursor-pointer bg-white flex gap-4 text-red-700 font-bold py-2 px-4"
            >
              <span style={{ marginTop: "4px" }}>Upload Proof</span>
              <FaCamera size={28} />
            </button>
          )}
        </div>

        {file && showUploadModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-20">
            <div className="bg-white rounded-lg p-6 shadow-lg w-[400px] z-30">
              <div className="font-bold justify-center flex mb-4 text-lg ">
                Upload Image
              </div>
              <div>
                <img
                  src={preview}
                  className="w-[400px] h-[300px] border-black/[.08] object-contain rounded-md border"
                />
              </div>
              <div className="flex justify-end gap-4 mt-5">
                <button
                  onClick={handleCancelImage}
                  className="border border-black/[.08] rounded-lg px-3 h-10 hover:bg-gray-100 hover:cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUploadImage}
                  className="rounded-lg px-3 h-10 bg-black text-white hover:bg-black/[.7] hover:cursor-pointer"
                >
                  {loading && (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 010 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                      ></path>
                    </svg>
                  )}
                  <span>{loading ? "" : "Confirm"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
