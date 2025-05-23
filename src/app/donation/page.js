"use client";

import { useState } from "react";

export default function DonationPage() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");

  const handleDonation = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      alert("Please enter a valid donation amount.");
      return;
    }

    alert(
      `Thank you${name ? `, ${name}` : ""}, for your donation of $${amount}!`
    );
    setAmount("");
    setName("");
    setNote("");
    setMessage("Your support means a lot to us. Thank you!");
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-2xl mx-auto p-6 rounded-lg shadow-md bg-[var(--card)] text-[var(--card-foreground)] opacity-95 transition-colors duration-300">
        <h1 className="text-3xl font-bold mb-6 text-gray-700 dark:text-gray-200">
          Support the Future of{" "}
          <span className="text-green-600 dark:text-green-400">Philatopia</span>
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mb-4">
          <strong>Philatopia</strong> is a <em>community-driven platform</em>{" "}
          created with love for philately. If you&apos;ve found value in our
          work, consider making a contribution to help us grow and continue
          delivering meaningful features.
        </p>

        <div className="text-gray-600 dark:text-gray-300 mb-4">
          <p>Your donation directly supports:</p>
          <ul className="list-disc list-inside ml-4 mt-2 text-sm text-gray-700 dark:text-gray-200">
            <li>
              <strong>Server maintenance</strong>
            </li>
            <li>
              <strong>Feature development</strong>
            </li>
            <li>
              <strong>Keeping the platform free</strong> for all collectors
            </li>
          </ul>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          <em>Every contribution, big or small, truly makes a difference.</em>
        </p>

        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1"
          >
            Your Name <span className="text-gray-400">(optional)</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg"
            placeholder="Enter your name"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1"
          >
            Donation Amount <span className="text-gray-400">($)</span>
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg"
            placeholder="Enter amount"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="note"
            className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1"
          >
            Message <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg resize-none"
            rows={3}
            placeholder="Leave a short message or comment"
          />
        </div>

        <button
          onClick={handleDonation}
          className="w-full px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
        >
          Donate Now
        </button>

        {message && (
          <p className="mt-4 text-center text-green-700 dark:text-green-400 font-medium italic">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
