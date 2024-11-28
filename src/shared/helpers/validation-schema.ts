import * as yup from 'yup';

interface ValidationSchemaProps {
  country?: string;
  symbolName?: string;
  email?: string;
}

const validationSchema = (isEmailRequired: boolean) => {
  const schema: yup.ObjectSchema<ValidationSchemaProps> = yup.object({
    country: yup.string(),
    symbolName: yup.string(),
    email: isEmailRequired
      ? yup.string().email('Invalid email format').required('Email is required')
      : yup.string().email('Invalid email format'),
  });

  return schema;
};

export default validationSchema;
