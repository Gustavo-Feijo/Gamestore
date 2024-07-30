import Link from "next/link";
import SearchBar from "./SearchBar";
import UserAuth from "./UserAuth";
import { FaHome } from "react-icons/fa";
import SideBar from "./SideBar";
import CategoriesMenu from "./CategoriesMenu";
import { auth } from "@/auth";
import ShoppingCart from "./ShoppingCart";

// TopBar for navigation through the app.
async function TopBar() {
  // Get the current user session.
  const session = await auth();
  return (
    <header className="h-20 w-full bg-secondary border-b-2 border-foreground flex items-center justify-center gap-4">
      <div className="absolute left-4">
        <SideBar session={session} />
      </div>
      {session && (
        <div className="absolute right-4">
          <ShoppingCart />
        </div>
      )}
      <div className="flex-1 items-center justify-end gap-4 hidden lg:flex">
        <Link href="/">
          <FaHome className="text-4xl transition-colors duration-300 hover:text-background" />
        </Link>
        <CategoriesMenu />
      </div>
      <div className="flex items-center w-2/4 lg:flex-1">
        <SearchBar />
      </div>
      <div className="flex-1 hidden lg:flex items-center ">
        <UserAuth session={session} />
      </div>
    </header>
  );
}

export default TopBar;
