"use client";

import React from "react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
  FaInstagram,
  FaGlobeAmericas,
} from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"; 

const LANGS = [
  { label: "English (US)", value: "en-US" },
  { label: "English (UK)", value: "en-GB" },
  { label: "Tiếng Việt", value: "vi-VN" },
  { label: "日本語", value: "ja-JP" },
  { label: "한국어", value: "ko-KR" },
  { label: "Français", value: "fr-FR" },
  { label: "Deutsch", value: "de-DE" },
  { label: "Español", value: "es-ES" },
];

export default function Footer() {
  const handleLang = (val: string) => {
    // TODO: hook vào i18n của bạn.
    // Tạm thời: thêm query ?lang=... để bạn đọc ở middleware/app router.
    const url = new URL(window.location.href);
    url.searchParams.set("lang", val);
    window.location.assign(url.toString());
  };

  return (
    <footer className="w-full bg-white border-t border-neutral-200">
      <div className="mx-auto max-w-[1120px] px-6 py-12">
        {/* Top grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[260px_1fr]">
          {/* Brand + Social */}
          <div>
            <div className="flex items-center gap-2">
              <span className="shrink-0 size-7 grid place-items-center rounded-[4px] overflow-hidden">
                <img
                  src="/logo.png"
                  alt="logo"
                  className="block h-5 w-5 object-contain"
                />
              </span>
              <span className="text-[22px] font-semibold tracking-tight text-neutral-900">
                Notion
              </span>
            </div>

            <div className="mt-6 flex items-center gap-4 text-neutral-500">
              <a
                aria-label="Instagram"
                className="hover:text-neutral-800"
                href="#"
              >
                <FaInstagram size={18} />
              </a>
              <a aria-label="X" className="hover:text-neutral-800" href="#">
                <FaTwitter size={18} />
              </a>
              <a
                aria-label="LinkedIn"
                className="hover:text-neutral-800"
                href="#"
              >
                <FaLinkedinIn size={18} />
              </a>
              <a
                aria-label="Facebook"
                className="hover:text-neutral-800"
                href="#"
              >
                <FaFacebookF size={18} />
              </a>
              <a
                aria-label="YouTube"
                className="hover:text-neutral-800"
                href="#"
              >
                <FaYoutube size={18} />
              </a>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-4">
            <Column
              title="Company"
              items={[
                "About us",
                "Careers",
                "Security",
                "Status",
                "Terms & privacy",
                "Your privacy rights",
              ]}
            />
            <Column
              title="Download"
              items={[
                "iOS & Android",
                "Mac & Windows",
                "Calendar",
                "Web Clipper",
              ]}
            />
            <Column
              title="Resources"
              items={[
                "Help center",
                "Pricing",
                "Blog",
                "Community",
                "Integrations",
                "Templates",
                "Partner programs",
              ]}
            />
            <Column
              title="Notion for"
              items={["Enterprise", "Small business", "Personal"]}
            />
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Left: language + cookies + copyright */}
          <div className="flex flex-col gap-4">
            {/* Language selector (shadcn Select styled như pill) */}
            <Select defaultValue="en-US" onValueChange={handleLang}>
              <SelectTrigger className="w-[220px] justify-start gap-2 rounded-lg border-neutral-300 px-4 py-2 text-[14px] text-neutral-800">
                <FaGlobeAmericas className="mr-1" />
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent className="w-[220px]">
                {LANGS.map((l) => (
                  <SelectItem
                    key={l.value}
                    value={l.value}
                    className="text-[14px]"
                  >
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <a
              href="#"
              className="text-[14px] text-neutral-600 hover:text-neutral-900"
            >
              Cookie settings
            </a>
            <p className="text-[14px] text-neutral-500">
              © 2025 Notion Labs, Inc.
            </p>
          </div>

          {/* Right: Explore more */}
          <a
            href="#"
            className="text-[16px] font-semibold text-neutral-900 hover:opacity-80 self-start md:self-auto"
          >
            Explore more →
          </a>
        </div>
      </div>
    </footer>
  );
}

function Column({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="text-[16px] font-semibold text-neutral-900">{title}</h4>
      <ul className="mt-3 space-y-2">
        {items.map((t) => (
          <li key={t}>
            <a
              href="#"
              className="text-[15px] text-neutral-700 hover:text-neutral-900"
            >
              {t}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
