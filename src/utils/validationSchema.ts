import { check, checkSchema } from 'express-validator';

const validateUserCredentials = checkSchema({
  name:{
    notEmpty:{
      errorMessage:"Name should not be empty"
    },
    isString: {
      errorMessage: "Name must be a valid string",
    }
  },
  email: {
    notEmpty: {
      errorMessage: "Email should not be empty",
    },
    isEmail: {
      errorMessage: "Email must be a valid email",
    },
  },
  password: {
    notEmpty: {
      errorMessage: "Password should not be empty",
    },
    isString: {
      errorMessage: "Password must be a valid string",
    },
    isLength: {
      options: { min: 8 },
      errorMessage: "Password must be at least 8 characters long",
    },
    custom: {
      options: (value) => {
        const errors = [];
        if (!/\d/.test(value)) {
          errors.push('Password must contain at least one number');
        }
        if (!/[A-Z]/.test(value)) {
          errors.push('Password must contain at least one uppercase letter');
        }
        if (!/[a-z]/.test(value)) {
          errors.push('Password must contain at least one lowercase letter');
        }
        if (!/[@$!%*?&#]/.test(value)) {
          errors.push('Password must contain at least one special character');
        }
        if (errors.length > 0) {
          throw new Error(errors.join('. '));
        }
        return true;
      },
    },
  },
});

const validateUserUpdateCredentials = checkSchema({
  name:{
    isString:{
      errorMessage:"Name must be a valid string"
    }
  },
  email:{
    isEmail: {
      errorMessage: "Email must be a valid email",
    }
  },
  oldPassword:{
    isString:{
      errorMessage:"Name must be a valid string"
    }
  },
  newPassword:{
    isString:{
      errorMessage:"Name must be a valid string"
    }
  }
})

export { validateUserCredentials,validateUserUpdateCredentials };
