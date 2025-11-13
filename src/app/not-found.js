"use client";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const rounter = useRouter();
  return (
    <div>
      <section className="h-[calc(75vh)] flex justify-center items-center">
        <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div class="mx-auto max-w-screen-sm text-center">
            <h1 class="mb-4 text-7xl tracking-tight font-extrabold lg:text-8xl text-brown-1000 dark:text-primary-500">
              404
            </h1>
            <p class="mb-4 text-3xl tracking-tight font-bold text-brown-800 md:text-4xl">
              Something&apos;s missing.
            </p>
            <p class="mb-4 text-lg font-light text-brown-800">
              Sorry, we can&apos;t find that page. You&apos;ll find lots to explore on the
              home page.{" "}
            </p>
            <div className="pt-4">
              <Button
              
                label="Back to Homepage"
                color="blue"
                size="md"
                variant="solid"
                className="!bg-brown-900  px-5 !rounded-0 py-3.5 flex items-center gap-[10px]"
                onClick={() => rounter.push("/")}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
