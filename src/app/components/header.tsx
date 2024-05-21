"use client";

import { usePathname } from "next/navigation";
import { currentPathFirstSegment } from "../helpers/pathname-first-segment.helper";

export const Header = () => {
  const currentPath = usePathname();

  return (
    <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {currentPathFirstSegment(currentPath, true)}
        </h1>
      </div>
    </header>
  );
};
