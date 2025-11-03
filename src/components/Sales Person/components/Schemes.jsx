import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import schemesService from '../../../api/schemes.service';
import { useAuth } from '../../../Context/AuthContext';
import { IoFilter } from 'react-icons/io5';
import { SchemeApplicationForm } from './SchemeApplicationForm';
import Loader from '../../../common/Loader'; 

const SchemeList = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [schemes, setSchemes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);


  const [loading, setLoading] = useState(false);


  useEffect(() => {
    (async () => {
      setLoading(true); 
      try {
        const res = await schemesService.getAllSchemes(
          user.accessToken,
          currentPage,
          10,
        );
        setSchemes(res.data?.schemes || []);
        setTotalPage(res.data?.pagination?.totalpages || 1);
      } catch (error) {
        toast.error(error.response?.message || 'Error fetching schemes');
      } finally {
        setLoading(false); 
      }
    })();
  }, [user, currentPage]);

  return (
    <div className="p-6 bg-white rounded-md shadow">
      <div className="bg-white p-4 rounded-xl shadow-md">
        {showForm ? (
          // Only show form
          <SchemeApplicationForm onBack={() => setShowForm(false)} />
        ) : (
          <>
           
            {loading ? (
              <Loader />
            ) : (
              <>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                    <h2 className="text-lg font-semibold">Active Schemes Order</h2>
                  </div>
                  <div className="flex gap-2">
                    {/* Buttons removed for now */}
                  </div>
                </div>

                {/* Scheme list */}
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-gray-700 border border-gray-200 rounded-md">
                    <thead className="bg-gray-100 text-left">
                      <tr>
                        <th className="p-3 font-medium">Starting Date</th>
                        <th className="p-3 font-medium">Ending Date</th>
                        <th className="p-3 font-medium">Scheme Name</th>
                        <th className="p-3 font-medium">Scheme Description</th>
                        <th className="p-3 font-medium">Scheme Type</th>
                        <th className="p-3 font-medium">Scheme Quantity Included</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schemes.map((scheme, index) => (
                        <tr key={index} className="border-t hover:bg-gray-50">
                          <td className="p-3">{scheme.date}</td>
                          <td className="p-3">{scheme.expireDate}</td>
                          <td className="p-3">{scheme.schemesName}</td>
                          <td className="p-3">{scheme.schemesDescription}</td>
                          <td className="p-3">{scheme.schemesType}</td>
                          <td className="p-3">{scheme.schemesQuantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="px-3 py-1 border rounded bg-gray-50"
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentPage} of {totalPage}
                  </span>
                  <button
                    disabled={currentPage === totalPage}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="px-3 py-1 border rounded bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SchemeList;
