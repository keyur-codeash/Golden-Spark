import connectToDB from "@/lib/dbConnect";

export function asyncHandler(handler) {
  return async function (req, ctx) {
    try {
      await connectToDB(); 
      const response = await handler(req, ctx); 
      return response;
    } catch (error) {
      console.error("API Error:", error);
      return Response.json(
        {
          isSuccess: false,
          message: error?.message || "Internal server error",
        },
        { status: 500 }
      );
    }
  };
}