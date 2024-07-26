import { signIn, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { FaDoorOpen, FaUser } from "react-icons/fa";

// Implementation for SignIn and SignOut.
export function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn();
      }}
    >
      <Button variant="default" type="submit">
        <FaUser className="text-lg mr-2" />
        Sign in
      </Button>
    </form>
  );
}

export function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <Button variant="ghost" type="submit">
        <FaDoorOpen className="text-destructive" />
        Sign Out
      </Button>
    </form>
  );
}
export function SignOutAlt() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <Button variant="destructive" type="submit">
        <FaDoorOpen className="text-foreground text-2xl" />
      </Button>
    </form>
  );
}
