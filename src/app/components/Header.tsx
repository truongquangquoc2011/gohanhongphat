"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/app/components/ui/navigation-menu";
import { Button } from "@/app/components/ui/button";
import { Separator } from "@/app/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/app/components/ui/sheet";
import { FiMenu, FiX, FiChevronRight } from "react-icons/fi";

type SubItem = { label: string; href?: string; desc?: string };
type Group = { key: string; label: string; items: SubItem[] };

const MENU: Group[] = [
  {
    key: "product",
    label: "Product",
    items: [
      { label: "AI", desc: "Ask anything" },
      { label: "Docs", desc: "Simple, powerful" },
      { label: "Wikis", desc: "Centralize knowledge" },
      { label: "Projects", desc: "Manage work" },
      { label: "Calendar", desc: "Plan time" },
    ],
  },
  {
    key: "download",
    label: "Download",
    items: [
      { label: "Mac & Windows" },
      { label: "iOS & Android" },
      { label: "Web Clipper" },
    ],
  },
  {
    key: "solutions",
    label: "Solutions",
    items: [
      { label: "Personal" },
      { label: "Students" },
      { label: "Startup" },
      { label: "Enterprise" },
    ],
  },
  {
    key: "resources",
    label: "Resources",
    items: [
      { label: "Templates" },
      { label: "Help Center" },
      { label: "Community" },
      { label: "Blog" },
    ],
  },
];

export default function Header() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  // helper: push & đóng sheet nếu đang mở
  const push = (href: string) => {
    if (!href) return;
    setOpen(false);
    router.push(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur border-b border-neutral-200">
      <div className="w-full px-4">
        <div className="flex h-14 items-center justify-between">
          {/* LEFT: logo */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2.5 select-none"
              aria-label="Home"
            >
              <span className="shrink-0 size-7 grid place-items-center rounded-[4px] overflow-hidden">
                <img
                  src="/logo.png"
                  alt="logo"
                  className="block h-5 w-5 object-contain"
                />
              </span>
              <span className="text-[15px] font-semibold tracking-tight text-neutral-900 leading-none translate-y-[0.5px]">
                Notion
              </span>
            </button>

            {/* Desktop nav -> chỉ hiện ở ≥lg (tablet vẫn dùng menu mobile) */}
            <div className="hidden lg:block ml-2">
              <NavigationMenu>
                <NavigationMenuList>
                  {MENU.map((g) => (
                    <NavigationMenuItem key={g.key}>
                      <NavigationMenuTrigger className="text-[14px]">
                        {g.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="p-2">
                        <div className="w-[320px] rounded-xl border border-neutral-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-2">
                          {g.items.map((it, i) => (
                            <button
                              key={i}
                              onClick={() => it.href && router.push(it.href)}
                              className="w-full text-left rounded-lg px-3 py-2.5 hover:bg-neutral-100"
                            >
                              <div className="text-[14px] font-medium text-neutral-900">
                                {it.label}
                              </div>
                              {it.desc && (
                                <div className="text-[12px] text-neutral-500">
                                  {it.desc}
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ))}

                  <NavigationMenuItem>
                    <button
                      onClick={() => router.push("/pricing")}
                      className="px-3 py-2 rounded-md text-[14px] font-medium text-neutral-800 hover:bg-neutral-100"
                    >
                      Pricing
                    </button>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          {/* RIGHT (desktop) */}
          <div className="hidden lg:flex items-center">
            <button
              onClick={() => router.push("/demo")}
              className="px-3 py-2 text-[14px] text-neutral-700 hover:text-neutral-900 rounded-md hover:bg-neutral-100"
            >
              Request a demo
            </button>

            <Separator orientation="vertical" className="mx-2 h-4" />

            <button
              onClick={() => router.push("/login")}
              className="px-3 py-2 text-[14px] text-neutral-700 hover:text-neutral-900 rounded-md hover:bg-neutral-100"
            >
              Log in
            </button>

            <Button
              onClick={() => router.push("/signup")}
              className="ml-2 rounded-md bg-neutral-900 text-white px-4 py-[9px] text-[14px] font-semibold shadow-md hover:bg-neutral-900/90"
            >
              Get Notion free
            </Button>
          </div>

          {/* Mobile & Tablet: hamburger + sheet */}
          <div className="lg:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button
                  aria-label="Open menu"
                  aria-expanded={open}
                  className="size-11 grid place-items-center rounded-xl hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300"
                >
                  {open ? <FiX size={22} /> : <FiMenu size={22} />}
                </button>
              </SheetTrigger>

              {/* FULLSCREEN sheet để dễ thao tác trên mobile */}
              <SheetContent
                side="top"
                className="p-0 h-[100dvh] max-h-[100dvh] overflow-y-auto"
              >
                {/* Top bar với nút X to, dễ bấm */}
                <div className="sticky top-0 z-10 flex items-center justify-between px-4 h-14 border-b border-neutral-200 bg-white">
                  <div className="flex items-center gap-2">
                    <span className="size-7 grid place-items-center rounded-[4px] overflow-hidden">
                      <img
                        src="/logo.png"
                        alt="logo"
                        className="block h-5 w-5 object-contain"
                      />
                    </span>
                    <span className="text-[15px] font-semibold">Notion</span>
                  </div>
                  <SheetClose asChild>
                    <button
                      aria-label="Close menu"
                      className="size-11 grid place-items-center rounded-xl hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300"
                    >
                      <FiX size={22} />
                    </button>
                  </SheetClose>
                </div>

                {/* Content */}
                <div className="px-4 py-3">
                  {MENU.map((g) => (
                    <div key={g.key} className="w-full">
                      <details className="group">
                        <summary className="list-none cursor-pointer flex items-center justify-between rounded-lg px-3 h-12 text-left text-[15px] hover:bg-neutral-100">
                          {g.label}
                          <span className="transition-transform group-open:rotate-90">
                            <FiChevronRight />
                          </span>
                        </summary>
                        <div className="pl-3 pb-2">
                          {g.items.map((it, idx) => (
                            <button
                              key={idx}
                              onClick={() =>
                                it.href ? push(it.href) : undefined
                              }
                              className="w-full rounded-lg px-3 h-11 text-left text-[15px] text-neutral-700 hover:bg-neutral-100"
                            >
                              {it.label}
                            </button>
                          ))}
                        </div>
                      </details>
                    </div>
                  ))}

                  <button
                    onClick={() => push("/pricing")}
                    className="mt-1 flex w-full items-center justify-between rounded-lg px-3 h-12 text-left text-[15px] hover:bg-neutral-100"
                  >
                    <span>Pricing</span>
                    <FiChevronRight />
                  </button>

                  <div className="my-3 h-px bg-neutral-200" />

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => push("/demo")}
                      className="rounded-lg px-3 h-12 text-left text-[15px] hover:bg-neutral-100"
                    >
                      Request a demo
                    </button>
                    <button
                      onClick={() => push("/login")}
                      className="rounded-lg px-3 h-12 text-left text-[15px] hover:bg-neutral-100"
                    >
                      Log in
                    </button>
                    <Button
                      onClick={() => push("/signup")}
                      className="mt-1 w-full rounded-md bg-neutral-900 text-white px-4 h-12 text-[15px] font-semibold shadow-md hover:bg-neutral-900/90"
                    >
                      Get Notion free
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
