import { extendVariants, Input } from '@nextui-org/react';

export default function InputNextUi() {
  return <div>Root</div>;
}

export const InputNextUi = extendVariants(Input, {
  variants: {
         
              type="email"
              value={value}
              // variant="bordered"
              onValueChange={setValue}
              isInvalid={isInvalid}
              color={isInvalid ? 'danger' : 'success'}
              errorMessage="Please enter a valid email"
              classNames={{
                input: [
                  'px-[18px] py-[6px] text-mainPrimaryText transition-all',
                  // 'group-data-[hover=true]:!bg-transparent group-data-[focus=true]:!bg-transparent group-data-[focus=true]:ring-0 group-data-[focus=true]:outline-0',
                  'placeholder:text-customGrey-200',
                ],
                inputWrapper: [
                  'h-fit min-h-fit px-[0] py-[0] bg-inherit border-[2px] border-customBlack-100 rounded-lg transition-all',
                  'group-data-[hover=true]:bg-transparent group-data-[hover=true]:border-customBlue-100',
                  'group-data-[focus=true]:bg-transparent group-data-[focus=true]:border-customBlue-100 group-data-[focus=true]:ring-transparent group-data-[focus=true]:ring-offset-transparent ',
                  'group-data-[invalid=true]:!bg-transparent',
                ],
              }}
       
  ],
});
