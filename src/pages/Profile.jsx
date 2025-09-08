import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import userSix from "../images/user/user-06.png";
import Breadcrumb from "../components/SuperAdmin/components/Breadcrumbs/Breadcrumb";

const Profile = () => {
  const [editMode, setEditMode] = useState(false);

  return (
    <>
      <Breadcrumb pageName="Profile" />

      {editMode ? (
        <div className="bg-gray-100 p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
          <div className="flex flex-col sm:flex-row gap-10">
            <div className="flex flex-col items-center gap-2">
              <img src={userSix} alt="Profile" className="w-28 h-28 rounded-full" />
              <button className="flex items-center gap-1 text-sm text-gray-700 hover:text-blue-600">
                <FaEdit /> Edit Profile
              </button>
            </div>

            <form className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Name</label>
                <input className="w-full border rounded px-3 py-2" placeholder="Name" />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Phone</label>
                <input className="w-full border rounded px-3 py-2" defaultValue="990 32 64 970" />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Email</label>
                <input className="w-full border rounded px-3 py-2" placeholder="Enter Email" />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Status</label>
                <input className="w-full border rounded px-3 py-2" placeholder="Enter Current Status" />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1 text-sm font-medium">Location</label>
                <select className="w-1/2 border rounded px-3 py-2">
                  <option>Choose Location</option>
                  <option>United States</option>
                  <option>India</option>
                  <option>UK</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded mt-2">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded shadow p-6 relative mb-6">
          <div className="absolute top-4 right-4 flex gap-2">
            <button className="border px-4 py-1 rounded text-sm hover:bg-gray-100">Print</button>
            <button className="border px-4 py-1 rounded text-sm hover:bg-gray-100">PDF</button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex flex-col items-center p-4">
              <img src={userSix} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white shadow" />
              <button
                className="mt-3 flex items-center text-sm text-gray-700 hover:text-blue-600"
                onClick={() => setEditMode(true)}
              >
                <FaEdit className="mr-1" /> Edit Profile
              </button>
            </div>

            <div className="flex flex-col gap-2 w-full">
              <h2 className="text-lg font-semibold text-black mb-2">My Profile</h2>
              <div className="flex flex-col gap-4 text-sm">
                <div className="flex gap-4">
                  <div className="w-40 text-black">Name</div>
                  <p className="text-gray-500 font-medium">John Mathew</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-40 text-black">Phone Number</div>
                  <p className="text-gray-500 font-medium">990 32 64 970</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-40 text-black">Email Address</div>
                  <p className="text-gray-500 font-medium">Sample123@gmail.com</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-40 text-black">Location</div>
                  <p className="text-gray-500 font-medium">United States, Los Angeles</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-40 text-black">Status</div>
                  <p className="text-green-600 font-medium">Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
