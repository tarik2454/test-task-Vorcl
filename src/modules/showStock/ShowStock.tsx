'use client';

import React, { useState } from 'react';
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
import Section from '@/shared/components/Section';
import Container from '@/shared/components/Container';

interface StockData {
  symbol: string;
  name: string;
  capitalization: string;
  price: string;
  priceChangeDay: string;
  priceChangeMonth: string;
}

const styles = {
  label: '!text-red-500',
  input: ['!bg-red'],
  innerWrapper: '!bg-red',
  inputWrapper: ['!bg-red'],
};

export default function ShowStock() {
  const [symbol, setSymbol] = useState('');
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>('US');

  const handleFetchStocks = async () => {
    if (!symbol) {
      setError('Please enter a stock symbol');
      return;
    }

    setError(null);
    setStockData(null);
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3001/api/stock?symbol=${symbol}&country=${selectedCountry}`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        throw new Error('Error loading data');
      }

      const data = await response.json();

      // Логирование полученных данных
      console.log('API response:', data);

      // Проверка на наличие данных
      if (data?.chart?.result?.length > 0) {
        const stockResult = data.chart.result[0];

        // Получение цен и мета данных
        const closePrices = stockResult.indicators?.quote[0]?.close;
        const lastClosePrice = closePrices
          ? closePrices[closePrices.length - 1]
          : 'N/A';

        // Рассчитываем изменения в цене
        const priceChangeDay =
          closePrices && closePrices.length > 1
            ? ((closePrices[closePrices.length - 1] -
                closePrices[closePrices.length - 2]) /
                closePrices[closePrices.length - 2]) *
              100
            : 0;

        const priceChangeMonth =
          closePrices && closePrices.length > 30
            ? ((closePrices[closePrices.length - 1] -
                closePrices[closePrices.length - 30]) /
                closePrices[closePrices.length - 30]) *
              100
            : 0;

        const metaData = stockResult.meta || {};
        const stockSymbol = metaData.symbol || 'N/A';
        const longName = metaData.longName || 'N/A';

        const newStockData: StockData = {
          symbol: stockSymbol,
          name: longName,
          capitalization: 'N/A', // Замените на реальные данные о капитализации, если они есть в ответе API
          price: parseFloat(lastClosePrice.toString()).toFixed(2),
          priceChangeDay: priceChangeDay.toFixed(2), // округляем до 2 знаков
          priceChangeMonth: priceChangeMonth.toFixed(2), // округляем до 2 знаков
        };

        setStockData(newStockData);
      } else {
        throw new Error('Invalid data structure received');
      }
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Error loading data');
      setStockData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCountryChange = (key: string | number) => {
    setSelectedCountry(key.toString());
  };

  const [value, setValue] = React.useState('junior2nextui.org');

  const validateEmail = (value: string) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const isInvalid = React.useMemo(() => {
    if (value === '') return false;

    return validateEmail(value) ? false : true;
  }, [value]);

  return (
    <Container>
      <Section>
        <div className="p-4">
          <h1 className="text-large mb-4">Данные по акциям 📈💹</h1>

          <div className="flex flex-col gap-4 mb-4 font-inter-400 font-normal ">
            <Input
              placeholder="Enter your country"
              onChange={e => setSelectedCountry(e.target.value)}
              classNames={{
                input: [
                  'px-[18px] py-[6px] text-mainPrimaryText transition-all',
                  'placeholder:text-customGrey-200',
                ],
                inputWrapper: [
                  'h-fit min-h-fit px-[0] py-[0] bg-inherit border-[2px] border-customBlack-100 rounded-lg transition-all',
                  'group-data-[hover=true]:bg-transparent group-data-[hover=true]:border-customBlue-100',
                  'group-data-[focus=true]:bg-transparent group-data-[focus=true]:border-customBlue-100 group-data-[focus=true]:ring-transparent group-data-[focus=true]:ring-offset-transparent ',
                  'group-data-[invalid=true]:!bg-transparent',
                ],
              }}
            />

            <Input
              type="email"
              value={value}
              placeholder="Enter symbol or name"
              onValueChange={setValue}
              isInvalid={isInvalid}
              color={isInvalid ? 'danger' : 'success'}
              errorMessage="Please enter a valid email"
              // classNames={{
              //   input: [
              //     'px-[18px] py-[6px] text-mainPrimaryText transition-all',
              //     'placeholder:text-customGrey-200',
              //   ],
              //   inputWrapper: [
              //     'h-fit min-h-fit px-[0] py-[0] bg-inherit border-[2px] border-customBlack-100 rounded-lg transition-all',
              //     'group-data-[hover=true]:bg-transparent group-data-[hover=true]:border-customBlue-100',
              //     'group-data-[focus=true]:bg-transparent group-data-[focus=true]:border-customBlue-100 group-data-[focus=true]:ring-transparent group-data-[focus=true]:ring-offset-transparent ',
              //     'group-data-[invalid=true]:!bg-transparent',
              //   ],
              // }}
              classNames={{
                input: 'input', // Используем обычные классы CSS
                inputWrapper: 'inputWrapper', // Используем обычные классы CSS
              }}
            />
          </div>

          {/* {error && <p className="text-red-600">{error}</p>} */}

          {loading ? (
            <div className="flex justify-center mt-4">
              <Spinner size="md" />
            </div>
          ) : stockData ? (
            <div className="overflow-auto max-h-96">
              <Table aria-label="Stock Data" className="text-black">
                <TableHeader>
                  <TableColumn>Symbol</TableColumn>
                  <TableColumn>Name</TableColumn>
                  <TableColumn>Capitalization</TableColumn>
                  <TableColumn>Price</TableColumn>
                  <TableColumn>Price change per day</TableColumn>
                  <TableColumn>Price change per month</TableColumn>
                </TableHeader>
                <TableBody>
                  <TableRow key={stockData.symbol}>
                    <TableCell>{stockData.symbol}</TableCell>
                    <TableCell>{stockData.name}</TableCell>
                    <TableCell>{stockData.capitalization}</TableCell>
                    <TableCell>{stockData.price}</TableCell>
                    <TableCell>{stockData.priceChangeDay}%</TableCell>
                    <TableCell>{stockData.priceChangeMonth}%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ) : (
            <p>Нет данных для отображения</p>
          )}
        </div>
      </Section>
    </Container>
  );
}
