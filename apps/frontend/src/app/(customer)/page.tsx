"use client";
import { useAuthStore } from "@/common/stores/auth.store";
import { getAllWithSlug } from "@/api/organizations";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";

export default function Home() {
  const [isRedirecting, setIsRedirecting] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuthStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const { data } = useQuery({
    queryKey: ["organization_all_with_slug"],
    queryFn: getAllWithSlug,
    retry: false,
  });

  const organizations = data?.data ?? [];

  const filtered = organizations.filter((org: any) =>
    org.name.toLowerCase().includes(search.toLowerCase()),
  );

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (user === undefined) return;
    const redirect = Cookies.get("post_auth_redirect");
    if (redirect && user?.type === "CUSTOMER") {
      Cookies.remove("post_auth_redirect");
      router.push(redirect);
      return;
    }
    setIsRedirecting(false);
  }, [router, user]);

  if (isRedirecting) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <main className="h-screen w-full pt-16 bg-[linear-gradient(135deg,rgba(255,200,225,0.45),rgba(255,255,255,0.85),oklch(0.52_0.105_223.128))]">
      <div className="w-full items-center flex flex-col mt-40 px-4">
        <h1 className="text-6xl font-black text-center">
          Book local selfcare services
        </h1>
        <p className="mt-2 text-lg font-medium text-center">
          Discover top-rated salons, barbers, medspas, wellness studios and
          beauty experts trusted by millions worldwide
        </p>

        {/* Search bar */}
        <div ref={containerRef} className="relative w-full max-w-2xl mt-10">
          <div className="flex items-center bg-white rounded-2xl shadow-lg px-5 py-4 gap-3">
            <svg
              className="w-5 h-5 text-gray-400 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              className="flex-1 outline-none text-base bg-transparent placeholder:text-gray-400"
              placeholder="Search salons, barbers, spas..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
            />
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setOpen(false);
                }}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                ✕
              </button>
            )}
          </div>

          {/* Dropdown */}
          {open && search.length > 0 && (
            <ul className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl overflow-hidden z-50 border border-gray-100">
              {filtered.length === 0 ? (
                <li className="px-5 py-4 text-sm text-gray-400 text-center">
                  No results found for "{search}"
                </li>
              ) : (
                filtered.map((org: any) => (
                  <li key={org.id ?? org.slug}>
                    <button
                      className="w-full text-left px-5 py-3 hover:bg-gray-50 transition flex flex-col gap-0.5"
                      onClick={() => {
                        router.push(`/salon/${org.slug}`);
                        setOpen(false);
                        setSearch("");
                      }}
                    >
                      <span className="font-semibold text-gray-900 text-sm">
                        {org.name}
                      </span>
                      {org.type && (
                        <span className="text-xs text-gray-400">
                          {org.type}
                        </span>
                      )}
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
