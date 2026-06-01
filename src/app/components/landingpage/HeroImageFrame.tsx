import React from "react";

export default function HeroImageFrame() {
  return (
    <section className="px-4 mx-auto mt-6 flex justify-center">
      <div
        className="
          relative w-full max-w-[1024px]
          rounded-xl md:rounded-2xl
          border border-black/10 bg-white/5
          shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden

          /* Tạo tỉ lệ khung hình trên mobile & tablet */
          aspect-[16/10] sm:aspect-[16/9]

          /* Desktop giữ nguyên chiều cao 640px */
          lg:aspect-auto lg:h-[640px]
        "
      >
        <video
          src="https://videos.ctfassets.net/spoqsaf9291f/60rdYX9BPk9yOnCdEb0nJC/a04c661d50bdad019963c8f9da70fa35/Desktop_HomepageHero_compressed_v007_650.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </section>
  );
}
