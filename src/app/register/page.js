"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Sending user credentials
        body: JSON.stringify({ email, name, password }),
      });

      if (!response.ok) {
        throw new Error("Error registering user");
      }

      // Automatically log in the user after successful registration
      signIn("credentials", {
        redirect: false,
        email,
        password,
      }).then(({ error }) => {
        if (error) {
          setError(error);
        } else {
          router.push("/"); // Redirect to homepage on successful login
        }
      });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen opacity-90">
      <div className="w-full max-w-sm bg-[var(--card)] text-[var(--card-foreground)] p-6 rounded-lg shadow-md transition-colors duration-300">
        <h1 className="text-xl font-semibold text-center mb-6">
          Sign up with a new account
        </h1>
        <form onSubmit={handleRegister} className="flex flex-col space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Username"
              className="p-3 border border-gray-300 dark:border-gray-600 rounded-md w-full bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="p-3 border border-gray-300 dark:border-gray-600 rounded-md w-full bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="p-3 border border-gray-300 dark:border-gray-600 rounded-md w-full bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="mt-4 p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Sign Up
          </button>
          {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
        </form>
      </div>
    </main>
  );
}
