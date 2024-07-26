import React from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { FaBars } from "react-icons/fa";
function CategoriesMenu() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger className="flex items-center gap-2 cursor-pointer">
          <FaBars />
          Categories
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Link</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

export default CategoriesMenu;
