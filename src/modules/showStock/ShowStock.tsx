'use client';

import { useState } from 'react';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
} from '@nextui-org/react';

interface StockData {
  [key: string]: {
    [key: string]: string;
  };
}

export default function ShowStock() {
  const [symbol, setSymbol] = useState('');
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>('US');

  const handleFetchStocks = async () => {
    console.log('Fetching stock data...'); // Логируем начало запроса
    if (!symbol) {
      setError('Please enter a stock symbol');
      return;
    }
    // if (!selectedCountry) {
    //   setError('Please enter a stock country');
    //   return;
    // }

    setError(null);
    setStockData(null);
    setLoading(true); // Показываем индикатор загрузки

    try {
      const response = await fetch(
        `http://localhost:3001/api/stock?symbol=${symbol}&country=${selectedCountry}`, // Передаем selectedCountry
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        throw new Error('Error loading data');
      }

      const data = await response.json();
      console.log('API Response:', data); // Логируем структуру данных

      if (
        data?.chart?.result?.length > 0 &&
        data.chart.result[0].indicators?.quote?.[0] &&
        data.chart.result[0].timestamp
      ) {
        const stockResult = data.chart.result[0];
        const stockData = stockResult.indicators.quote[0];
        const timestamps = stockResult.timestamp;

        const formattedData = timestamps.reduce(
          (acc: StockData, timestamp: number, index: number) => {
            const date = new Date(timestamp * 1000).toLocaleString(); // Форматируем время
            acc[date] = {
              '1. open': stockData.open[index].toString(),
              '2. high': stockData.high[index].toString(),
              '3. low': stockData.low[index].toString(),
              '4. close': stockData.close[index].toString(),
              '5. volume': stockData.volume[index].toString(),
            };
            return acc;
          },
          {}
        );

        console.log('Formatted Data:', formattedData); // Логируем отформатированные данные

        setStockData(formattedData);
      } else {
        throw new Error('Invalid data structure received');
      }
    } catch (err: unknown) {
      console.error('Error occurred:', err); // Логируем ошибку
      const error = err as Error;
      setError(error.message || 'Error loading data');
      setStockData(null); // Добавлено для безопасности, если ошибка происходит
    } finally {
      setLoading(false); // Завершаем загрузку
    }
  };

  const handleCountryChange = (key: string | number) => {
    console.log('Country changed:', key); // ��огируем изменение страны
    setSelectedCountry(key.toString()); // Преобразуем в строку, если key числовой
  };

  // Подготовка данных для отображения в таблице
  const formattedDataArray = stockData
    ? Object.keys(stockData).map(key => ({
        time: key,
        open: stockData[key]['1. open'],
        high: stockData[key]['2. high'],
        low: stockData[key]['3. low'],
        close: stockData[key]['4. close'],
        volume: stockData[key]['5. volume'],
      }))
    : [];

  // Проверка данных перед рендерингом таблицы
  const isValidData = (data: any) =>
    data.time &&
    data.open &&
    data.high &&
    data.low &&
    data.close &&
    data.volume;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Данные по акциям 📈💹</h1>

      <div className="flex gap-4 mb-4">
        <Dropdown>
          <DropdownTrigger>
            <Button>{selectedCountry || 'Выберите страну'}</Button>
          </DropdownTrigger>
          <DropdownMenu
            onAction={(key: string | number) => handleCountryChange(key)}
            aria-label="Выберите страну"
          >
            {['US', 'UK', 'JP'].map(item => (
              <DropdownItem key={item}>{item}</DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>

        <Input
          label="Символ"
          placeholder="Введите символ акции (например, AAPL)"
          onChange={e => setSymbol(e.target.value)}
        />
        <Button color="primary" onPress={handleFetchStocks}>
          Применить
        </Button>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {loading ? (
        <div className="flex justify-center mt-4">
          <Spinner size="md" />
        </div>
      ) : formattedDataArray.length > 0 ? (
        <div className="overflow-auto max-h-96">
          <Table aria-label="Stock Data" className="text-black">
            <TableHeader>
              <TableColumn>Time</TableColumn>
              <TableColumn>Open</TableColumn>
              <TableColumn>High</TableColumn>
              <TableColumn>Low</TableColumn>
              <TableColumn>Close</TableColumn>
              <TableColumn>Volume</TableColumn>
            </TableHeader>
            <TableBody>
              {formattedDataArray.filter(isValidData).map((data, index) => (
                <TableRow key={index}>
                  <TableCell>{data.time}</TableCell>
                  <TableCell>{data.open}</TableCell>
                  <TableCell>{data.high}</TableCell>
                  <TableCell>{data.low}</TableCell>
                  <TableCell>{data.close}</TableCell>
                  <TableCell>{data.volume}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p>Нет данных для отображения</p>
      )}
    </div>
  );
}
