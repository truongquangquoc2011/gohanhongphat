"use client"
import { useParams, useRouter } from "next/navigation";

interface User {
  name: string;
  age: number;
}
// Mock data
const mockUsers: Record<string, User> = {
  1: { name: "Alice", age: 25 },
  2: { name: "Bob", age: 30 },
  abc: { name: "Charlie", age: 22 },
};

export default function UserPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  if (typeof id !== "string") {
    return <div className="p-8">Invalid cv ID</div>;
  }
  const user = mockUsers[id];

  return (
    <div className="p-8 bg-white text-black min-h-screen flex gap-6 justify-center items-center">
      <h1>User Detail Page</h1>
      <p>
        <strong>ID:</strong> {id}
      </p>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Age:</strong> {user.age}
      </p>
      <button className="px-4 py-2 bg-green-400" onClick={() => router.push("/")}>Back to Home</button>
    </div>
  );
}
