'use client';

import { useState } from 'react';
import { Input, Button } from '@nextui-org/react';
import Link from 'next/link';

import Section from '@/shared/components/Section';
import { registerUser } from '../../services/commonAPI';
import validateEmail from './utils/validateEmail';

export default function Authentication() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Введите корректный email');
      return;
    }
    setError('');

    try {
      const successMessage = await registerUser(email);
      setMessage(successMessage);
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <Section className={'w-[384px] pt-[26px] px-8 pb-10'}>
      <h1 className="mb-[26px] font-inter-500 font-medium text-xl text-customGrey-100">
        Sign Up
      </h1>
      <form
        onSubmit={handleSubmit}
        className="mb-4 !outline-none !focus:outline-none !activ:outline-none"
      >
        <div className="mb-2">
          <Input
            type="email"
            label="mail"
            onChange={e => setEmail(e.target.value)}
            value={email}
            isRequired
            required
            className="max-w-full mb-[2px]"
            classNames={{
              label: '!text-customGrey-200 ',
              input: '!text-white',
              inputWrapper:
                '!bg-customBlack-100 !border-2 !border-customBlue-200 group-data-[focus-visible=true]:ring-0 group-data-[focus-visible=true]:ring-offset-0',
            }}
          />
          {error && <p className="text-red-500 text-[12px]">{error}</p>}
        </div>

        <Button
          className="w-full font-Inter-400 font-normal text-sm bg-customBlue-200 text-white text-center group-data-[focus-visible=true]:ring-0 group-data-[focus-visible=true]:ring-offset-0"
          type="submit"
        >
          Continue with <br /> Email
        </Button>
      </form>

      <div className="flex justify-center font-Inter-400 font-normal text-sm">
        <p className=" text-customGrey-100">Already have an account? </p>
        <Link className="text-customBlue-200" href="/account">
          Log In
        </Link>
      </div>

      {message && <p className="mt-4 text-center">{message}</p>}
    </Section>
  );
}
