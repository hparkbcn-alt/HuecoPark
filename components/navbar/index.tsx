import React, { Suspense } from "react";
import Link from "next/link";
import Logo from "./Logo";
import Search from "./Search";
import Categories from "./Categories";
import UserMenu from "./UserMenu";
import { getCurrentUser } from "@/services/user";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = async () => {
  const user = await getCurrentUser();

  return (
    <header className="fixed top-0 left-0 w-full bg-white z-10 ">
      <nav className="py-3 border-b-[1px]">
        <div className="flex main-container flex-row justify-between items-center gap-3 md:gap-0">
          <div className="flex items-center gap-4">
            <Logo />
            <Link
              href="/mapa"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition font-medium text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Mapa
            </Link>
          </div>
          <Suspense fallback={<></>}>
            <Search />
          </Suspense>
          <UserMenu user={user} />
        </div>
      </nav>
      <Categories />
    </header>
  );
};

export default Navbar;
