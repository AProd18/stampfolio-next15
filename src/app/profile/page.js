"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function Profile() {
  const { data: session } = useSession();
  const [profileImage, setProfileImage] = useState(null);
  const [aboutMe, setAboutMe] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (session?.user?.email) {
      fetch(`/api/profile`) // Now we call the GET API that we added
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setProfileImage(data.user.profileImage || "");
            setAboutMe(data.user.aboutMe || "");
          } else {
            console.error("Failed to fetch profile:", data.error);
          }
        })
        .catch((error) => console.error("Error fetching profile:", error));
    }
  }, [session]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleSaveChanges = async () => {
    if (password && password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const formData = new FormData();
    formData.append("aboutMe", aboutMe);
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    const response = await fetch("/api/profile", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (result.success) {
      alert("Profile updated successfully!");
    } else {
      alert("Error updating profile");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      <div className="mb-6 text-center">
        <div className="relative w-32 h-32 mx-auto">
          {profileImage ? (
            <Image
              src={profileImage}
              alt="Profile"
              width={128}
              height={128}
              className="rounded-full border border-gray-300"
            />
          ) : (
            <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center text-white">
              No Image
            </div>
          )}
        </div>
        <label
          htmlFor="profileImage"
          className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600"
        >
          Upload Image
        </label>
        <input
          type="file"
          id="profileImage"
          className="hidden"
          accept="image/*"
          onChange={handleImageUpload}
        />
      </div>

      <div className="mb-6">
        <label htmlFor="aboutMe" className="block text-lg font-medium mb-2">
          About Me
        </label>
        <textarea
          id="aboutMe"
          value={aboutMe}
          onChange={(e) => setAboutMe(e.target.value)}
          className="w-full p-2 border rounded-lg"
          rows={4}
          placeholder="Write something about yourself..."
        />
      </div>

      <button
        onClick={handleSaveChanges}
        className="w-full px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        Save Changes
      </button>
    </div>
  );
}
