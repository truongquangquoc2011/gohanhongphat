"use client";
import { useRouter } from "next/navigation";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";

export default function Page() {
  const router = useRouter();

  return (
    <main>
      <Header/>
      <Hero />
      <Footer />
    </main>
  );
}
