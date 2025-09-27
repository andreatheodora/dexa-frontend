"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { URL_LOGIN } from "@/constants/api";

import { useAuthTokenCheck } from "@/utils/hooks/useAuthTokenCheck";

import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const is_hr = localStorage.getItem("is_hr");
    if (token) {
      const isExpired = isTokenExpired(token);
      if (isExpired) {
        localStorage.removeItem("token");
        localStorage.removeItem("is_hr");
      } else {
        if (is_hr == true) {
          router.push("/hr-dashboard");
        } else {
          router.push("/dashboard");
        }
      }
    }
  }, []);

  function isTokenExpired(token) {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return Date.now() > payload.exp * 1000;
    } catch (error) {
      return true;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(URL_LOGIN, {
        email,
        password,
      });

      const { data } = response;

      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("is_hr", data.is_hr);
        localStorage.setItem("name", data.name);

        if (data.is_hr) {
          router.push("/hr-dashboard");
        } else {
          router.push("/dashboard");
        }
      } else {
        alert(data.error);
      }
    } catch (error) {
      if (error.response) {
        console.error("Error:", error.response.data.message);
        setError(error.response.data.message);
      } else {
        console.error("Network or other error:", error.message);
        setError("Network or other error");
      }
    }
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen px-16 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <form
          onSubmit={handleSubmit}
          className="shadow-md rounded px-12 pt-16 pb-4 flex flex-col items-center"
        >
          <div className="flex justify-center w-full mb-6">
            <img src="/dexa-logo.jpg" width={300} />
          </div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="font-mono rounded-full border border-solid border-black/[.08] mb-4 focus:outline-none flex items-center justify-center font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full"
          />
          <div className="font-mono rounded-full mb-4 border border-solid border-black/[.08] flex items-center justify-center font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="focus:outline-none w-full"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <div className="w-md flex justify-center">
            <button
              type="submit"
              onClick={handleSubmit}
              className="hover:cursor-pointer rounded-full mt-2 border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-8 sm:w-auto"
            >
              Login
            </button>
          </div>
          <h3 className="mt-8 mb-4 font-sans text-[#b22222]">{error}</h3>
        </form>
      </main>
    </div>
  );
}
