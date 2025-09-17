import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FaFilePdf } from 'react-icons/fa'
import { exportSalesPDF, printSalesPDF } from '../../../../utils/PdfModel'
import { useAuth } from '../../../../Context/AuthContext'
import roleService from '../../../../api/role.service'

const RoleDetailsViewPage = () => {
  const { role, id } = useParams()
  const { user } = useAuth()
  const [userDetail, setUserDetail] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await roleService.getRoleByID(user.accessToken, id)
        console.log('response from backend', res.data)
        setUserDetail(res?.data || null)
      } catch (error) {
        console.error('Error fetching role details:', error)
      }
    }
    fetchData()
  }, [id, user.accessToken])

  return (
    <div className="bg-gray-50 min-h-screen p-8 space-y-10">
      {/* Profile Card */}
      {userDetail && (
        <div className="bg-white rounded-2xl shadow-lg p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-10 border border-gray-100">
          {/* Avatar + Info */}
          <div className="flex items-center gap-8">
            <img
              src={userDetail.image}
              alt="avatar"
              className="w-28 h-28 rounded-full object-cover shadow-lg border-2 border-gray-200"
            />
            <div>
              <h2 className="text-3xl font-bold text-gray-800 capitalize tracking-wide">
                {userDetail.role.replace(/-/g, ' ')} Details
              </h2>
              <div className="mt-5 space-y-3 text-gray-600 text-base leading-relaxed">
                <p>
                  <span className="font-semibold text-gray-700">Name:</span>{' '}
                  {userDetail.name}
                </p>
                <p>
                  <span className="font-semibold text-gray-700">Phone:</span>{' '}
                  {userDetail.phone}
                </p>
                <p>
                  <span className="font-semibold text-gray-700">Email:</span>{' '}
                  {userDetail.email}
                </p>
                <p>
                  <span className="font-semibold text-gray-700">Location:</span>{' '}
                  {userDetail.location}
                </p>
                <p>
                  <span className="font-semibold text-gray-700">Status:</span>{' '}
                  <span
                    className={`font-bold ${
                      userDetail.status === 'Active'
                        ? 'text-green-600'
                        : 'text-red-500'
                    }`}
                  >
                    {userDetail.status}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => printSalesPDF([])}
              className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition shadow-sm"
            >
              Print
            </button>
            <button
              onClick={() => exportSalesPDF([])}
              className="px-6 py-3 rounded-lg bg-red-500 text-white text-sm font-medium flex items-center gap-2 shadow-md hover:bg-red-600 transition"
            >
              <FaFilePdf /> Export PDF
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default RoleDetailsViewPage
