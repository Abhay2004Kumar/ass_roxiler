import * as yup from 'yup';

// Must match backend Joi rules exactly
const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+[\]{};:'",.<>/?\\|`~]).{8,16}$/;

const PASSWORD_MSG =
  'Password must be 8–16 characters, include at least one uppercase letter and one special character';

export const registerSchema = yup.object({
  name: yup
    .string()
    .min(20, 'Name must be at least 20 characters')
    .max(60, 'Name must not exceed 60 characters')
    .required('Name is required'),
  email: yup.string().email('Must be a valid email address').required('Email is required'),
  password: yup.string().matches(PASSWORD_REGEX, PASSWORD_MSG).required('Password is required'),
  address: yup
    .string()
    .max(400, 'Address must not exceed 400 characters')
    .required('Address is required'),
});

export const loginSchema = yup.object({
  email:    yup.string().email('Must be a valid email address').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export const changePasswordSchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword:     yup.string().matches(PASSWORD_REGEX, PASSWORD_MSG).required('New password is required'),
});

export const createUserSchema = yup.object({
  name: yup
    .string()
    .min(20, 'Name must be at least 20 characters')
    .max(60, 'Name must not exceed 60 characters')
    .required('Name is required'),
  email:    yup.string().email('Must be a valid email address').required('Email is required'),
  password: yup.string().matches(PASSWORD_REGEX, PASSWORD_MSG).required('Password is required'),
  address:  yup.string().max(400, 'Address must not exceed 400 characters').required('Address is required'),
  role:     yup.string().oneOf(['admin', 'user', 'store_owner']).required('Role is required'),
});

export const createStoreSchema = yup.object({
  name: yup
    .string()
    .min(20, 'Store name must be at least 20 characters')
    .max(60, 'Store name must not exceed 60 characters')
    .required('Store name is required'),
  email:    yup.string().email('Must be a valid email address').required('Email is required'),
  address:  yup.string().max(400, 'Address must not exceed 400 characters').required('Address is required'),
  owner_id: yup.string().nullable().optional(),
});
