import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET(request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");
  const page = parseInt(url.searchParams.get("page")) || 1; // Default to page 1 if no page is provided
  const pageSize = 8; // Number of stamps per page
  const offset = (page - 1) * pageSize; // Calculate the offset for pagination

  if (userId) {
    // Query the database for stamps associated with the specified user with pagination
    const [userStamps, totalCount] = await Promise.all([
      prisma.stamp.findMany({
        where: { userId: userId }, // Filter by the "userId" field
        skip: offset,
        take: pageSize,
        select: {
          id: true,
          name: true,
          description: true,
          yearIssued: true,
          image: true,
          createdAt: true,
          country: true,
        },
      }),
      prisma.stamp.count({
        where: { userId: userId },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize); // Calculate the total number of pages

    return NextResponse.json({
      stamps: userStamps, // Return the stamps for the current page
      totalPages, // Return the total number of pages
    });
  }

  // If no "user" parameter is provided, return an empty array as a JSON response
  return NextResponse.json({ stamps: [], totalPages: 0 });
}
