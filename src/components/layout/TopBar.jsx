"use client";

import { useState } from "react";
import Link from "next/link";
import Dropdown from "../Dropdown";
import { accountOptions, countries } from "@/data/data";
import { useRouter } from "next/navigation";

export default function HeaderWithDropdowns() {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [selectedAccount, setSelectedAccount] = useState(accountOptions[0]);
  const router = useRouter();

  return (
    <header className="bg-brown-800 hidden md:block shadow-md px-5 xl:px-0 text-white">
      <div className="container mx-auto">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="font-medium text-xl text-nowrap">
            Call Us : +123 4567 8790
          </Link>

          <div className="hidden md:flex items-center gap-4">
            {/* Country Dropdown */}
            <Dropdown
              options={countries}
              selectedOption={selectedCountry}
              onSelect={setSelectedCountry}
              renderSelected={(option) => (
                <div className="flex items-center gap-2 text-nowrap">
                  {/* {option.icon} {option.label} */}
                  <img
                    src={option.icon}
                    alt="img"
                    className="w-[1.5rem] h-[1.5rem] rounded-full"
                  />{" "}
                  {option.label}(CAD$)
                </div>
              )}
              renderOption={(option) => (
                <div className="flex items-center gap-2 text-nowrap">
                  {/* {option.icon} {option.label} */}
                  <img
                    src={option.icon}
                    alt="img"
                    className="w-[1.5rem] h-[1.5rem] rounded-full"
                  />{" "}
                  {option.label}(CAD$)
                </div>
              )}
              // className="w-50"
              dropdownClassName="w-48"
            />

            {/* Account Dropdown */}
            <Dropdown
              options={accountOptions}
              selectedOption={selectedAccount}
              onSelect={setSelectedAccount}
              className="w-30"
              dropdownClassName="w-25"
            />

            <Link
              href="/auth/sign-in"
              className="flex items-center gap-2 px-4 py-2 border border-white text-white bg-transparent rounded-lg cursor-pointer"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
