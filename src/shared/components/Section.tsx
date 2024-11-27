import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export default function Section({
  children,
  styles,
}: {
  children: ReactNode;
  styles?: string;
}) {
  return (
    <section
      className={twMerge(
        `pt-[77px] pb-[20px] bg-secondaryBackground rounded-xl`,
        styles
      )}
    >
      {children}
    </section>
  );
}
