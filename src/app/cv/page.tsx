"use client";
import { useRouter } from "next/navigation";

export default function CVPage() {
  const router = useRouter();

  const goToUser = (id: string | number) => {
    router.push(`/cv/${id}`);
  };

  return (
    <div className="p-8 flex flex-col gap-6 justify-center items-center bg-white text-black min-h-screen">
      <h1>Dynamic Route Test</h1>
      <p>Click to navigate to dynamic user pages:</p>
      <div className=" gap-5 flex ">
        <button onClick={() => goToUser(1)} className="px-4 py-2 bg-green-400">
          Go to Cv 1
        </button>
        <button onClick={() => goToUser(2)} className="px-4 py-2 bg-green-400">
          Go to Cv 2
        </button>
        <button
          onClick={() => goToUser("abc")}
          className="px-4 py-2 bg-green-400"
        >
          Go to Cv &apos;abc&apos;
        </button>
      </div>
    </div>
  );
}
