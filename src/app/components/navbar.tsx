"use client";

import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigations } from "../constants/navigation.const";
import { currentPathFirstSegment } from "../helpers/pathname-first-segment.helper";

export const Navbar = () => {
  const currentPath = usePathname();

  return (
    <nav className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img
                className="h-8 w-8"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                alt="your company"
              />
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navigations.map((navigation, index) => {
                  return (
                    <Link
                      key={index}
                      href={navigation.href}
                      className={classNames(
                        currentPathFirstSegment(currentPath) === navigation.href
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "rounded-md px-3 py-2 text-sm font-medium",
                      )}
                      aria-current="page"
                    >
                      {navigation.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            {/* <!-- mobile menu button --> */}
            <button
              type="button"
              className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="absolute -inset-0.5"></span>
              <span className="sr-only">open main menu</span>
              {/* <!-- menu open: "hidden", menu closed: "block" --> */}
              <svg
                className="block h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentcolor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m3.75 6.75h16.5m3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
              {/* <!-- menu open: "block", menu closed: "hidden" --> */}
              <svg
                className="hidden h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentcolor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m6 18l18 6m6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* <!-- Mobile menu, show/hide based on menu state. --> */}
      <div className="md:hidden" id="mobile-menu">
        {navigations.map((navigation, index) => {
          return (
            <a
              key={index}
              href={navigation.href}
              className={classNames(
                currentPath.includes(navigation.name)
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                "rounded-md px-3 py-2 text-sm font-medium",
              )}
              aria-current="page"
            >
              {navigation.name}
            </a>
          );
        })}
        <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3"></div>
      </div>
    </nav>
  );
};
