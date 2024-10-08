"use client";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { debounce } from "lodash";
import { SearchResultType } from "@/types";
import Link from "next/link";
import Image from "next/image";

// SearchBar component.
function SearchBar() {
  // useState with the current search and the results.
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState<SearchResultType>([]);
  useEffect(() => {
    // Use effect for fetching the data from the endpoint.
    const fetchData = async () => {
      if (search.trim() === "") {
        setSearchResult([]);
        return;
      }

      try {
        const response = await fetch(`/api/search?search=${search}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Network response was not ok");
        }
        const data: { result: SearchResultType } = await response.json();
        setSearchResult(data.result);
      } catch (error) {
        console.error(error);
      }
    };

    // Debounce the fetch call.
    const debouncedFetchData = debounce(fetchData, 300);
    debouncedFetchData();

    return () => {
      debouncedFetchData.cancel();
    };
  }, [search]);

  // Reset the state.
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
        value={search}
      />
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
                width={60}
                height={80}
                className="aspect-[3/4]"
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
