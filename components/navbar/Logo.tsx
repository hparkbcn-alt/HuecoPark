import React from "react";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-1">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 md:w-8 md:h-8 bg-green-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg md:text-xl">P</span>
        </div>
        <span className="text-lg md:text-2xl font-bold text-green-600">hueco</span>
        <span className="text-lg md:text-2xl font-bold text-gray-800">Park</span>
      </div>
    </Link>
  );
};

export default Logo;