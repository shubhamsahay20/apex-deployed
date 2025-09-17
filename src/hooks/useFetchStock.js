import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import stockService from '../api/stock.service';

export function useFetchStock(accessToken, debounceValue) {
  const [loading, setLoading] = useState(false);
  const [stock, setStock] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await stockService.getInternalStock(
          accessToken,
          currentPage,
          10,
          debounceValue,
        );
        console.log('res is coming', res);
        setStock(res.transfers);
        setTotalPages(res.pagination.totalPages);
      } catch (error) {
        toast.error(error.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };

    if (debounceValue.length === 0 || debounceValue.length >= 2) {
      fetchData();
    }
  }, [accessToken, currentPage, debounceValue]);

  return { stock, loading, currentPage, totalPages, setCurrentPage };
}
