import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import prisma from "../../../lib/prisma";

// Funkcija za premestanje slike u uploads folder
const saveImage = async (file) => {
  const uploadPath = path.join(process.cwd(), "public", "uploads", file.name);
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  // Upisivanje fajla u uploads folder
  fs.writeFileSync(uploadPath, fileBuffer);

  return `/uploads/${file.name}`; // Putanja slike koju čuvamo u bazi
};

export async function POST(request) {
  const formData = await request.formData();
  const name = formData.get("name");
  const description = formData.get("description");
  const yearIssued = formData.get("yearIssued");
  const user = formData.get("user");
  const image = formData.get("image");

  if (!image) {
    return NextResponse.json({ success: false, error: "Image is required" });
  }

  try {
    // Sačuvaj sliku u uploads folder i dobij putanju
    const imagePath = await saveImage(image);

    // Kreiraj novu markicu u bazi sa putanjom slike
    const newStamp = await prisma.stamp.create({
      data: {
        name,
        description,
        yearIssued: parseInt(yearIssued),
        user,
        image: imagePath, // Putanja do slike u bazi
      },
    });

    return NextResponse.json({ success: true, data: newStamp });
  } catch (error) {
    console.error("Error while adding a stamp:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
