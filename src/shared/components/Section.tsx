import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export default function Section({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={twMerge(
        `pt-[77px] px-[168px] pb-[20px] bg-secondaryBackground rounded-xl`,
        className
      )}
    >
      {children}
    </section>
  );
}
