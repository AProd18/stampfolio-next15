"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Pagination from "../../components/Pagination";
import SearchBar from "../../components/SearchBar";
import Image from "next/image";
import Button from "@/components/ui/Button";

const MyCollections = () => {
  const { data: session } = useSession();
  const [stamps, setStamps] = useState([]);
  const [filteredStamps, setFilteredStamps] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingStamp, setEditingStamp] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    yearIssued: "",
    country: "",
    image: "",
  });

  const [stampToDelete, setStampToDelete] = useState(null);

  useEffect(() => {
    if (session?.user?.id) {
      const fetchStamps = async () => {
        const res = await fetch(
          `/api/collections?userId=${session.user.id}&page=${currentPage}`
        );
        const data = await res.json();
        setStamps(data.stamps);
        setFilteredStamps(data.stamps);
        setTotalPages(data.totalPages);
      };

      fetchStamps();
    }
  }, [session, currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (query) => {
    const lowerQuery = query.toLowerCase();
    const filtered = stamps.filter((stamp) => {
      return (
        stamp.name.toLowerCase().includes(lowerQuery) ||
        stamp.yearIssued.toString().includes(lowerQuery) ||
        stamp.country.toLowerCase().includes(lowerQuery)
      );
    });
    setFilteredStamps(filtered);
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/collections/${id}`, { method: "DELETE" });

    if (res.ok) {
      const updatedStamps = stamps.filter((stamp) => stamp.id !== id);
      setStamps(updatedStamps);
      setFilteredStamps(updatedStamps);
    } else {
      alert("Failed to delete stamp.");
    }
  };

  const handleEditClick = (stamp) => {
    setEditingStamp(stamp);
    setFormValues({
      name: stamp.name,
      description: stamp.description,
      yearIssued: stamp.yearIssued,
      country: stamp.country,
      image: stamp.image || "",
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formValues.image && editingStamp?.image) {
      formValues.image = editingStamp.image; // Keep the current image if not changed
    }

    // Ensure yearIssued is a number before sending
    formValues.yearIssued = parseInt(formValues.yearIssued);

    const res = await fetch(`/api/collections/${editingStamp.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formValues),
    });

    if (res.ok) {
      const updatedStamp = await res.json();
      const updatedStamps = stamps.map((stamp) =>
        stamp.id === editingStamp.id ? updatedStamp.stamp : stamp
      );

      setStamps(updatedStamps);
      setFilteredStamps(updatedStamps);

      setEditingStamp(null);
    } else {
      alert("Failed to update stamp.");
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4"></h1>

      {/* Search bar */}
      <SearchBar onSearch={handleSearch} />

      {/* Toggle View Mode */}
      <div className="flex justify-end space-x-4 mb-4">
        <Button
          onClick={() => setViewMode("grid")}
          viewMode={viewMode}
          mode="grid"
        >
          Grid View
        </Button>
        <Button
          onClick={() => setViewMode("list")}
          viewMode={viewMode}
          mode="list"
        >
          List View
        </Button>
      </div>

      {/* Displaying stamps */}
      {filteredStamps.length === 0 ? (
        <p>No stamps found</p>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredStamps.map((stamp) => (
            <div
              key={stamp.id}
              className="border rounded-lg overflow-hidden bg-card text-text backdrop-blur-sm bg-opacity-90 dark:via-gray-700 dark:to-gray-800 border-gray-300 dark:border-gray-600 flex flex-col justify-between"
            >
              {stamp.image ? (
                <Image
                  src={stamp.image}
                  alt={stamp.name}
                  width={400}
                  height={300}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-300 flex justify-center items-center">
                  <span className="text-white">No Image</span>
                </div>
              )}
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-200">
                  {stamp.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                  {stamp.description}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                  <span className="font-bold">Year Issued:</span>{" "}
                  {stamp.yearIssued}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                  <span className="font-bold">Country:</span> {stamp.country}
                </p>
              </div>
              <div className="mt-4 flex space-x-2 p-4">
                <button
                  onClick={() => handleEditClick(stamp)}
                  className="px-3 py-0.5 rounded flex-1 shadow-md transition-colors duration-200 bg-gray-300 hover:bg-gray-400 text-gray-800 hover:text-black text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => setStampToDelete(stamp.id)}
                  className="flex-1 bg-red-200 hover:bg-red-100 text-red-800 hover:text-red-900 px-3 py-0.5 rounded text-sm transition-colors duration-200 shadow-md"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // List View
        <div className="flex flex-col space-y-4">
          {filteredStamps.map((stamp) => (
            <div
              key={stamp.id}
              className="flex items-center space-x-4 border p-4 rounded bg-card text-text backdrop-blur-sm bg-opacity-90 dark:via-gray-700 dark:to-gray-800 border-gray-300 dark:border-gray-600"
            >
              {stamp.image ? (
                <Image
                  src={stamp.image}
                  alt={stamp.name}
                  width={80}
                  height={60}
                  className="rounded object-cover"
                />
              ) : (
                <div className="w-20 h-16 bg-gray-300 flex justify-center items-center text-gray-700 rounded">
                  No Image
                </div>
              )}
              <div className="flex-grow">
                <h3 className="font-semibold text-lg text-gray-600 dark:text-gray-200">
                  {stamp.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {stamp.description}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  <span className="font-bold">Year Issued:</span>{" "}
                  {stamp.yearIssued},{" "}
                  <span className="font-bold">Country:</span> {stamp.country}
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => handleEditClick(stamp)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 hover:text-black px-3 py-1 rounded text-sm transition-colors duration-200 shadow-md flex items-center justify-center"
                >
                  <span className="material-icons-outlined mr-1 text-base"></span>
                  Edit
                </button>
                <button
                  onClick={() => setStampToDelete(stamp.id)}
                  className="bg-red-200 hover:bg-red-100 text-red-800 hover:text-red-900 px-3 py-1 rounded text-sm transition-colors duration-200 shadow-md flex items-center justify-center"
                >
                  <span className="material-icons-outlined mr-1 text-base"></span>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      {stampToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Are you sure you want to delete this stamp?
            </h2>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setStampToDelete(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleDelete(stampToDelete);
                  setStampToDelete(null);
                }}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {editingStamp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <form
            onSubmit={handleFormSubmit}
            className="bg-white dark:bg-gray-900 text-text dark:text-gray-100 p-6 rounded shadow-lg"
          >
            <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-gray-200">
              Edit Stamp
            </h2>

            <label
              className="block text-sm font-semibold mb-2 text-gray-600 dark:text-gray-300"
              htmlFor="name"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={formValues.name}
              onChange={(e) =>
                setFormValues({ ...formValues, name: e.target.value })
              }
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-2 w-full mb-4"
            />

            <label
              className="block text-sm font-semibold mb-2 text-gray-600 dark:text-gray-300"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              value={formValues.description}
              onChange={(e) =>
                setFormValues({ ...formValues, description: e.target.value })
              }
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-2 w-full mb-4"
              maxLength={125}
            />
            <div className="text-right text-sm text-gray-500 dark:text-gray-400">
              {formValues.description.length}/125
            </div>
            <label
              className="block text-sm font-semibold mb-2 text-gray-600 dark:text-gray-300"
              htmlFor="yearIssued"
            >
              Year Issued
            </label>
            <input
              id="yearIssued"
              type="number"
              value={formValues.yearIssued}
              onChange={(e) =>
                setFormValues({ ...formValues, yearIssued: e.target.value })
              }
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-2 w-full mb-4"
            />

            <label
              className="block text-sm font-semibold mb-2 text-gray-600 dark:text-gray-300"
              htmlFor="country"
            >
              Country
            </label>
            <input
              id="country"
              type="text"
              value={formValues.country}
              onChange={(e) =>
                setFormValues({ ...formValues, country: e.target.value })
              }
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-2 w-full mb-4"
            />

            <label
              className="block text-sm font-semibold mb-2 text-gray-600 dark:text-gray-300"
              htmlFor="image"
            >
              Image:
            </label>
            <div className="flex items-center mb-4">
              <input
                id="image"
                type="file"
                onChange={(e) =>
                  setFormValues({ ...formValues, image: e.target.files[0] })
                }
                className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-2 w-full"
              />
              <span className="ml-4 text-sm text-gray-500 dark:text-gray-300">
                {formValues.image?.name || "No file chosen"}
              </span>
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditingStamp(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded shadow"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MyCollections;
