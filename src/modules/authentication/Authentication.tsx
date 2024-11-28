'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Section from '@/shared/components/Section';
import registerUser from '../../services/commonAPI';
import FormItem from '@/shared/components/FormItem';
import validationSchema from '@/shared/helpers/validation-schema';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

interface FormDataProps {
  email?: string;
}

export default function Authentication({}) {
  const [message, setMessage] = useState<string>('');
  const [isEmailRequired, setIsEmailRequired] = useState<boolean>(true); 

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful, errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(validationSchema(isEmailRequired)), 
  });

  const onSubmit: SubmitHandler<FormDataProps> = async ({ email }) => {
    try {

      if (!email) {
        throw new Error('Email is required');
      }
      const successMessage = await registerUser(email);
      setMessage(successMessage);
    } catch (err: any) {
      setMessage(err.message || 'An error occurred.');
    }
  };

  useEffect(() => {
  

    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset, errors]);

  return (
    <Section styles="min-w-[384px] pt-[26px] px-8 pb-10">
      <h1 className="mb-[26px] font-Inter-500 font-medium text-xl text-customGrey-100">
        Sign Up
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-4 !outline-none !focus:outline-none !activ:outline-none"
      >
        <FormItem
          type="email"
          name="email"
          placeholder="Enter your email"
          register={register}
          error={errors.email}
          styles="max-w-full mb-[2px]"
        />

        <button
          className="w-full font-Inter-400 font-normal text-sm bg-customBlue-200 text-white text-center group-data-[focus-visible=true]:ring-0 group-data-[focus-visible=true]:ring-offset-0"
          type="submit"
        >
          Continue with <br /> Email
        </button>
      </form>

      <div className="flex justify-center font-Inter-400 font-normal text-sm">
        <p className="text-customGrey-100">Already have an account? </p>
        <Link className="text-customBlue-200" href="/account">
          Log In
        </Link>
      </div>
    </Section>
  );
}
