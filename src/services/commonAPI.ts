import axios from 'axios';

import Stock from '@/types/stock';

const registerUser = async (email: string) => {
  try {
    const response = await axios.post('http://localhost:3001/register', {
      email,
    });
    return response.data.message;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Произошла ошибка.');
  }
};

export { registerUser };
