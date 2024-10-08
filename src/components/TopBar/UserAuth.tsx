import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { SignIn, SignOut } from "@/components/SignInButton";
import { FaUser } from "react-icons/fa";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Session } from "next-auth";

// Function for handling user authentication.
async function UserAuth({ session }: { session: Session | null }) {
  // If the user has no session render a signIn button.
  if (!session) {
    return <SignIn />;
  }

  // Render a menu bar with links for the user.
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger className="cursor-pointer">
          <span className="max-w-32">{session.user?.name}</span>
          <FaUser className="text-lg ml-2" />
        </MenubarTrigger>
        <MenubarContent className="min-w-40 h-fit flex flex-col items-center justify-center p-4">
          <MenubarItem>
            <Avatar className="h-12 w-12">
              {session.user?.image && <AvatarImage src={session.user?.image} />}
              <AvatarFallback>IMG</AvatarFallback>
            </Avatar>
          </MenubarItem>
          <Separator className="my-2" />
          <div className="flex flex-col gap-3">
            <SignOut />
            <MenubarItem className="px-4 py-3 cursor-pointer" asChild>
              <Link href="/orders">My Orders</Link>
            </MenubarItem>
          </div>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

export default UserAuth;
