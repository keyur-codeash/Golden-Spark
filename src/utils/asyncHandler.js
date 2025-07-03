import connectToDB from "@/lib/dbConnect";

export function asyncHandler(handler) {
  return async function (req, ctx) {
    try {
      await connectToDB(); // Ensure DB is connected
      const response = await handler(req, ctx); // Execute original handler
      return response;
    } catch (error) {
      console.error("API Error:", error);

      return Response.json(
        {
          isSuccess: false,
          error: error?.message || "Internal server error",
        },
        { status: 500 }
      );
    }
  };
}
