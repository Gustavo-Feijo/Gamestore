import { FaSearch } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function SearchBar() {
  return (
    <search className="flex-1 flex items-center justify-center min-w-full relative">
      <Input placeholder="Search..." className="h-12 rounded-xl" />
      <Button className="absolute right-4 rounded-full h-4/5" variant="outline">
        <FaSearch />
      </Button>
    </search>
  );
}

export default SearchBar;
