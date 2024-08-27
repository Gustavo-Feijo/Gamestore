import Link from "next/link";
import SearchBar from "./SearchBar";
import UserAuth from "./UserAuth";
import { FaHome } from "react-icons/fa";
import SideBar from "./SideBar";
import { auth } from "@/auth";
import ShoppingCart from "@/components/ShoppingCart";

// TopBar for navigation through the app.
async function TopBar() {
  // Get the current user session.
  const session = await auth();
  return (
    <header className="h-20 w-full bg-secondary border-b-2 border-foreground flex items-center justify-center gap-4 z-50">
      <div className="flex lg:hidden absolute left-4">
        <SideBar session={session} />
      </div>
      {session && (
        <div className="absolute right-4 z-10">
          <ShoppingCart />
        </div>
      )}
      <div className="flex-1 items-center hidden lg:flex">
        <Link href="/" className="ml-4">
          <FaHome className="text-4xl transition-colors duration-300 hover:text-background" />
        </Link>
      </div>
      <div className="flex items-center w-2/4 lg:flex-1">
        <SearchBar />
      </div>
      <div className="flex-1 hidden lg:flex items-center relative ">
        <UserAuth session={session} />
      </div>
    </header>
  );
}

export default TopBar;
