"use client";
import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "@/components/Button";
import countriesData from "../../../../src/countries+states+cities.json";
import Link from "next/link";
import InputField from "@/components/Input";

// Define your address types here for easy management
const ADDRESS_TYPES = [
  { value: "Home", label: "Home" },
  { value: "Office", label: "Office" },
  { value: "Apartment", label: "Apartment" },
  { value: "Other", label: "Other" },
];

const addressSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  type: Yup.string().required("Address type is required"),
  country: Yup.string().required("Country is required"),
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  address: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  zipCode: Yup.string().required("ZIP code is required"),
});

const BillingDetailsForm = ({
  title,
  contant,
  overflow,
  onClose,
  initialValues,
  onSubmit,
}) => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load countries
    try {
      setCountries(countriesData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching countries:", error);
      setIsLoading(false);
    }
  }, []);

  const handleCountryChange = (country, setFieldValue) => {
    const selectedCountry = countries.find((c) => c.name === country);
    setStates(selectedCountry?.states || []);
    setFieldValue("state", "");
  };

  const initialFormValues = {
    email: "",
    subscribe: true,
    country: "",
    firstName: "",
    lastName: "",
    address: "",
    type: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    saveAddress: false,
    payOnDelivery: false,
    ...initialValues,
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading countries...</div>;
  }

  return (
    <div className="billingDetailsForm">
      <div className="container mx-auto">
        <div className="">
          <h1 className="text-2xl font-bold mb-4 cursor-pointer">{title}</h1>

          <div className={overflow && "overflow-auto h-[70vh]"}>
            <Formik
              initialValues={initialFormValues}
              validationSchema={addressSchema}
              onSubmit={(values) => {
                onSubmit(values);
              }}
            >
              {({
                values,
                setFieldValue,
                isSubmitting,
                handleChange,
                handleBlur,
                errors,
                touched,
              }) => (
                <Form>
                  {/* Contact Section */}
                  <section className="mb-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold mb-4">Contact</h2>
                      <div className="mb-4">
                        <p className="text-gray-700">
                          Have an account?
                          <Link
                            href="auth/sign-in"
                            className="font-bold text-black border-b"
                          >
                            Log in
                          </Link>
                        </p>
                      </div>
                    </div>

                    <InputField
                      id="email"
                      label=""
                      type="email"
                      placeholder="Your email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email && errors.email}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
                    />

                    <div className="flex items-center mb-6">
                      <Field
                        id="subscribe"
                        type="checkbox"
                        name="subscribe"
                        className="h-4 w-4 rounded custom-checkbox border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="subscribe" className="ml-2 text-gray-700">
                        Email me with news and offers
                      </label>
                    </div>
                  </section>

                  {/* Delivery Information Section */}
                  <section className="mb-5">
                    <h2 className="text-2xl font-semibold mb-4">
                      Delivery Information
                    </h2>

                    {/* Address Type Dropdown */}
                    <div className="relative mb-6">
                      <Field
                        as="select"
                        name="type"
                        className="block w-full pt-5 pb-1 ps-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 peer bg-transparent"
                      >
                        <option value=""></option>
                        {ADDRESS_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </Field>
                      <label
                        htmlFor="type"
                        className={`absolute left-2 top-1/2 text-md -translate-y-1/2 text-gray-500 transform transition-all duration-200 pointer-events-none ${
                          values.type
                            ? "-translate-y-6 text-xs"
                            : "peer-focus:-translate-y-6 peer-focus:text-xs"
                        }`}
                      >
                        Address Type
                      </label>
                      <ErrorMessage
                        name="type"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div className="relative mb-6">
                      <Field
                        as="select"
                        name="country"
                        onChange={(e) => {
                          setFieldValue("country", e.target.value);
                          handleCountryChange(e.target.value, setFieldValue);
                        }}
                        className="block w-full pt-5 pb-1 ps-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 peer bg-transparent"
                      >
                        <option value=""></option>
                        {countries.map((country) => (
                          <option key={country.id} value={country.name}>
                            {country.name}
                          </option>
                        ))}
                      </Field>
                      <label
                        htmlFor="country"
                        className={`absolute left-2 top-1/2 text-md -translate-y-1/2 text-gray-500 transform transition-all duration-200 pointer-events-none ${
                          values.country
                            ? "-translate-y-6 text-xs"
                            : "peer-focus:-translate-y-6 peer-focus:text-xs"
                        }`}
                      >
                        Country/Region
                      </label>
                      <ErrorMessage
                        name="country"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                      <InputField
                        id="firstName"
                        label=""
                        type="text"
                        placeholder="First name"
                        value={values.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.firstName && errors.firstName}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
                      />
                      <InputField
                        id="lastName"
                        label=""
                        type="text"
                        placeholder="Last name"
                        value={values.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.lastName && errors.lastName}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
                      />
                    </div>

                    <InputField
                      id="address"
                      label=""
                      type="text"
                      placeholder="Address"
                      value={values.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.address && errors.address}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
                    />

                    <InputField
                      id="apartment"
                      label=""
                      type="text"
                      placeholder="Apartment, suite, unit, etc. (Optional)"
                      value={values.apartment}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4">
                      <InputField
                        id="city"
                        label=""
                        type="text"
                        placeholder="City"
                        value={values.city}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.city && errors.city}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
                      />

                      <div className="mb-4">
                        <Field
                          as="select"
                          name="state"
                          disabled={!values.country}
                          className="w-full px-4 py-3.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
                        >
                          <option value="">State</option>
                          {states.map((state) => (
                            <option key={state.id} value={state.name}>
                              {state.name}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="state"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <InputField
                        id="zipCode"
                        label=""
                        type="text"
                        placeholder="ZIP Code"
                        value={values.zipCode}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.zipCode && errors.zipCode}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
                      />
                    </div>

                    <div className="flex items-center mb-2">
                      <Field
                        id="saveAddress"
                        type="checkbox"
                        name="saveAddress"
                        className="h-4 w-4 rounded border-gray-300 custom-checkbox text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="saveAddress" className="ml-2 text-lg">
                        Make this as my default address
                      </label>
                    </div>
                  </section>

                  {/* Form Footer */}
                  <div className="sm:pt-3">
                    <div className="grid grid-cols-2 gap-4 sm:gap-8 space-x-4">
                      <Button
                        label="CANCEL"
                        variant="outline"
                        className="px-6 py-3 w-full border !text-black border-black"
                        onClick={onClose}
                        type="button"
                      />
                      <Button
                        label="SAVE"
                        variant="solid"
                        className="px-6 py-3 !bg-yellow-800"
                        type="submit"
                        disabled={isSubmitting}
                      />
                    </div>

                    {contant && (
                      <p className="text-lg pt-4 text-md mb-4 md:mb-0">
                        Your info will be saved to a Shop account. By
                        continuing, you agree to Shop's Terms of Service and
                        acknowledge the Privacy Policy .
                      </p>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingDetailsForm;

// "use client";
// import React, { useState, useEffect } from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import Button from "@/components/Button";
// import countriesData from "../../../../src/countries+states+cities.json";
// import Link from "next/link";

// const addressSchema = Yup.object().shape({
//   email: Yup.string()
//     .email("Invalid email address")
//     .required("Email is required"),
//   type: Yup.string().required("Type is required"),
//   country: Yup.string().required("Country is required"),
//   firstName: Yup.string().required("First name is required"),
//   lastName: Yup.string().required("Last name is required"),
//   address: Yup.string().required("Address is required"),
//   city: Yup.string().required("City is required"),
//   state: Yup.string().required("State is required"),
//   zipCode: Yup.string().required("ZIP code is required"),
// });

// const BillingDetailsForm = ({
//   title,
//   contant,
//   overflow,
//   onClose,
//   initialValues,
//   onSubmit,
// }) => {
//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Load countries
//     try {
//       setCountries(countriesData);
//       setIsLoading(false);
//     } catch (error) {
//       console.error("Error fetching countries:", error);
//       setIsLoading(false);
//     }
//   }, []);

//   const handleCountryChange = (country, setFieldValue) => {
//     const selectedCountry = countries.find((c) => c.name === country);
//     setStates(selectedCountry?.states || []);
//     setFieldValue("state", "");
//   };

//   const initialFormValues = {
//     email: "",
//     subscribe: true,
//     country: "",
//     firstName: "",
//     lastName: "",
//     address: "",
//     type: "",
//     apartment: "",
//     city: "",
//     state: "",
//     zipCode: "",
//     saveAddress: false,
//     payOnDelivery: false,
//     ...initialValues,
//   };

//   if (isLoading) {
//     return <div className="text-center py-8">Loading countries...</div>;
//   }

//   return (
//     <div className="billingDetailsForm">
//       <div className="container mx-auto">
//         <div className="">
//           <h1 className="text-2xl font-bold mb-4 cursor-pointer">{title}</h1>

//           <div className={overflow && "overflow-auto h-[70vh]"}>
//             <Formik
//               initialValues={initialFormValues}
//               validationSchema={addressSchema}
//               onSubmit={(values) => {
//                 onSubmit(values);
//               }}
//             >
//               {({ values, setFieldValue, isSubmitting }) => (
//                 <Form>
//                   {/* Contact Section */}
//                   <section className="mb-4">
//                     <div className="flex justify-between items-center">
//                       <h2 className="text-xl font-semibold mb-4">Contact</h2>
//                       <div className="mb-4">
//                         <p className="text-gray-700">
//                           Have an account?
//                           <Link
//                             href="auth/sign-in"
//                             className="font-bold text-black border-b"
//                           >
//                             Log in
//                           </Link>
//                         </p>
//                       </div>
//                     </div>
//                     <div className="mb-4">
//                       <Field
//                         name="email"
//                         type="email"
//                         placeholder="Your email"
//                         className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
//                       />
//                       <ErrorMessage
//                         name="email"
//                         component="div"
//                         className="text-red-500 text-sm mt-1"
//                       />
//                     </div>

//                     <div className="flex items-center mb-6">
//                       <Field
//                         id="subscribe"
//                         type="checkbox"
//                         name="subscribe"
//                         className="h-4 w-4 rounded custom-checkbox border-gray-300 text-blue-600 focus:ring-blue-500"
//                       />
//                       <label htmlFor="subscribe" className="ml-2 text-gray-700">
//                         Email me with news and offers
//                       </label>
//                     </div>
//                   </section>

//                   {/* Delivery Information Section */}
//                   <section className="mb-5">
//                     <h2 className="text-2xl font-semibold mb-4">
//                       Delivery Information
//                     </h2>

//                     <div className="relative mb-6">
//                       <Field
//                         as="select"
//                         name="country"
//                         onChange={(e) => {
//                           setFieldValue("country", e.target.value);
//                           handleCountryChange(e.target.value, setFieldValue);
//                         }}
//                         className="block w-full pt-5 pb-1 ps-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 peer bg-transparent"
//                       >
//                         <option value=""></option>
//                         {countries.map((country) => (
//                           <option key={country.id} value={country.name}>
//                             {country.name}
//                           </option>
//                         ))}
//                       </Field>
//                       <label
//                         htmlFor="country"
//                         className={`absolute left-2 top-1/2 text-md -translate-y-1/2 text-gray-500 transform transition-all duration-200 pointer-events-none ${
//                           values.country
//                             ? "-translate-y-6 text-xs"
//                             : "peer-focus:-translate-y-6 peer-focus:text-xs"
//                         }`}
//                       >
//                         Country/Region
//                       </label>
//                       <ErrorMessage
//                         name="country"
//                         component="div"
//                         className="text-red-500 text-sm mt-1"
//                       />
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
//                       <div className="mb-4">
//                         <Field
//                           name="firstName"
//                           placeholder="First name"
//                           className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
//                         />
//                         <ErrorMessage
//                           name="firstName"
//                           component="div"
//                           className="text-red-500 text-sm mt-1"
//                         />
//                       </div>
//                       <div className="mb-4">
//                         <Field
//                           name="lastName"
//                           placeholder="Last name"
//                           className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
//                         />
//                         <ErrorMessage
//                           name="lastName"
//                           component="div"
//                           className="text-red-500 text-sm mt-1"
//                         />
//                       </div>
//                     </div>

//                     <div className="mb-4">
//                       <Field
//                         name="address"
//                         placeholder="Address"
//                         className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
//                       />
//                       <ErrorMessage
//                         name="address"
//                         component="div"
//                         className="text-red-500 text-sm mt-1"
//                       />
//                     </div>

//                     <div className="mb-4">
//                       <Field
//                         name="apartment"
//                         placeholder="Apartment, suite, unit, etc. (Optional)"
//                         className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
//                       />
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4">
//                       <div className="mb-4">
//                         <Field
//                           name="city"
//                           placeholder="City"
//                           className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
//                         />
//                         <ErrorMessage
//                           name="city"
//                           component="div"
//                           className="text-red-500 text-sm mt-1"
//                         />
//                       </div>

//                       <div className="mb-4">
//                         <Field
//                           as="select"
//                           name="state"
//                           disabled={!values.country}
//                           className="w-full px-4 py-3.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
//                         >
//                           <option value="">State</option>
//                           {states.map((state) => (
//                             <option key={state.id} value={state.name}>
//                               {state.name}
//                             </option>
//                           ))}
//                         </Field>
//                         <ErrorMessage
//                           name="state"
//                           component="div"
//                           className="text-red-500 text-sm mt-1"
//                         />
//                       </div>

//                       <div className="mb-4">
//                         <Field
//                           name="zipCode"
//                           placeholder="ZIP Code"
//                           className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
//                         />
//                         <ErrorMessage
//                           name="zipCode"
//                           component="div"
//                           className="text-red-500 text-sm mt-1"
//                         />
//                       </div>
//                     </div>

//                     <div className="flex items-center mb-2">
//                       <Field
//                         id="saveAddress"
//                         type="checkbox"
//                         name="saveAddress"
//                         className="h-4 w-4 rounded border-gray-300 custom-checkbox text-blue-600 focus:ring-blue-500"
//                       />
//                       <label htmlFor="saveAddress" className="ml-2 text-lg">
//                         Make this as my default address
//                       </label>
//                     </div>
//                   </section>

//                   {/* Form Footer */}
//                   <div className="sm:pt-3">
//                     <div className="grid grid-cols-2 gap-4 sm:gap-8 space-x-4">
//                       <Button
//                         label="CANCEL"
//                         variant="outline"
//                         className="px-6 py-3 w-full border !text-black border-black"
//                         onClick={onClose}
//                         type="button"
//                       />
//                       <Button
//                         label="SAVE"
//                         variant="solid"
//                         className="px-6 py-3 !bg-yellow-800"
//                         type="submit"
//                         disabled={isSubmitting}
//                       />
//                     </div>

//                     {contant && (
//                       <p className="text-lg pt-4 text-md mb-4 md:mb-0">
//                         Your info will be saved to a Shop account. By
//                         continuing, you agree to Shop's Terms of Service and
//                         acknowledge the Privacy Policy .
//                       </p>
//                     )}
//                   </div>
//                 </Form>
//               )}
//             </Formik>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BillingDetailsForm;

// "use client";
// import React, { useState, useEffect } from "react";
// import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
// import Button from "@/components/Button";
// import countriesData from "../../../../src/countries+states+cities.json";
// import Link from "next/link";
// import InputField from "@/components/Input";

// const BillingDetailsForm = ({
//   title,
//   contant,
//   overflow,
//   onClose,
//   initialData,
//   onSubmit,
// }) => {
//   const [formData, setFormData] = useState({
//     email: "",
//     subscribe: true,
//     country: "",
//     firstName: "",
//     lastName: "",
//     address: "",
//     apartment: "",
//     city: "",
//     state: "",
//     zipCode: "",
//     saveAddress: false,
//     type: "",
//     payOnDelivery: false,
//   });

//   const [errors, setErrors] = useState({});
//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Initialize form with initialData if provided
//     if (initialData) {
//       setFormData({
//         email: initialData.email || "",
//         subscribe: true,
//         country: initialData.country || "",
//         firstName: initialData.firstName || "",
//         lastName: initialData.lastName || "",
//         address: initialData.address || "",
//         apartment: initialData.apartment || "",
//         city: initialData.city || "",
//         state: initialData.state || "",
//         zipCode: initialData.zipCode || "",
//         saveAddress: initialData.saveAddress || false,
//         type: initialData.type || "",
//         payOnDelivery: initialData.payOnDelivery || false,
//       });
//     }

//     // Load countries
//     try {
//       setCountries(countriesData);
//       setIsLoading(false);
//     } catch (error) {
//       console.error("Error fetching countries:", error);
//       setIsLoading(false);
//     }
//   }, [initialData]);

//   const handleReset = () => {
//     setFormData({
//       email: "",
//       subscribe: true,
//       country: "",
//       firstName: "",
//       lastName: "",
//       address: "",
//       apartment: "",
//       city: "",
//       state: "",
//       zipCode: "",
//       saveAddress: false,
//       type: "",
//       payOnDelivery: false,
//     });
//   };

//   useEffect(() => {
//     if (formData.country) {
//       const selectedCountry = countries.find(
//         (c) => c.name === formData.country
//       );
//       setStates(selectedCountry?.states || []);
//       if (
//         initialData?.state &&
//         selectedCountry?.states?.some((s) => s.name === initialData.state)
//       ) {
//         // Keep the state if it's valid for the selected country
//       } else {
//         setFormData((prev) => ({ ...prev, state: "" }));
//       }
//     } else {
//       setStates([]);
//     }
//   }, [formData.country, countries, initialData]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleBlur = (e) => {
//     const { name, value } = e.target;
//     let error = "";

//     if (
//       !value &&
//       name !== "apartment" &&
//       name !== "subscribe" &&
//       name !== "saveAddress"
//     ) {
//       error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
//     } else if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
//       error = "Invalid email address";
//     }

//     setErrors((prev) => ({ ...prev, [name]: error }));
//   };

//   const handleFormSubmit = (e) => {
//     e.preventDefault();
//     const newErrors = {};

//     // Validate all required fields
//     const requiredFields = [
//       "email",
//       "country",
//       "firstName",
//       "lastName",
//       "address",
//       "city",
//       "state",
//       "zipCode",
//       "type",
//     ];

//     requiredFields.forEach((key) => {
//       if (!formData[key]) {
//         newErrors[key] = `${
//           key.charAt(0).toUpperCase() + key.slice(1)
//         } is required`;
//       }
//     });

//     // Special email validation
//     if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = "Invalid email address";
//     }

//     setErrors(newErrors);

//     if (Object.keys(newErrors).length === 0) {
//       // Prepare the address data to submit
//       const addressData = {
//         email: formData.email,
//         country: formData.country,
//         firstName: formData.firstName,
//         lastName: formData.lastName,
//         address: formData.address,
//         apartment: formData.apartment,
//         city: formData.city,
//         state: formData.state,
//         zipCode: formData.zipCode,
//         saveAddress: formData.saveAddress,
//         type: formData.type,
//         payOnDelivery: formData.payOnDelivery,
//       };

//       onSubmit(addressData);
//     }
//   };

//   if (isLoading) {
//     return <div className="text-center py-8">Loading countries...</div>;
//   }

//   return (
//     <div className="billingDetailsForm">
//       <div className="container mx-auto">
//         <div className="">
//           <h1 className="text-2xl font-bold mb-4 cursor-pointer">{title}</h1>

//           <div className={overflow && "overflow-auto h-[70vh]"}>
//             <form onSubmit={handleFormSubmit}>
//               {/* Contact Section */}
//               <section className="mb-4">
//                 <div className="flex justify-between items-center">
//                   <h2 className="text-xl font-semibold mb-4">Contact</h2>
//                   <div className="mb-4">
//                     <p className="text-gray-700">
//                       Have an account?
//                       <Link
//                         href="auth/sign-in"
//                         className="font-bold text-black border-b"
//                       >
//                         Log in
//                       </Link>
//                     </p>
//                   </div>
//                 </div>

//                 <InputField
//                   id="email"
//                   label="Your email"
//                   type="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={errors.email}
//                   placeholder="Your email"
//                 />

//                 <div className="flex items-center mb-6">
//                   <input
//                     id="subscribe"
//                     type="checkbox"
//                     name="subscribe"
//                     checked={formData.subscribe}
//                     onChange={handleChange}
//                     className="h-4 w-4 rounded custom-checkbox border-gray-300 text-blue-600 focus:ring-blue-500"
//                   />
//                   <label htmlFor="subscribe" className="ml-2 text-gray-700">
//                     Email me with news and offers
//                   </label>
//                 </div>
//               </section>

//               {/* Delivery Information Section */}
//               <section className="mb-5">
//                 <h2 className="text-2xl font-semibold mb-4">
//                   Delivery Information
//                 </h2>

//                 <InputField
//                   id="type"
//                   placeholder="Address Type (e.g., Home, Work)"
//                   value={formData.type}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={errors.type}
//                 />

//                 <div className="relative mb-6">
//                   <select
//                     id="country"
//                     name="country"
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     value={formData.country}
//                     className={`block w-full pt-5 pb-1 ps-2 border-1 rounded-md appearance-none focus:outline-none focus:ring-0 peer bg-transparent ${
//                       errors.country ? "border-red-500" : "border-gray-300"
//                     }`}
//                   >
//                     <option value="" disabled></option>
//                     {countries.map((country) => (
//                       <option key={country.id} value={country.name}>
//                         {country.name}
//                       </option>
//                     ))}
//                   </select>

//                   <label
//                     htmlFor="country"
//                     className={`absolute left-2 top-1/2 text-md -translate-y-1/2 text-gray-500 transform transition-all duration-200 pointer-events-none ${
//                       formData.country ||
//                       document.activeElement ===
//                         document.getElementById("country")
//                         ? "-translate-y-6 text-xs "
//                         : "peer-focus:-translate-y-6 peer-focus:text-x"
//                     }`}
//                   >
//                     Country/Region
//                   </label>

//                   <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
//                     <svg
//                       className="w-5 h-5 text-gray-400"
//                       xmlns="http://www.w3.org/2000/svg"
//                       viewBox="0 0 20 20"
//                       fill="currentColor"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                   </div>

//                   {errors.country && (
//                     <p className="mt-1 text-sm text-red-500">
//                       {errors.country}
//                     </p>
//                   )}
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
//                   <InputField
//                     id="firstName"
//                     value={formData.firstName}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     error={errors.firstName}
//                     placeholder="First name"
//                   />
//                   <InputField
//                     id="lastName"
//                     placeholder="Last name"
//                     value={formData.lastName}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     error={errors.lastName}
//                   />
//                 </div>

//                 <InputField
//                   id="address"
//                   placeholder="Address"
//                   value={formData.address}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={errors.address}
//                 />

//                 <InputField
//                   id="apartment"
//                   placeholder="Apartment, suite, unit, etc. (Optional)"
//                   value={formData.apartment}
//                   onChange={handleChange}
//                   className=""
//                 />

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4">
//                   <InputField
//                     id="city"
//                     placeholder="City"
//                     value={formData.city}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     error={errors.city}
//                   />

//                   <div className="mb-4">
//                     <select
//                       id="state"
//                       name="state"
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       value={formData.state}
//                       disabled={!formData.country}
//                       className={`w-full px-4 py-3.5 border rounded-md focus:outline-none focus:ring-1 ${
//                         errors.state
//                           ? "border-red-500 focus:ring-red-500"
//                           : "border-gray-300"
//                       }`}
//                     >
//                       <option value="" className="text-red-500" disabled>
//                         State
//                       </option>
//                       {states.map((state) => (
//                         <option key={state.id} value={state.name}>
//                           {state.name}
//                         </option>
//                       ))}
//                     </select>
//                     {errors.state && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {errors.state}
//                       </p>
//                     )}
//                   </div>

//                   <InputField
//                     id="zipCode"
//                     placeholder="ZIP Code"
//                     value={formData.zipCode}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     error={errors.zipCode}
//                   />
//                 </div>

//                 <div className="flex items-center mb-2">
//                   <input
//                     id="payOnDelivery"
//                     type="checkbox"
//                     name="payOnDelivery"
//                     checked={formData.payOnDelivery}
//                     onChange={handleChange}
//                     className="h-4 w-4 rounded border-gray-300 custom-checkbox text-blue-600 focus:ring-blue-500"
//                   />
//                   <label htmlFor="payOnDelivery" className="ml-2 text-lg">
//                     Pay on delivery available
//                   </label>
//                 </div>

//                 <div className="flex items-center mb-2">
//                   <input
//                     id="saveAddress"
//                     type="checkbox"
//                     name="saveAddress"
//                     checked={formData.saveAddress}
//                     onChange={handleChange}
//                     className="h-4 w-4 rounded border-gray-300 custom-checkbox text-blue-600 focus:ring-blue-500"
//                   />
//                   <label htmlFor="saveAddress" className="ml-2 text-lg">
//                     Make this as my default address
//                   </label>
//                 </div>
//               </section>

//               {/* Form Footer */}
//               <div className="sm:pt-3">
//                 <div className="grid grid-cols-2 gap-4 sm:gap-8 space-x-4">
//                   <Button
//                     label="CANCEL"
//                     variant="outline"
//                     className="px-6 py-3 w-full border !text-black border-black"
//                     onClick={onClose}
//                     type="button"
//                   />
//                   <Button
//                     label="SAVE"
//                     variant="solid"
//                     className="px-6 py-3 !bg-yellow-800"
//                     type="submit"
//                   />
//                 </div>

//                 {contant && (
//                   <p className="text-lg pt-4 text-md mb-4 md:mb-0">
//                     Your info will be saved to a Shop account. By continuing,
//                     you agree to Shop's Terms of Service and acknowledge the
//                     Privacy Policy .
//                   </p>
//                 )}
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BillingDetailsForm;

// "use client";
// import React, { useState, useEffect } from "react";
// import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
// import Button from "@/components/Button";
// import countriesData from "../../../../src/countries+states+cities.json";
// import Link from "next/link";
// import InputField from "@/components/Input";

// // const InputField = ({
// //   id,
// //   label,
// //   type = "text",
// //   placeholder = "",
// //   value,
// //   onChange,
// //   onBlur,
// //   error,
// //   required = false,
// //   className = "",
// // }) => {
// //   const [showPassword, setShowPassword] = useState(false);
// //   const isPassword = type === "password";

// //   return (
// //     <div className="mb-4">
// //       {/* {label && (
// //         <label
// //           htmlFor={id}
// //           className="block text-md md:text-xl text-gray-700 mb-1"
// //         >
// //           {label}
// //         </label>
// //       )} */}
// //       <div className="relative">
// //         <input
// //           id={id}
// //           name={id}
// //           type={isPassword && showPassword ? "text" : type}
// //           placeholder={placeholder}
// //           value={value}
// //           onChange={onChange}
// //           onBlur={onBlur}
// //           required={required}
// //           className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-1 ${
// //             error ? "border-red-500 focus:ring-red-500" : "border-gray-300"
// //           } ${className}`}
// //         />
// //         {isPassword && (
// //           <button
// //             type="button"
// //             onClick={() => setShowPassword((prev) => !prev)}
// //             className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
// //             tabIndex={-1}
// //           >
// //             {showPassword ? (
// //               <IoEyeOutline size={20} className="cursor-pointer" />
// //             ) : (
// //               <IoEyeOffOutline size={20} className="cursor-pointer" />
// //             )}
// //           </button>
// //         )}
// //       </div>
// //       {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
// //     </div>
// //   );
// // };

// const BillingDetailsForm = ({ title, contant, overflow , onClose }) => {
//   const [formData, setFormData] = useState({
//     email: "",
//     subscribe: true,
//     country: "",
//     firstName: "",
//     lastName: "",
//     address: "",
//     apartment: "",
//     city: "",
//     state: "",
//     zipCode: "",
//     saveAddress: false,
//   });

//   const [errors, setErrors] = useState({});
//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Simulate API call to fetch countries
//     const fetchCountries = async () => {
//       try {
//         // In a real app, you would fetch this from your API
//         setCountries(countriesData);
//         setIsLoading(false);
//       } catch (error) {
//         console.error("Error fetching countries:", error);
//         setIsLoading(false);
//       }
//     };

//     fetchCountries();
//   }, []);

//   const handleReset = () => {
//     setFormData({
//       email: "",
//       subscribe: true,
//       country: "",
//       firstName: "",
//       lastName: "",
//       address: "",
//       apartment: "",
//       city: "",
//       state: "",
//       zipCode: "",
//       saveAddress: false,
//     });
//   };

//   useEffect(() => {
//     if (formData.country) {
//       const selectedCountry = countries.find(
//         (c) => c.name === formData.country
//       );
//       setStates(selectedCountry?.states || []);
//       setFormData((prev) => ({ ...prev, state: "" }));
//     } else {
//       setStates([]);
//     }
//   }, [formData.country, countries]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleBlur = (e) => {
//     const { name, value } = e.target;
//     let error = "";

//     if (
//       !value &&
//       name !== "apartment" &&
//       name !== "subscribe" &&
//       name !== "saveAddress"
//     ) {
//       error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
//     } else if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
//       error = "Invalid email address";
//     }

//     setErrors((prev) => ({ ...prev, [name]: error }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const newErrors = {};

//     // Validate all required fields
//     Object.keys(formData).forEach((key) => {
//       if (key !== "apartment" && key !== "subscribe" && key !== "saveAddress") {
//         if (!formData[key]) {
//           newErrors[key] = `${
//             key.charAt(0).toUpperCase() + key.slice(1)
//           } is required`;
//         }
//       }
//     });

//     // Special email validation
//     if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = "Invalid email address";
//     }

//     setErrors(newErrors);

//     if (Object.keys(newErrors).length === 0) {
//       console.log("Form submitted:", formData);
//       // Handle form submission
//     }
//   };

//   if (isLoading) {
//     return <div className="text-center py-8">Loading countries...</div>;
//   }

//   return (
//     <div className="billingDetailsForm">
//       <div className="container mx-auto">
//         <div className="">
//           <h1 className="text-2xl font-bold mb-4 cursor-pointer">
//             {title}
//             {/* Billing Details */}
//           </h1>

//           <div className={overflow && "overflow-auto h-[70vh] "}>
//             {/* Contact Section */}
//             <section className="mb-4">
//               <div className="flex justify-between items-center">
//                 <h2 className="text-xl font-semibold mb-4">Contact</h2>
//                 <div className="mb-4">
//                   <p className="text-gray-700">
//                     Have an account?
//                     <Link
//                       href="auth/sign-in"
//                       className="font-bold text-black border-b"
//                     >
//                       Log in
//                     </Link>
//                   </p>
//                 </div>
//               </div>

//               <InputField
//                 id="email"
//                 label="Your email"
//                 type="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={errors.email}
//                 placeholder="Your email"
//               />

//               <div className="flex items-center mb-6">
//                 <input
//                   id="subscribe"
//                   type="checkbox"
//                   name="subscribe"
//                   checked={formData.subscribe}
//                   onChange={handleChange}
//                   className="h-4 w-4 rounded custom-checkbox border-gray-300 text-blue-600 focus:ring-blue-500"
//                 />
//                 <label htmlFor="subscribe" className="ml-2 text-gray-700">
//                   Email me with news and offers
//                 </label>
//               </div>
//             </section>

//             {/* Delivery Information Section */}
//             <section className="mb-5">
//               <h2 className="text-2xl font-semibold mb-4">
//                 Delivery Information
//               </h2>

//               <div className="relative mb-6">
//                 <select
//                   id="country"
//                   name="country"
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   value={formData.country}
//                   className={`block w-full pt-5 pb-1 ps-2 border-1 rounded-md appearance-none focus:outline-none focus:ring-0 peer bg-transparent ${
//                     errors.country ? "border-red-500" : "border-gray-300"
//                   }`}
//                 >
//                   <option value="" disabled></option>
//                   {countries.map((country) => (
//                     <option key={country.id} value={country.name}>
//                       {country.name}
//                     </option>
//                   ))}
//                 </select>

//                 <label
//                   htmlFor="country"
//                   className={`absolute left-2 top-1/2 text-md -translate-y-1/2 text-gray-500 transform transition-all duration-200 pointer-events-none ${
//                     formData.country ||
//                     document.activeElement ===
//                       document.getElementById("country")
//                       ? "-translate-y-6 text-xs "
//                       : "peer-focus:-translate-y-6 peer-focus:text-x"
//                   }`}
//                 >
//                   Country/Region
//                 </label>

//                 {/* Dropdown arrow icon */}
//                 <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
//                   <svg
//                     className="w-5 h-5 text-gray-400"
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </div>

//                 {errors.country && (
//                   <p className="mt-1 text-sm text-red-500">{errors.country}</p>
//                 )}
//               </div>

//               {/* <div className="mb-4">
//                 <label htmlFor="country" className="block text-gray-700 mb-1">
//                   Country/Region
//                 </label>
//                 <select
//                   id="country"
//                   name="country"
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   value={formData.country}
//                   className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-1 ${
//                     errors.country
//                       ? "border-red-500 focus:ring-red-500"
//                       : "border-gray-300"
//                   }`}
//                 >
//                   <option value="">Select Country</option>
//                   {countries.map((country) => (
//                     <option key={country.id} value={country.name}>
//                       {country.name}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.country && (
//                   <p className="text-red-500 text-sm mt-1">{errors.country}</p>
//                 )}
//               </div> */}

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
//                 <InputField
//                   id="firstName"
//                   value={formData.firstName}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={errors.firstName}
//                   placeholder="First name"
//                 />
//                 <InputField
//                   id="lastName"
//                   placeholder="Last name"
//                   value={formData.lastName}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={errors.lastName}
//                 />
//               </div>

//               <InputField
//                 id="address"
//                 placeholder="Address"
//                 value={formData.address}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={errors.address}
//               />

//               <InputField
//                 id="apartment"
//                 placeholder="Apartment, suite, unit, etc. (Optional)"
//                 value={formData.apartment}
//                 onChange={handleChange}
//                 className=""
//               />

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4">
//                 <InputField
//                   id="city"
//                   placeholder="City"
//                   value={formData.city}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={errors.city}
//                 />

//                 <div className="mb-4">
//                   <select
//                     id="state"
//                     name="state"
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     value={formData.state}
//                     disabled={!formData.country}
//                     className={`w-full px-4 py-3.5 border rounded-md focus:outline-none focus:ring-1 ${
//                       errors.state
//                         ? "border-red-500 focus:ring-red-500"
//                         : "border-gray-300"
//                     }`}
//                   >
//                     <option value="" className="text-red-500" disabled>
//                       State
//                     </option>
//                     {states.map((state) => (
//                       <option key={state.id} value={state.name}>
//                         {state.name}
//                       </option>
//                     ))}
//                   </select>
//                   {errors.state && (
//                     <p className="text-red-500 text-sm mt-1">{errors.state}</p>
//                   )}
//                 </div>

//                 <InputField
//                   id="zipCode"
//                   placeholder="ZIP Code"
//                   value={formData.zipCode}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={errors.zipCode}
//                 />
//               </div>

//               <div className="flex items-center mb-2">
//                 <input
//                   id="saveAddress"
//                   type="checkbox"
//                   name="saveAddress"
//                   checked={formData.saveAddress}
//                   onChange={handleChange}
//                   className="h-4 w-4 rounded border-gray-300 custom-checkbox text-blue-600 focus:ring-blue-500"
//                 />
//                 <label htmlFor="saveAddress" className="ml-2 text-lg">
//                   Make this as my default address
//                 </label>
//               </div>
//             </section>
//           </div>
//           {/* Form Footer */}
//           <div className="sm:pt-3">
//             <div className="grid grid-cols-2 gap-4 sm:gap-8 space-x-4">
//               <Button
//                 label="CANCEL"
//                 variant="outline"
//                 className="px-6 py-3 w-full border !text-black border-black"
//                 onClick={onClose}
//               />
//               <Button
//                 label="SAVE"
//                 variant="solid"
//                 className="px-6 py-3 !bg-yellow-800"
//                 onClick={handleSubmit}
//               />
//             </div>

//             {contant && (
//               <p className="text-lg pt-4 text-md mb-4 md:mb-0">
//                 Your info will be saved to a Shop account. By continuing, you
//                 agree to Shop's Terms of Service and acknowledge the Privacy
//                 Policy .
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BillingDetailsForm;
