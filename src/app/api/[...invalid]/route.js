// app/api/[...invalid]/route.js
export const dynamic = "force-static";
export const revalidate = 0;

import { NextResponse } from "next/server";

function routeNotFound() {
  return NextResponse.json({ message: "Route not found" }, { isSuccess: 404 });
}

function handleError(err) {
  console.error("API Error:", err);
  return NextResponse.json(
    { message: "Internal server error" },
    { isSuccess: 500 }
  );
}

export async function GET() {
  try {
    return routeNotFound();
  } catch (err) {
    return handleError(err);
  }
}

export async function POST() {
  try {
    return routeNotFound();
  } catch (err) {
    return handleError(err);
  }
}

export async function PUT() {
  try {
    return routeNotFound();
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE() {
  try {
    return routeNotFound();
  } catch (err) {
    return handleError(err);
  }
}
