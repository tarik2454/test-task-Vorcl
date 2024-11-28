'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Section from '@/shared/components/Section';
import Container from '@/shared/components/Container';
import FormItem from '@/shared/components/FormItem';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import validationSchema from '@/shared/helpers/validation-schema';

interface StockDataProps {
  symbol: string;
  name: string;
  capitalization: string;
  price: string;
  priceChangeDay: string;
  priceChangeMonth: string;
}

interface FormDataProps {
  country?: string;
  symbolName?: string;
  email?: string;
}

export default function ShowStock() {
  const [symbol, setSymbol] = useState('');
  const [stockData, setStockData] = useState<StockDataProps | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>('US');

  const [isEmailRequired, setIsEmailRequired] = useState<boolean>(false); // Define the state for `isEmailRequired`

  const ALPHA_VANTAGE_API_KEY = 'B2O6T9PA7J5NAAZ0'; // Укажите свой ключ API Alpha Vantage

  const fetchStockData = async (symbol: string) => {
    if (!symbol) {
      setError('Please enter a stock symbol');
      return;
    }

    setError(null);
    setStockData(null);
    setLoading(true);

    try {
      const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}&outputsize=compact`;

      const response = await axios.get(url);

      // Логирование полученных данных
      console.log('API response:', response.data);

      const data = response.data['Time Series (Daily)'];

      if (data) {
        const dates = Object.keys(data);
        const latestDate = dates[0];
        const secondLatestDate = dates[1];

        const latestData = data[latestDate];
        const secondLatestData = data[secondLatestDate];

        const lastClosePrice = parseFloat(latestData['4. close']);
        const secondLastClosePrice = parseFloat(secondLatestData['4. close']);

        const priceChangeDay =
          ((lastClosePrice - secondLastClosePrice) / secondLastClosePrice) *
          100;

        const monthData = dates.slice(0, 30); // последние 30 дней для расчета изменения за месяц
        const monthStartData = data[monthData[monthData.length - 1]];
        const priceChangeMonth =
          ((lastClosePrice - parseFloat(monthStartData['4. close'])) /
            parseFloat(monthStartData['4. close'])) *
          100;

        const stockData: StockDataProps = {
          symbol,
          name: 'Company Name', // Используйте данные из API или сделайте запрос для получения полного имени
          capitalization: 'N/A', // Здесь может быть капитализация, если она доступна
          price: lastClosePrice.toFixed(2),
          priceChangeDay: priceChangeDay.toFixed(2),
          priceChangeMonth: priceChangeMonth.toFixed(2),
        };

        setStockData(stockData);
      } else {
        throw new Error('Invalid data structure received');
      }
    } catch (err: any) {
      setError(err.message || 'Error loading data');
      setStockData(null);
    } finally {
      setLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful, errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(validationSchema(isEmailRequired)),
  });

  const onSubmit: SubmitHandler<FormDataProps> = data => {

    fetchStockData(data.symbolName || '');
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <Container>
      <Section styles="py-[60px] p-[60px]">
        <div className="flex flex-col items-center">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 max-w-[282px] mb-4 font-Inter-400 font-normal text-sm"
          >
            <FormItem
              type="text"
              name="country"
              placeholder="Enter your country"
              register={register}
              error={errors.country}
            />
            <FormItem
              type="text"
              name="symbolName"
              placeholder="Enter symbol or name"
              register={register}
              error={errors.symbolName}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </form>

          {error && <p className="text-red-500">{error}</p>}

          <div className="overflow-auto max-h-96 w-full">
            <table className="table-auto w-full text-white border-collapse border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border border-gray-300 px-4 py-2">№</th>
                  <th className="border border-gray-300 px-4 py-2">Symbol</th>
                  <th className="border border-gray-300 px-4 py-2">Name</th>
                  <th className="border border-gray-300 px-4 py-2">
                    Capitalization
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Price</th>
                  <th className="border border-gray-300 px-4 py-2">
                    Price change per day
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Price change per month
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading || !stockData ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      {loading ? 'Loading...' : 'No data available'}
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">1</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {stockData.symbol}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {stockData.name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {stockData.capitalization}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {stockData.price}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {stockData.priceChangeDay}%
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {stockData.priceChangeMonth}%
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Section>
    </Container>
  );
}
