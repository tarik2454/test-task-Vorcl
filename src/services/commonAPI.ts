import axios from 'axios';

const registerUser = async (email: string) => {
  try {
    console.log('Sending request to backend with email:', email); // Логируем отправку запроса
    const response = await axios.post('http://localhost:3001/register', {
      email,
    });
    console.log('Response from server:', response.data); // Логируем ответ от сервера
    return response.data.message;
  } catch (error: any) {
    console.error('Error during request:', error); // Логируем ошибку при запросе
    throw new Error(error.response?.data?.message || 'Произошла ошибка.');
  }
};

export default registerUser;
