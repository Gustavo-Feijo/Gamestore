"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { useShoppingCart } from "@/context/ContextProvider";
import Link from "next/link";

// Type of the game search result.
type GameSearch = {
  id: string;
  image: string;
  name: string;
  price: number;
};

// Component to render a result of the game search.
function GameSearchResult({ data }: { data: GameSearch }) {
  const { addItem } = useShoppingCart();
  return (
    <Card className="w-64 h-fit">
      <CardHeader className="p-4">
        <CardTitle className="flex items-center justify-center text-center min-h-14 max-h-14 overflow-scroll">
          {data.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <Link href={`/games/${data.id}`}>
          <Image
            alt={data.name}
            src={data.image}
            width={150}
            height={200}
            className="aspect-[3/4]"
          />
        </Link>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          className="bg-green-300"
          onClick={async () => {
            await addItem({
              gameId: data.id,
              amount: 1,
              image: data.image,
              name: data.name,
              price: data.price,
            });
          }}
        >
          <span className="text-black font-extrabold flex items-center p-3 gap-2">
            Buy for {data.price}$
          </span>
        </Button>
      </CardFooter>
    </Card>
  );
}

// The game search.
function GameSearch() {
  // State for rendedring the page.
  const [gameList, setGameList] = useState<GameSearch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // Pagination and filtering state.
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState("6"); // Stored as string to avoid unecessary parsing.
  const [search, setSearch] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const searchRef = useRef<HTMLInputElement>(null);
  // useEffect for handling data fetching.
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Creates the params to be passe.
        const params = new URLSearchParams();
        if (page) {
          params.append("page", page.toString());
        }
        if (pageSize) {
          params.append("pageSize", pageSize.toString());
        }
        if (search) {
          params.append("search", search);
        }
        setLoading(true);
        const response = await fetch(`/api/gamesearch?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result: { result: GameSearch[]; hasMore: boolean } =
          await response.json();
        if (result) {
          setGameList(result.result);
          setHasMore(result.hasMore);
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [page, pageSize, search]);

  // Handle the click on the search button.
  const handleSearch = () => {
    if (searchRef.current?.value) {
      setPage(0); // Reset to the first page on new search
      setSearch(searchRef.current.value);
    }
  };
  return (
    <section className="w-full flex flex-col border p-4 rounded md:w-3/4">
      <div className="h-14 flex items-center justify-around gap-4">
        <search className="relative h-fit w-[180px]">
          <Input
            ref={searchRef}
            onChange={(e) => {
              // Get all the results back if the search gets empty.
              if (e.target.value == "") {
                setSearch("");
              }
            }}
            placeholder="Search by name..."
          />
          <Button
            variant={"ghost"}
            className="absolute aspect-square top-1/2 -translate-y-1/2 right-0 text-xl"
            onClick={handleSearch}
          >
            <FaSearch />
          </Button>
        </search>
        <Select defaultValue="6" onValueChange={(value) => setPageSize(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue className="text-center" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6">6 Games/Page.</SelectItem>
            <SelectItem value="12">12 Games/Page.</SelectItem>
            <SelectItem value="24">24 Games/Page.</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Separator className="my-4" />
      <div className="min-h-[800px] grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4 justify-items-center">
        {loading ? (
          <span className="text-5xl">LOADING...</span>
        ) : (
          gameList.map((game, index) => (
            <GameSearchResult data={game} key={index} />
          ))
        )}
      </div>
      <div className="ml-auto flex gap-4 mt-4">
        <Button
          disabled={page == 0}
          onClick={() => setPage((prev) => prev - 1)}
        >
          <FaArrowLeft />
          Previous
        </Button>
        <Button disabled={!hasMore} onClick={() => setPage((prev) => prev + 1)}>
          Next
          <FaArrowRight />
        </Button>
      </div>
    </section>
  );
}
export default GameSearch;
