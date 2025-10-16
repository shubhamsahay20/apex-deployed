import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import authService from "../../../../api/auth.service";
import { useAuth } from "../../../../Context/AuthContext";
import Loader from "../../../../common/Loader";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";

const ViewArticle = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [articleData, setArticleData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCategory = async () => {
    setLoading(true);
    try {
      const res = await authService.getCategoryById(user.accessToken, id);
      setArticleData(res.data?.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch details");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [id]);

  if (loading) return <Loader />;
  if (!articleData) return <p className="text-center text-gray-500 mt-10">No data found</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            {articleData.article}
          </h1>
          {/* <p className="text-sm text-gray-500 mt-1">Article ID: {articleData._id}</p> */}
        </div>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
        >
          <ArrowLeft size={18} /> Back
        </button>
      </div>

      {/* Category Cards */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {articleData.category?.map((cat, idx) => (
          <div
            key={cat._id || idx}
            className="rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-md transition duration-300"
          >
            {/* Big Image */}
            <div className="w-full h-80 bg-gray-50 flex items-center justify-center overflow-hidden">
              <img
                src={cat.image?.[0]}
                alt={cat.categoryCode}
                className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Info */}
            <div className="p-5">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {cat.categoryCode}
              </h2>

              <div className="space-y-1 text-gray-600 text-sm">
                <p>
                  <span className="font-medium text-gray-700">Color:</span> {cat.color}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Size:</span> {cat.size}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Article Code:</span>{" "}
                  {cat.articleCode || "—"}
                </p>
              </div>

              {/* Type */}
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Type</p>
                <div className="flex flex-wrap gap-2">
                  {cat.type?.map((t, i) => (
                    <span
                      key={i}
                      className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quality */}
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700 mb-1">Quality</p>
                <div className="flex flex-wrap gap-2">
                  {cat.quality?.map((q, i) => (
                    <span
                      key={i}
                      className="bg-amber-100 text-amber-700 text-xs font-medium px-2.5 py-1 rounded-full"
                    >
                      {q}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewArticle;
