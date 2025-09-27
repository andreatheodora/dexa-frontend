import { useEffect, useState } from "react";
import { FaImage } from "react-icons/fa";
import { supabase } from "@/utils/supabaseClient";
import api from "@/utils/api";

import { URL_ATTENDANCE } from "@/constants/api";

export default function AttendanceTable({ date, month, year, userDocNo }) {
  const [data, setData] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          `${URL_ATTENDANCE}?year=${year}&month=${month}&date=${date}&user_document_no=${userDocNo}`
        );

        const newData = response.data.map((item) => {
          const date = `${item.date}/${item.month}/${item.year}`;

          const tapIn = new Date(item.tap_in).toLocaleTimeString();
          let tapOut = "";
          if (item.tap_out) {
            tapOut = new Date(item.tap_out).toLocaleTimeString();
          }

          return {
            name: item.name,
            date: date,
            tap_in: tapIn,
            tap_out: tapOut,
            image_url: item.image_url ?? null,
          };
        });
        setData(newData);
      } catch (e) {
        console.error("Failed to fetch attendance data: ", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  async function getImageUrl(path) {
    if (path) {
      try {
        const { data } = supabase.storage.from("dexa-intv").getPublicUrl(path);

        setImageUrl(data.publicUrl);
      } catch (e) {
        console.log(`Failed getting image url: ${e}`);
        console.error(e);
      }
    }
  }

  if (loading) return <p> Loading...</p>;

  return (
    <div className="w-6xl">
      <div className="flex flex-row items-start mb-4">
        <input
          placeholder="Search employee"
          className="w-[300px] p-2 border border-black/[.1] focus:outline-none rounded-lg text-sm px-4"
        ></input>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Date</th>
              <th className="py-2 px-4 border-b text-left">Tap In</th>
              <th className="py-2 px-4 border-b text-left">Tap Out</th>
              <th className="py-2 px-4 border-b text-left w-[15px]">Image</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx}>
                <td className="py-2 px-4 border-b">{item.name}</td>
                <td className="py-2 px-4 border-b">{item.date}</td>
                <td className="py-2 px-4 border-b">{item.tap_in}</td>
                <td className="py-2 px-4 border-b">{item.tap_out || "-"}</td>
                <td className="border-t border-b">
                  <div className="flex justify-center">
                    <button
                      onClick={() => {
                        getImageUrl(item.image_url);
                        setShowImageModal(true);
                      }}
                      className="flex items-center gap-2 px-1 py-1 hover:cursor-pointer"
                    >
                      <FaImage size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showImageModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-20">
          <div className="bg-white rounded-lg p-6 shadow-lg z-30">
            <div className="font-bold justify-center flex mb-4 text-lg ">
              Attendance Proof
            </div>
            <div className="w-[400px] h-[300px] rounded-md border border-black/[.08]">
              {imageUrl && (
                <img
                  src={imageUrl}
                  className="object-contain rounded-md h-full"
                />
              )}

              {!imageUrl && (
                <div className="flex justify-center items-center h-full">
                  No image uploaded.
                </div>
              )}
            </div>
            <div className="flex justify-end mt-2">
              <button
                onClick={() => {
                  setShowImageModal(false);
                  setImageUrl(null);
                }}
                className="bg-black/[.8] text-white rounded-lg px-2 py-1 hover:bg-black/[.6] hover:cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
