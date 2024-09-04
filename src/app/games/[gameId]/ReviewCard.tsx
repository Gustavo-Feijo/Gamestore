import { auth } from "@/auth";
import ReviewChart from "./ReviewChart";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import prisma from "@/server/db";
import Link from "next/link";
import { FaPen } from "react-icons/fa";
import ReviewList from "./ReviewList";

// Card for showing the reviews on the game page.
export async function ReviewCard({ gameId }: { gameId: string }) {
  // Get the user session.
  const session = await auth();

  // Verify if the user has a written review about this game.
  let userReview = null;
  if (session) {
    userReview = await prisma.review.findFirst({
      where: { userId: session.user?.id, gameId: gameId },
    });
  }

  // Get the total amount of reviews.
  const totalReviewsCount = await prisma.review.count({
    where: { gameId: gameId },
  });

  // Get the count of the reviews by each score.
  const reviewInfo = await prisma.review.groupBy({
    where: { gameId: gameId },
    by: "score",
    orderBy: { score: "desc" },
    _count: { _all: true },
  });

  // Create a array with the scores from 1 to 10.
  // Used to assure that all values will be displayed.
  const fullScores = Array.from({ length: 10 }, (_, i) => i + 1).map(
    (score) => {
      // Get the original score.
      const originalScore = reviewInfo.find((item) => item.score == score);
      // Return the original score and the count if exists, else the current score with count 0.
      return originalScore
        ? { score: originalScore.score, count: originalScore._count._all }
        : { score: score, count: 0 };
    }
  );

  return (
    <section className="w-full h-fit flex flex-col items-center bg-background p-2 border rounded md:max-w-[1000px]">
      <h1 className="text-4xl">Reviews</h1>
      <Separator className="my-2" />
      <div className="flex flex-col">
        <div className="flex flex-col gap-2 items-center">
          {userReview ? (
            <Link
              href={`/reviews/${gameId}/me`}
              className={buttonVariants({
                variant: "default",
                className: "w-40",
              })}
            >
              Edit your review...
            </Link>
          ) : (
            <>
              <span>You didnt wrote a review for this game...</span>
              <Link
                href={`/reviews/${gameId}/me`}
                className={buttonVariants({
                  variant: "default",
                  className: "w-40",
                })}
              >
                Write a review
                <FaPen className="text-xl ml-4" />
              </Link>
            </>
          )}
        </div>
        <Separator className="my-2" />
        {totalReviewsCount > 0 ? (
          <ReviewChart
            reviewData={fullScores}
            totalReviewsCount={totalReviewsCount}
          />
        ) : (
          <span className="text-4xl text-center">No review found.</span>
        )}
      </div>
      {totalReviewsCount > 0 && (
        <>
          <Separator className="my-2" />
          <ReviewList gameId={gameId} />
        </>
      )}
    </section>
  );
}

export default ReviewCard;
