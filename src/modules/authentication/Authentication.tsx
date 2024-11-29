'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Section from '@/shared/components/Section';
import registerUser from '../../services/commonAPI';
import FormItem from '@/shared/components/FormItem';
import validationSchema from '@/shared/helpers/validation-schema';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FormDataProps {
  email?: string;
}

export default function Authentication({}) {
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
      const response = await registerUser(email);
      toast.success(response);
    } catch (error: any) {
      toast.error(error);
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
        className="flex flex-col gap-[8px] mb-4"
        noValidate
      >
        <FormItem
          type="email"
          name="email"
          placeholder="mail &#42;"
          register={register}
          error={errors.email}
          styles="px-[13px] py-[22px]"
        />

        <button
          className="w-full py-1 font-Inter-400 font-normal text-sm bg-customBlue-200 text-white text-center rounded-lg"
          type="submit"
        >
          Continue with <br /> Email
        </button>
      </form>

      <div className="flex justify-center items-end gap-[6px] font-Inter-400 font-normal text-sm">
        <p className="text-customGrey-100">Already have an account? </p>
        <Link className="text-customBlue-200" href="#">
          Log In
        </Link>
      </div>
    </Section>
  );
}
