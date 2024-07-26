import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FaShoppingCart } from "react-icons/fa";
import { Button } from "@/components/ui/button";

function ShoppingCart() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost">
          <FaShoppingCart className="text-4xl" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>ShoppingCart</SheetTitle>
          <SheetDescription>This is the ShoppingCart.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

export default ShoppingCart;
