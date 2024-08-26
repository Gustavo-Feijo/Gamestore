"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReviewData } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ReviewList({ gameId }: { gameId: string }) {
  // State for handling.
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/reviews/${gameId}?page=${page}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result: any[] = await response.json();
        if (result && result.length > 0) {
          result.forEach(
            (review) => (review.createAt = new Date(review.createAt))
          );
          setReviews((prev) => [...prev, ...result]);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [page, gameId]);

  // Add one for the page.
  const handleMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <section className="flex flex-col items-center justify-center gap-2">
      <span className="text-4xl">Review List</span>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {reviews.map((review, index) => (
          <Card className="w-[350px]" key={index}>
            <CardHeader>
              <CardTitle>{review.title}</CardTitle>
              <CardDescription>
                {review.createAt.toDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xl">Score: {review.score}</p>
              <p className="h-32 max-h-32 bg-background overflow-scroll border rounded p-1">
                {review.review}
              </p>
            </CardContent>
            <CardFooter className="flex items-center justify-center">
              <Link
                className={buttonVariants({ variant: "default" })}
                href={`/reviews/${review.id}`}
              >
                See full review.
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
      {hasMore && (
        <Button onClick={handleMore} variant={"outline"} className="h-50">
          Show More
        </Button>
      )}
    </section>
  );
}
