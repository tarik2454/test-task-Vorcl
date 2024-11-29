import axios from 'axios';

const registerUser = async (email: string) => {
  try {
    const response = await axios.post('http://localhost:3001/register', {
      email,
    });

    return response.data.message;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 401) {
        return 'Введено некоректні дані.';
      }
    }
    return 'Щось пішло не так! Спробуйте знову....';
  }
};

export default registerUser;
