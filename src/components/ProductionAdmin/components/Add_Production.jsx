import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useAuth } from "../../../Context/AuthContext";
import authService from "../../../api/auth.service";
import factoryService from "../../../api/factory.service";
import productionService from "../../../api/production.service";
import Loader from "../../../common/Loader";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Add_Production = () => {
  const { user } = useAuth();
 const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [factoryData, setFactoryData] = useState([]);
  const [articleData, setArticleData] = useState([]);

  const [formData, setFormData] = useState({
    date: "",
    factory: "",
    article: "",
    categoryCode: "",
    size: "",
    color: "",
    type: "",
    quality: "",
    production: "",
  });

  const [selectedArticle, setSelectedArticle] = useState(null);

  // Fetch factories and articles
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // Factories
        let factories = [];
        let pageF = 1;
        let totalPagesF = 1;
        while (pageF <= totalPagesF) {
          const res = await factoryService.getAllFactories(user.accessToken, pageF);
          factories = [...factories, ...res.data.data.factories];
          totalPagesF = res.data.pagination.totalPages;
          pageF++;
        }
        setFactoryData(factories);

        // Articles
        let articles = [];
        let pageA = 1;
        let totalPagesA = 1;
        while (pageA <= totalPagesA) {
          const res = await authService.getCategories(user.accessToken, pageA);
          articles = [...articles, ...res.data.data];
          totalPagesA = res.data.pagination.totalPages;
          pageA++;
        }
        setArticleData(articles);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load factories or articles");
      } finally {
        setLoading(false);
      }
    })();
  }, [user.accessToken]);

  // Handle Article selection
  const handleArticleSelect = (selected) => {
    if (!selected) {
      setSelectedArticle(null);
      setFormData({
        ...formData,
        article: "",
        categoryCode: "",
        size: "",
        color: "",
        type: "",
        quality: "",
      });
      return;
    }
    const article = articleData.find((a) => a.article === selected.value);
    setSelectedArticle(article);

    setFormData({
      ...formData,
      article: selected.value,
      categoryCode: "",
      size: "",
      color: "",
      type: "",
      quality: "",
    });
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.article) return toast.error("Article required");
    if (!formData.date) return toast.error("Date required");
    if (!formData.factory) return toast.error("Factory required");
    if (!formData.production) return toast.error("Production Number required");
    if (!formData.type) return toast.error("Type required");
    if (!formData.quality) return toast.error("Quality required");
    if (!formData.categoryCode) return toast.error("Category required");
    if (!formData.color) return toast.error("Color required");
    if (!formData.size) return toast.error("Size required");

    setLoading(true);
    try {
      const payload = {
        factory: formData.factory,
        article: formData.article,
        productionDate: formData.date,
        productionQuantity: formData.production,
        size: formData.size,
        color: formData.color,
        type: formData.type,
        quality: formData.quality,
        categoryCode: formData.categoryCode,
      };

      console.log("Payload:", payload);

      const res = await productionService.addProduction(user.accessToken, payload);
      toast.success(res.data?.message || "Production Added Successfully");

      setFormData({
        date: "",
        factory: "",
        article: "",
        categoryCode: "",
        size: "",
        color: "",
        type: "",
        quality: "",
        production: "",
      });
      setSelectedArticle(null);
      navigate('/production-manager/management')
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add production");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h2 className="text-lg font-semibold text-gray-800">Add Production</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Date */}
        <div>
          <label className="block text-sm font-medium">Date</label>
          <input
            type="date"
            name="date"
            min={new Date().toISOString().split("T")[0]}
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="border px-4 py-2 rounded-md text-sm w-full"
          />
        </div>

        {/* Factory */}
        <div>
          <label className="block text-sm font-medium">Factory</label>
          <select
            name="factory"
            value={formData.factory}
            onChange={(e) => setFormData({ ...formData, factory: e.target.value })}
            className="border px-4 py-2 rounded-md text-sm w-full"
          >
            <option value="">Select Factory</option>
            {factoryData.map((f) => (
              <option key={f._id} value={f._id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        {/* Article */}
        <div>
          <label className="block text-sm font-medium">Article</label>
          <Select
            name="article"
            value={formData.article ? { label: formData.article, value: formData.article } : null}
            onChange={handleArticleSelect}
            options={articleData.map((a) => ({ label: a.article, value: a.article }))}
            placeholder="Select Article"
            isClearable
          />
        </div>

        {/* Category */}
        {selectedArticle && selectedArticle.category?.length > 0 && (
          <div>
            <label className="block text-sm font-medium">Category</label>
            <Select
              name="category"
              value={formData.categoryCode ? { label: formData.categoryCode, value: formData.categoryCode } : null}
              onChange={(selected) =>
                setFormData({ ...formData, categoryCode: selected?.value || "" })
              }
              options={selectedArticle.category.map((c) => ({
                label: c.categoryCode,
                value: c.categoryCode,
              }))}
              placeholder="Select Category"
            />
          </div>
        )}

        {/* Size */}
        {selectedArticle && selectedArticle.category?.length > 0 && (
          <div>
            <label className="block text-sm font-medium">Size</label>
            <Select
              name="size"
              value={formData.size ? { label: formData.size, value: formData.size } : null}
              onChange={(selected) => setFormData({ ...formData, size: selected?.value || "" })}
              options={[...new Set(selectedArticle.category.map((c) => c.size))].map((s) => ({
                label: s,
                value: s,
              }))}
              placeholder="Select Size"
            />
          </div>
        )}

        {/* Color */}
        {selectedArticle && selectedArticle.category?.length > 0 && (
          <div>
            <label className="block text-sm font-medium">Color</label>
            <Select
              name="color"
              value={formData.color ? { label: formData.color, value: formData.color } : null}
              onChange={(selected) => setFormData({ ...formData, color: selected?.value || "" })}
              options={[...new Set(selectedArticle.category.map((c) => c.color))].map((c) => ({
                label: c,
                value: c,
              }))}
              placeholder="Select Color"
            />
          </div>
        )}

        {/* Type */}
        {selectedArticle && selectedArticle.category?.length > 0 && (
          <div>
            <label className="block text-sm font-medium">Type</label>
            <Select
              name="type"
              value={formData.type ? { label: formData.type, value: formData.type } : null}
              onChange={(selected) => setFormData({ ...formData, type: selected?.value || "" })}
              options={[
                ...new Set(selectedArticle.category.flatMap((c) => c.type)),
              ].map((t) => ({ label: t, value: t }))}
              placeholder="Select Type"
            />
          </div>
        )}

        {/* Quality */}
        {selectedArticle && selectedArticle.category?.length > 0 && (
          <div>
            <label className="block text-sm font-medium">Quality</label>
            <Select
              name="quality"
              value={formData.quality ? { label: formData.quality, value: formData.quality } : null}
              onChange={(selected) => setFormData({ ...formData, quality: selected?.value || "" })}
              options={[
                ...new Set(selectedArticle.category.flatMap((c) => c.quality)),
              ].map((q) => ({ label: q, value: q }))}
              placeholder="Select Quality"
            />
          </div>
        )}

        {/* Production */}
        <div>
          <label className="block text-sm font-medium">Production Quantity</label>
          <input
            type="number"
            value={formData.production}
            onChange={(e) => setFormData({ ...formData, production: e.target.value })}
            className="border px-4 py-2 rounded-md w-full"
          />
          <button
            type="submit"
            className="bg-blue-600 mt-4 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Add_Production;
