"use client";

import Image from "next/image";

export default function CommunitySection() {
  return (
    <section className="w-full bg-white mt-20">
      <div className="mx-auto max-w-[1120px] px-6">
        {/* Heading */}
        <h2 className="text-center text-3xl md:text-[44px] font-extrabold leading-tight tracking-tight text-neutral-900">
          Join a global movement.
          <br />
          Unleash your creativity.
        </h2>

        {/* Subtext */}
        <p className="mx-auto mt-3 max-w-[740px] text-center text-[15px] md:text-[16px] leading-[24px] text-neutral-600">
          Our vibrant community produces content, teaches courses, and leads
          events all over the world.
        </p>

        {/* Learn more link */}
        <button className="mx-auto mt-3 block text-[15px] font-medium text-sky-600 hover:text-sky-700">
          Learn more →
        </button>

        {/* Faces strip */}
        <div className="mt-10 flex justify-center">
          <Image
            src="/community-faces.png"
            alt="Community faces"
            width={920}
            height={120}
            className="w-full max-w-[920px] h-auto select-none"
            sizes="(max-width: 980px) 100vw, 920px"
          />
        </div>

        {/* Top 3 Stats */}
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { big: "1M+", small: "community members" },
            { big: "150+", small: "community groups" },
            { big: "50+", small: "countries represented" },
          ].map((stat) => (
            <div
              key={stat.big}
              className="rounded-xl bg-neutral-50 border border-neutral-200 px-8 py-8 text-center shadow-sm"
            >
              <p className="text-[36px] font-extrabold text-neutral-900 tracking-tight">
                {stat.big}
              </p>
              <p className="mt-1 text-[14px] text-neutral-600 font-medium">
                {stat.small}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom two cards */}
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Left card */}
          <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-6 flex flex-col justify-between">
            <div>
              <p className="text-[15px] font-semibold text-neutral-900">
                An always-on support network
              </p>
              <p className="mt-1 text-[14px] leading-[22px] text-neutral-600">
                Swap setups and share tips in over 149 online communities.
              </p>
            </div>
            <div className="mt-6 flex justify-center">
              <Image
                src="/community-social.png"
                alt="Social network icons"
                width={500}
                height={454}
                className="w-[500px] h-auto select-none"
                sizes="(max-width: 768px) 100vw, 500px"
              />
            </div>
          </div>

          {/* Right card */}
          <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-6 flex flex-col justify-between">
            <div>
              <p className="text-[15px] font-semibold text-neutral-900">
                Choose your language
              </p>
              <p className="mt-1 text-[14px] leading-[22px] text-neutral-600">
                Notion currently supports English, Korean, Japanese, French,
                German, Spanish, and Portuguese. With more to come!
              </p>
            </div>
            <div className="mt-5">
              <Image
                src="/community-langs.png"
                alt="Notion in multiple languages"
                width={432}
                height={234}
                className="w-[432px] h-auto select-none"
                sizes="(max-width: 768px) 100vw, 432px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
