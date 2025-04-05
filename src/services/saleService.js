const BASE_URL = `${import.meta.env.VITE_EXPRESS_BACKEND_URL}/sales`;

// 🔄 Buy a car (user)
const buyCar = async (carId) => {
  try {
    const res = await fetch(`${BASE_URL}/${carId}/buy`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return res.json();
  } catch (error) {
    console.log('Error buying car:', error);
    return { error: 'Buy request failed' };
  }
};

const getMySales = async () => {
  try {
    const res = await fetch(BASE_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return res.json();
  } catch (error) {
    console.log('Error fetching sales:', error);
    return [];
  }
};

// 🔍 Get one sale record (if needed for invoice or details)
const getSaleById = async (saleId) => {
  try {
    const res = await fetch(`${BASE_URL}/${saleId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return res.json();
  } catch (error) {
    console.log('Error fetching sale details:', error);
    return null;
  }
};

// 📊 Admin: Get total sales + revenue stats
const getSalesStats = async () => {
  try {
    const res = await fetch(`${BASE_URL}/stats/admin`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return res.json();
  } catch (error) {
    console.log('Error fetching stats:', error);
    return null;
  }
};

export {
  buyCar,
  getMySales,
  getSaleById,
  getSalesStats,
};
