"use client";
import Image from "next/image";
import React from "react";
import { useUserContext } from "@/context/userContext";
import MyFacebookLoader from "./profileLoader";
import useProfileUpdate from "../../../hooks/profileUpdate/useProfileUpdate";
import apiCall from "@/utils/backEndApiHandler";
import { useRouter } from "next/navigation";

export default function ProfileDetails() {
  const { user, setUser } = useUserContext();
  const router = useRouter();

  const {
    update,
    tempUrl,
    saving,
    imageSizeExceeded,
    profilePictureChanged,
    handleUpdateProfileDetails,
    handleProfilePictureDelete,
    handleProfilePictureUpdate,
    changedFields,
    handleUpdate,
  } = useProfileUpdate({ user, setUser });

  const handleSignOut = async () => {
    if (!user) {
      return;
    }
    const res = await apiCall("/api/auth/logout", "POST", { userId: user._id });
    if (res.data.status === "error") {
      console.log("Signout Failed!");
      return;
    }
    setUser(null);
    router.push("/login");
  };

  return update ? (
    <div className="">
      <form onSubmit={handleUpdateProfileDetails}>
        <div className="flex justify-between items-center mb-4 max-md:!items-start ">
          <div className="flex flex-row items-center gap-4 max-880:flex-col max-880:items-start">
            <Image
              src={
                profilePictureChanged && profilePictureChanged !== "Delete"
                  ? tempUrl || ""
                  : update.profilePicture === "" ||
                    profilePictureChanged === "Delete"
                  ? "/images/profile.svg"
                  : update.profilePicture
              }
              className="rounded-full"
              width={100}
              height={100}
              alt="profile"
            />

            <div className="flex flex-row gap-2  max-sm:flex-col   ">
              <label
                htmlFor="profilePicture"
                className="bg-[#7695FF] text-white px-4 py-3 rounded-xl cursor-pointer"
              >
                Change picture
                <input
                  onChange={(e) =>
                    handleProfilePictureUpdate(e.target.files?.[0])
                  }
                  className="hidden"
                  accept="image/*"
                  type="file"
                  id="profilePicture"
                />
              </label>
              {update.profilePicture !== "" && (
                <button
                  onClick={handleProfilePictureDelete}
                  type="button"
                  className="bg-red-500 ml-0 text-white px-4 py-2 rounded-xl"
                >
                  Delete picture
                </button>
              )}
            </div>
            {imageSizeExceeded && (
              <p className={`text-red-400 font-semibold`}>
                *File Size must be of 600x600
              </p>
            )}
          </div>
          <button
            type="button"
            className="bg-red-500 flex flex-row gap-2 text-white px-4 py-2 max-md:hidden rounded-xl"
            onClick={handleSignOut}
          >
            <Image
              className="icon-white"
              src="/images/signout.svg"
              width={25}
              height={25}
              alt="Signout"
            />
            SignOut
          </button>
          <button
            type="button"
            className="bg-red-500  flex-row gap-2 text-white px-4 py-2 hidden rounded-xl max-md:flex"
            onClick={handleSignOut}
          >
            <Image
              className="icon-white"
              src="/images/signout.svg"
              width={25}
              height={25}
              alt="Signout"
            />
          </button>
        </div>

        <label htmlFor="firstName" className="block text-gray-700">
          First Name
        </label>
        <input
          type="text"
          id="firstName"
          value={update.firstName}
          onChange={(e) => handleUpdate("firstName", e.target.value)}
          className="w-full p-2 border rounded-xl mb-4"
        />

        <label htmlFor="lastName" className="block text-gray-700">
          Last name
        </label>
        <input
          type="text"
          id="lastName"
          value={update.lastName}
          onChange={(e) => handleUpdate("lastName", e.target.value)}
          className="w-full p-2 border rounded-xl mb-4"
        />

        <label htmlFor="email" className="block text-gray-700">
          Email{" "}
          <span
            className="text-[0.8rem] text-red-400
      "
          >
            {" "}
            *Email cannot be Changed!
          </span>
        </label>
        <input
          onChange={(e) => handleUpdate("email", e.target.value)}
          value={update.email}
          type="email"
          id="email"
          className="w-full p-2 border rounded-xl mb-4 bg-gray-200 outline-none"
          readOnly
        />

        <button
          type="submit"
          disabled={
            !profilePictureChanged && Object.keys(changedFields).length === 0
          }
          className={`w-full flex items-center justify-center ${
            Object.keys(changedFields).length === 0 && !profilePictureChanged
              ? "bg-gray-400 h-[40px] cursor-not-allowed"
              : "bg-lightBlue"
          } ${
            saving ? "cursor-not-allowed" : ""
          } text-white px-4 py-2 rounded-xl`}
        >
          {saving ? <div className="loader"></div> : "Save changes"}
        </button>
      </form>
    </div>
  ) : (
    <MyFacebookLoader />
  );
}
