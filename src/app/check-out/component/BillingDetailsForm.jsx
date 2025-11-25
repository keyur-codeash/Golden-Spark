"use client";
import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Button from "@/components/Button";
import countriesData from "../../../../src/countries+states+cities.json";
import Link from "next/link";
import InputField from "@/components/Input";
import { useRouter } from "next/navigation";
import { addressSchema } from "@/forntend/validation/validation";

const ADDRESS_TYPES = [
  { value: "Home", label: "Home" },
  { value: "Office", label: "Office" },
  { value: "Apartment", label: "Apartment" },
  { value: "Other", label: "Other" },
];

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

  // Load countries once on mount
  useEffect(() => {
    try {
      setCountries(countriesData); // Assuming countriesData is an array of countries
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching countries:", error);
      setIsLoading(false);
    }
  }, []);

  // Handle country change to update states
  const handleCountryChange = (countryName, setFieldValue) => {
    const selectedCountry = countries.find((c) => c.name === countryName);
    if (selectedCountry) {
      setStates(selectedCountry.states || []);
    } else {
      setStates([]); // Reset states if no country found
    }
    setFieldValue("state", ""); // Reset state when country changes
  };

  const initialFormValues = {
    address: "",
    email: "",
    type: "",
    country: "",
    firstName: "",
    lastName: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    isDefault: "",
    subscribe: true,
    isDefault: false,
    ...initialValues,
  };

  useEffect(() => {
    if (initialValues?.country) {
      const selectedCountry = countriesData.find(
        (c) => c.name === initialValues.country
      );
      console.log("selectedCountry===", selectedCountry);

      if (selectedCountry) {
        setStates(selectedCountry.states || []);
      }
    }
  }, [initialValues]);

  console.log("states===============13414", initialFormValues);

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
              onSubmit={async (values) => {
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

                  <section className="mb-5">
                    <h2 className="text-2xl font-semibold mb-4">
                      Delivery Information
                    </h2>

                    <div className="relative mb-6">
                      <Field
                        as="select"
                        name="type"
                        className="block w-full pt-5 pb-1 ps-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 peer bg-transparent"
                      >
                        <option value="Select type"></option>
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
                          const country = e.target.value;
                          setFieldValue("country", country);
                          handleCountryChange(country, setFieldValue);
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
                          // disabled={!values.country}
                          className="w-full px-4 py-3.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
                        >
                          <option value="gujrat">State</option>

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
                        id="isDefault"
                        type="checkbox"
                        name="isDefault"
                        className="h-4 w-4 rounded border-gray-300 custom-checkbox text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="isDefault" className="ml-2 text-lg">
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
