"use client";
import { FaSearch } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { debounce } from "lodash";
import { SearchResultType } from "@/types";
import Link from "next/link";
import Image from "next/image";

// SearchBar, yet to implement functionalities.
function SearchBar() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState<SearchResultType>([]);
  useEffect(() => {
    const fetchData = async () => {
      if (search.trim() === "") {
        setSearchResult([]);
        return;
      }

      try {
        const response = await fetch(`/api/search?search=${search}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result: SearchResultType = await response.json();
        setSearchResult(result);
      } catch (error) {
        console.log(error);
      }
    };

    const debouncedFetchData = debounce(fetchData, 300);
    debouncedFetchData();

    return () => {
      debouncedFetchData.cancel();
    };
  }, [search]);

  const handleLinkClick = () => {
    setSearch("");
    setSearchResult([]);
  };

  return (
    <search className="flex-1 flex items-center justify-center min-w-full relative">
      <Input
        placeholder="Search..."
        className="h-12 rounded-xl"
        onChange={(e) => setSearch(e.target.value)}
      />
      <Button className="absolute right-4 rounded-full h-4/5" variant="outline">
        <FaSearch />
      </Button>
      {searchResult.length > 0 && (
        <nav className="absolute top-full mt-1 min-w-full p-2 rounded-lg bg-background border flex flex-col gap-2">
          {searchResult.map((result, index) => (
            <Link
              href={`/games/${result.id}`}
              className="flex items-center border p-2 rounded"
              onClick={handleLinkClick}
              key={index}
            >
              <Image
                alt={result.name}
                src={result.image}
                width={80}
                height={110}
              />
              <div className="flex flex-1 flex-col items-center w-80">
                <span className="text-4xl text-center">{result.name}</span>
                <span>{result.Developer.name}</span>
              </div>
            </Link>
          ))}
        </nav>
      )}
    </search>
  );
}

export default SearchBar;
