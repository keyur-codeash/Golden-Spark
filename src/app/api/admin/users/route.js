import Userschema from "@/model/Userschema";
import { asyncHandler } from "@/utils/asyncHandler";
import { NextResponse } from "next/server";

export const GET = asyncHandler(async (req) => {
  const { searchParams } = new URL(req.url);

  // Pagination
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const skip = (page - 1) * limit;

  // Search by userName
  const search = searchParams.get("search") || "";

  const query = search ? { userName: { $regex: search, $options: "i" } } : {};

  const [data, total] = await Promise.all([
    Userschema.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Userschema.countDocuments(query),
  ]);

  const userdetails = data.map((item) => {
    return {
      _id: item._id,
      userName: item.userName,
      email: item.email,
      createdAt: item.createdAt,
      login_type : item.login_type
    };
  });

  return NextResponse.json({
    isSuccess: true,
    data: userdetails,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
});
