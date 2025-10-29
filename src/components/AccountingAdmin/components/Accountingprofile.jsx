import React, { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { FiTrash2 } from 'react-icons/fi';
import userSix from '../../../images/user/user-06.png';
import Breadcrumb from '../../SuperAdmin/components/Breadcrumbs/Breadcrumb';

const orderData = [
  {
    article: '301',
    requirements: 'BK ',
    size: '6X10',
    quantity: 20,
    type: 'S/H',
    customer:
      'Horem ipsum dolor sit amet, consectetur adipiscing elit......Read More',
  },
  {
    article: '401',
    requirements: 'BK ',
    size: '6X10',
    quantity: 20,
    type: 'S/H',
    customer:
      'Horem ipsum dolor sit amet, consectetur adipiscing elit......Read More',
  },
  {
    article: '422',
    requirements: 'BK ',
    size: '6X9',
    quantity: 20,
    type: 'S',
    customer:
      'Horem ipsum dolor sit amet, consectetur adipiscing elit......Read More',
  },
  {
    article: '356',
    requirements: 'BK',
    size: '8X10',
    quantity: 20,
    type: 'S',
    customer:
      'Horem ipsum dolor sit amet, consectetur adipiscing elit......Read More',
  },
  {
    article: '786',
    requirements: 'BK ',
    size: '6X9',
    quantity: 20,
    type: 'H',
    customer:
      'Horem ipsum dolor sit amet, consectetur adipiscing elit......Read More',
  },
];

const Accountingprofile = () => {
  const [editMode, setEditMode] = useState(false);

  return (
    <>
      <Breadcrumb pageName="Profile" />

      {editMode ? (
        // Edit Profile Form
        <div className="bg-gray-100 p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
          <div className="flex flex-col sm:flex-row gap-10">
            {/* Profile Image */}
            <div className="flex flex-col items-center gap-2">
              <img
                src={userSix}
                alt="Profile"
                className="w-28 h-28 rounded-full"
              />
              <button
                className="flex items-center gap-1 text-sm text-gray-700 hover:text-blue-600"
                onClick={() => setEditMode(false)}
              >
                <FaEdit /> Back to Profile
              </button>
            </div>

            {/* Profile Form */}
            <form className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Name</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  placeholder="Name"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Phone</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  defaultValue="990 32 64 970"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Email</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  placeholder="Enter Email"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Status</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  placeholder="Enter Current Status"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1 text-sm font-medium">
                  Location
                </label>
                <select className="w-full border rounded px-3 py-2">
                  <option>Choose Location</option>
                  <option>United States</option>
                  <option>India</option>
                  <option>UK</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-5 py-2 rounded mt-2"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <>
          {/* Profile View */}
          <div className="bg-white border border-gray-200 rounded shadow p-6 relative mb-6">
            <div className="absolute top-4 right-4 flex gap-2">
              <button className="border px-4 py-1 rounded text-sm hover:bg-gray-100">
                Print
              </button>
              <button className="border px-4 py-1 rounded text-sm hover:bg-gray-100">
                PDF
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="flex flex-col items-center p-4">
                <img
                  src={userSix}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-white shadow"
                />
                <button
                  className="mt-3 flex items-center text-sm text-gray-700 hover:text-blue-600"
                  onClick={() => setEditMode(true)}
                >
                  <FaEdit className="mr-1" /> Edit Profile
                </button>
              </div>

              <div className="flex flex-col gap-2 w-full">
                <h2 className="text-lg font-semibold text-black mb-2">
                  My Profile
                </h2>
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
                    <p className="text-gray-500 font-medium">
                      Sample123@gmail.com
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-40 text-black">Location</div>
                    <p className="text-gray-500 font-medium">
                      United States, Los Angeles
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-40 text-black">Status</div>
                    <p className="text-green-600 font-medium">Active</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stock Availability Table */}
          <div className="bg-white border border-gray-200 rounded shadow">
            <div className="p-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Comments As per Tally</h3>
              <div className="flex items-center gap-2">
                <button className="bg-[#007CF0] text-white border px-3 py-1 rounded text-sm hover:bg-[#0063c6]">
                  Print
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-t border-b text-gray-600">
                  <tr>
                    <th className="px-6 py-3">Article</th>
                    <th className="px-6 py-3">Comment</th>
                    <th className="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orderData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-3">{item.article}</td>
                      <td className="px-6 py-3">{item.customer}</td>
                      <td className="px-6 py-3 text-red-500 cursor-pointer">
                        <FiTrash2 />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center p-4 text-sm">
              <button className="px-3 py-1 border rounded hover:bg-gray-100">
                Previous
              </button>
              <span>Page 1 of 10</span>
              <button className="px-3 py-1 border rounded hover:bg-gray-100">
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Accountingprofile;
