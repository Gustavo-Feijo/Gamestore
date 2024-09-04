import { auth } from "@/auth";
import prisma from "@/server/db";
import ReviewForm from "./ReviewForm";

// Page for showing the user review.
// Enable to create a new review or update the current one.
async function MyReview({ params }: { params: { gameId: string } }) {
  // Get the session.
  const session = await auth();
  if (!session) {
    return (
      <div className="w-full flex justify-center text-red-500 text-5xl">
        You are not authorized, signIn.
      </div>
    );
  }

  // Verify if can access the id.
  if (!session.user?.id) {
    return (
      <div className="w-full flex justify-center text-red-500 text-5xl">
        Could not get your user id.
      </div>
    );
  }

  // Get the user review.
  const review = await prisma.review.findUnique({
    where: {
      gameId_userId: { gameId: params.gameId, userId: session.user.id },
    },
  });

  // Pass it down to the form.
  return (
    <main className="flex items-center justify-center flex-1">
      <ReviewForm reviewData={review} gameId={params.gameId} />
    </main>
  );
}

export default MyReview;
