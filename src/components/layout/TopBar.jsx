"use client";

import { useState } from "react";
import Link from "next/link";
import Dropdown from "../Dropdown";
import { accountOptions, countries } from "@/data/data";
import { useRouter } from "next/navigation";
import Button from "../Button";
import useToken from "@/forntend/hooks/useToken";
import Toast from "@/components/toastService";
import { useWishlist } from "@/forntend/context/WishlistContext";
import Swal from "sweetalert2";

export default function HeaderWithDropdowns() {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [selectedAccount, setSelectedAccount] = useState(accountOptions[0]);
  const router = useRouter();
  const { token, removeToken } = useToken();
  const { wishlist, setWishlist, removeFromWishlist } = useWishlist();

  // Handle logout with SweetAlert2 modal
  const handleClick = () => {
    if (token) {
      Swal.fire({
        title: "Are you sure you want to log out?",

        text: "This will end your session, and you'll need to log in again.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, log out",
        cancelButtonText: "Cancel",
        customClass: {
          popup: "bg-gray-800 text-white shadow-xl rounded-lg",
          title: "text-xl font-semibold",
          content: "text-lg",
          confirmButton:
            "bg-blue-600 text-white hover:bg-blue-700 border-none rounded-lg px-6 py-2 font-medium",
          cancelButton:
            "bg-gray-500 text-white hover:bg-gray-600 border-none rounded-lg px-6 py-2 font-medium",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          // Perform logout actions
          removeToken();
          Toast.success("Logged out successfully!");
          setWishlist([]);
          router.push("/");
          Swal.fire({
            title: "Logged out!",
            text: "You have been successfully logged out.",
            icon: "success",
            customClass: {
              popup: "bg-gray-800 text-white shadow-xl rounded-lg",
            },
          });
        }
      });
    } else {
      // If not logged in, redirect to login page
      router.push("/auth/sign-in");
    }
  };

  return (
    <header className="bg-brown-800 hidden md:block shadow-lg px-6 xl:px-0 text-white">
      <div className="container mx-auto">
        <div className="flex justify-between items-center h-16">
          <Link
            href="tel:1234567890"
            className="font-medium text-xl text-white hover:text-gray-300 transition duration-200"
          >
            Call Us : +123 4567 8790
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {/* Country Dropdown */}
            <Dropdown
              options={countries}
              selectedOption={selectedCountry}
              onSelect={setSelectedCountry}
              renderSelected={(option) => (
                <div className="flex items-center gap-2 text-nowrap text-white">
                  <img
                    src={option.icon}
                    alt="country-icon"
                    className="w-6 h-6 rounded-full"
                  />{" "}
                  <span>{option.label}(CAD$)</span>
                </div>
              )}
              renderOption={(option) => (
                <div className="flex items-center gap-2 text-nowrap">
                  <img
                    src={option.icon}
                    alt="country-icon"
                    className="w-6 h-6 rounded-full"
                  />{" "}
                  <span>{option.label}(CAD$)</span>
                </div>
              )}
              dropdownClassName="w-56 shadow-lg bg-white text-black rounded-lg"
            />

            {/* Account Dropdown */}
            <Dropdown
              options={accountOptions}
              selectedOption={selectedAccount}
              onSelect={setSelectedAccount}
              className="w-32"
              dropdownClassName="w-36 shadow-lg bg-white text-black rounded-lg"
            />

            {/* Login/Logout Button */}
            <Button
              label={token ? "Log out" : "Log in"}
              color="blue"
              size="md"
              variant="solid"
              className="flex items-center gap-2 px-4 py-2 border border-white text-white !bg-transparent rounded-lg cursor-pointer hover:bg-blue-600 transition duration-200"
              onClick={handleClick}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
