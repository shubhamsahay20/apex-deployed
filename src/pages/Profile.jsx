import React, { useState } from "react";
import { FaEdit, FaPhone, FaEnvelope, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import userSix from "../images/user/user-06.png";
import Breadcrumb from "../components/SuperAdmin/components/Breadcrumbs/Breadcrumb";
import useProfile from "../hooks/useProfile";
import { useAuth } from "../Context/AuthContext";

const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const { user } = useAuth();
  const { profileData } = useProfile(user.accessToken);

  return (
    <>
      <Breadcrumb pageName="Profile" />

      {editMode ? (
        <div className="bg-gray-50 p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
             Edit Profile
          </h2>

          <div className="flex flex-col sm:flex-row gap-12">
            {/* Profile Image */}
            <div className="flex flex-col items-center gap-4">
              <img
                src={userSix}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
              />
              <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition">
                <FaEdit /> Change Picture
              </button>
            </div>

            {/* Form */}
            <form className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Name
                </label>
                <input
                  className="w-full border rounded-lg px-4 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Name"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Phone
                </label>
                <input
                  className="w-full border rounded-lg px-4 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue="990 32 64 970"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Email
                </label>
                <input
                  className="w-full border rounded-lg px-4 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter Email"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Location
                </label>
                <input className="w-full md:w-2/3 border rounded-lg px-4 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition w-full sm:w-auto"
                >
                   Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 relative mb-6">
          {/* Top Buttons */}
          {/* <div className="absolute top-4 right-4 flex gap-3">
            <button className="border px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition">
               Print
            </button>
            <button className="border px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition">
               PDF
            </button>
          </div> */}

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-10">
            {/* Profile Image */}
            <div className="flex flex-col items-center">
              <img
                src={userSix}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
              />
              <button
                className="mt-4 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition"
                onClick={() => setEditMode(true)}
              >
                <FaEdit /> Edit Profile
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex flex-col gap-6 w-full">
              <h2 className="text-2xl font-bold text-gray-800 border-b pb-3">
                My Profile
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3 border rounded-lg p-4 shadow-sm bg-gray-50">
                  <FaUser className="text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="text-gray-800 font-medium">{profileData?.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 border rounded-lg p-4 shadow-sm bg-gray-50">
                  <FaPhone className="text-green-600" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-gray-800 font-medium">{profileData?.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 border rounded-lg p-4 shadow-sm bg-gray-50">
                  <FaEnvelope className="text-red-600" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-gray-800 font-medium">{profileData?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 border rounded-lg p-4 shadow-sm bg-gray-50">
                  <FaMapMarkerAlt className="text-purple-600" />
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-gray-800 font-medium">{profileData?.location}</p>
                  </div>
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
