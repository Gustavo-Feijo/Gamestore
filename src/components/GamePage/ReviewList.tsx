"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReviewData, ReviewListType } from "@/types";
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
          const errorData = await response.json();
          throw new Error(errorData.message || "Network response was not ok");
        }
        const data: { result: ReviewListType } = await response.json();
        if (data.result && data.result.length > 0) {
          data.result.forEach(
            (review) => (review.createAt = new Date(review.createAt))
          );
          setReviews((prev) => [...prev, ...data.result]);
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
