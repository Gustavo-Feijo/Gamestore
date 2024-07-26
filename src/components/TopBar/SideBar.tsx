import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FaBars } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Session } from "next-auth";
import { SignIn, SignOutAlt } from "../SignInButton";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";

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
            <>
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
            </>
          ) : (
            <SignIn />
          )}
        </SheetHeader>
        <Separator className="my-4" />
      </SheetContent>
    </Sheet>
  );
}

export default SideBar;
