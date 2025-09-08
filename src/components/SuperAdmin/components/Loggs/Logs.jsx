import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { CiCalendar } from "react-icons/ci";
import { BsDownload } from "react-icons/bs";
import { FaFilePdf } from "react-icons/fa6";
import { exportProductionPDF, printProductionPDF } from "../../../../utils/PdfModel"; 

const Logs = () => {
  const [logData] = useState([
    {
      date: "2025-08-11",
      time: "10:23 AM",
      user: { name: "John Mathew", avatar: "https://via.placeholder.com/40" },
      activity: "Logged in to the system",
    },
    {
      date: "2025-08-11",
      time: "10:45 AM",
      user: { name: "Sarah Lee", avatar: "https://via.placeholder.com/40" },
      activity: "Updated order #SO/563723",
    },
    {
      date: "2025-08-11",
      time: "11:10 AM",
      user: { name: "Mike Johnson", avatar: "https://via.placeholder.com/40" },
      activity: "Deleted warehouse record",
    },
  ]);

  return (
    <div className="p-4 bg-white rounded-md shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Logs</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="border rounded pl-8 pr-2 py-1 text-sm"
            />
            <FaSearch className="absolute left-2 top-2 text-gray-400" />
          </div>
          <div className="flex items-center border rounded px-2 py-1 text-sm">
            <CiCalendar className="mr-2" /> Filter by Date
          </div>
          <button
            onClick={() => printProductionPDF(logData)}
            className="border border-gray-300 px-4 py-2 rounded-md text-sm flex items-center gap-2"
          >
            <BsDownload /> Print
          </button>
          <button
            onClick={() => exportProductionPDF(logData)}
            className="border border-gray-300 px-4 py-2 rounded-md text-sm flex items-center gap-2"
          >
            <FaFilePdf /> PDF
          </button>
        </div>
      </div>
      <table className="w-full text-sm border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 border border-gray-200">Date & Time</th>
            <th className="p-2 border border-gray-200">User</th>
            <th className="p-2 border border-gray-200">Activity</th>
          </tr>
        </thead>
        <tbody>
          {logData.map((log, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="p-2">{`${log.date} – ${log.time}`}</td>
              <td className="p-2 flex items-center gap-2">
                <img
                  src={log.user.avatar}
                  alt={log.user.name}
                  className="w-6 h-6 rounded-full"
                />
                {log.user.name}
              </td>
              <td className="p-2">{log.activity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Logs;
