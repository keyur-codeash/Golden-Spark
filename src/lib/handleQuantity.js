import Toast from "@/components/toastService";

const MAX_QUANTITY = parseInt(process.env.NEXT_PUBLIC_MAX_QUANTITY || "4", 10);

// Handles incrementing quantity safely with limit.
export function handleIncrementQuantity(currentQty) {
  if (currentQty >= MAX_QUANTITY) {
    Toast.success(
      `We're sorry! Only ${MAX_QUANTITY} unit(s) allowed in each order`
    );
    return MAX_QUANTITY;
  }
  return currentQty + 1;
}

//   Handles decrementing quantity safely (min = 1).
export function handleDecrementQuantity(currentQty) {
  if (currentQty <= 1) {
    return 1;
  }
  return currentQty - 1;
}
