// src/hooks/useFetchData.js
import { useEffect, useState } from "react";

const useFetchData = (endpoint) => {
  const [data, setData] = useState(null); // Change to null for a more general approach
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const url = `${import.meta.env.VITE_URL}${endpoint}`;
  console.log(url);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useFetchData;
