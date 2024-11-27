import {
  UseFormRegister,
  FieldValues,
  Path,
  FieldError,
} from 'react-hook-form';

interface FormItemProps<T extends FieldValues> {
  id?: string;
  type?: 'text' | 'email' | 'textarea' | 'tel' | 'date';
  labelText?: string;
  name: Path<T>;
  placeholder?: string;
  register: UseFormRegister<T>;
  error?: FieldError;
  style?: React.CSSProperties;
}

export default function FormItem<T extends FieldValues>({
  id,
  type,
  labelText,
  name,
  placeholder,
  register,
  error,
  style,
}: FormItemProps<T>) {
  return (
    <div>
      <label htmlFor={id} className="block mb-1">
        {labelText}
      </label>
      {type === 'text' && (
        <input
          type="text"
          id={id}
          className="input"
          placeholder={placeholder}
          {...register(name)}
        />
      )}
      {type === 'email' && (
        <input
          type="email"
          id={id}
          className="input"
          placeholder={placeholder}
          {...register(name)}
        />
      )}

      {error && <span className="error">{error.message}</span>}
    </div>
  );
}
