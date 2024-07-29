import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FaBars } from "react-icons/fa";
import { Button, buttonVariants } from "@/components/ui/button";
import { Session } from "next-auth";
import { SignIn, SignOutAlt } from "@/components/SignInButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { cn } from "@/lib/utils";

// List of buttons for the sidebar.
const buttonList = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/store",
    label: "Store",
  },
  {
    href: "/categories",
    label: "Categories",
  },
];
//Function that returns a Sheet/SideBar containing some links.
function SideBar({ session }: { session: Session | null }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost">
          <FaBars className="text-4xl" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]" side="left">
        <SheetHeader>
          {session ? (
            <SheetTitle className="flex items-center justify-around w-full">
              <Avatar className="h-16 w-16">
                {session.user?.image && (
                  <AvatarImage
                    src={session.user?.image}
                    width={64}
                    height={64}
                  />
                )}
                <AvatarFallback>IMG</AvatarFallback>
              </Avatar>
              <span>{session.user?.name}</span>
              <SignOutAlt />
            </SheetTitle>
          ) : (
            <SignIn />
          )}
        </SheetHeader>
        <Separator className="my-4" />
        <nav className="flex flex-col items-center gap-4">
          {buttonList.map((value, index) => (
            <SheetClose asChild key={index}>
              <Link
                href={value.href}
                className={cn("w-2/3", buttonVariants({ variant: "outline" }))}
              >
                {value.label}
              </Link>
            </SheetClose>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export default SideBar;
