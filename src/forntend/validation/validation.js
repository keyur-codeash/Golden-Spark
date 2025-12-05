import * as Yup from "yup";
import domains from "disposable-email-domains";

export const signInValidation = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .test(
      "password-strength",
      "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
      (value) =>
        !!value &&
        value.length >= 8 &&
        /[a-z]/.test(value) &&
        /[A-Z]/.test(value) &&
        /[0-9]/.test(value) &&
        /[!@#$%^&*(),.?":{}|<>]/.test(value)
    ),
});

export const signUpValidation = Yup.object({
  name: Yup.string().required("Name is required"),

  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required")
    .test(
      "not-disposable",
      "Disposable email addresses are not allowed",
      function (value) {
        if (!value) return false;
        const domain = value.split("@")[1].toLowerCase();
        return !domains.includes(domain);
      }
    ),
  password: Yup.string()
    .required("Password is required")
    .test(
      "password-strength",
      "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
      (value) =>
        !!value &&
        value.length >= 8 &&
        /[a-z]/.test(value) &&
        /[A-Z]/.test(value) &&
        /[0-9]/.test(value) &&
        /[!@#$%^&*(),.?":{}|<>]/.test(value)
    ),
});

// forggot password valdiation
export const forgotPasswordSchema = Yup.object({
  password: Yup.string()
    .required("Password is required")
    .test(
      "password-strength",
      "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
      (value) =>
        !!value &&
        value.length >= 8 &&
        /[a-z]/.test(value) &&
        /[A-Z]/.test(value) &&
        /[0-9]/.test(value) &&
        /[!@#$%^&*(),.?":{}|<>]/.test(value)
    ),
  confirmPassword: Yup.string()
    .oneOf(
      [Yup.ref("password")],
      "Your password and confirmation password do not match."
    )
    .required("Confirm password is required"),
});

//contact validation
export const contactSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  message: Yup.string()
    .min(10, "Message must be at least 10 characters")
    .required("Message is required"),
});

// creadit card validation
export const creaditCardValidation = Yup.object({
  cardNumber: Yup.string()
    .required("Card number is required")
    .matches(/^\d{12,19}$/, "Card number must be between 12 and 19 digits"),
  expirationDate: Yup.string()
    .required("Expiration date is required")
    .matches(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, "Must be in MM/YY format")
    .test("expirationDate", "Card has expired", function (value) {
      if (!value) return false;
      const [month, year] = value.split("/");
      const expiration = new Date(`20${year}`, month - 1);
      const currentDate = new Date();
      return expiration >= currentDate;
    }),
  cvv: Yup.string()
    .required("CVV is required")
    .matches(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
  cardName: Yup.string().required("Card name is required"),
});

// Billing address validation
export const addressSchema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .min(3, "Title must be at least 3 characters long.")
    .required("Title is required."),

  brand: Yup.string().required("Please select a brand."),

  category: Yup.string().required("Please select a category."),

  images: Yup.array()
    .required("Images are required.")
    .min(1, "Images are required.")
    .max(
      process.env.NEXT_PUBLIC_DESC_IMAGE_FILES || 5,
      `You can add maximum ${
        process.env.NEXT_PUBLIC_DESC_IMAGE_FILES || 5
      } image.`
    ),
  description: Yup.string()
    .min(5, "Description must be at least 5 characters long.")
    .required("Description is required."),
});
