"use client";
import { ReviewDataType } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Schema for the form.
const FormSchema = z.object({
  title: z.string().min(10, {
    message: "Title must be at least 10 characters.",
  }),
  review: z.string(),
  score: z.number().min(1).max(10),
});

function ReviewForm({
  reviewData,
  gameId,
}: {
  reviewData: ReviewDataType | null;
  gameId: string;
}) {
  // Create the defaults for the review.
  let editReviewDefaults = {
    title: "",
    review: "",
    score: 10,
  };

  // Change the defaults if there is any previous review data.
  if (reviewData) {
    editReviewDefaults = {
      title: reviewData.title,
      review: reviewData.review,
      score: reviewData.score,
    };
  }

  // Instanciate the form.
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: editReviewDefaults,
  });

  // Handle submit.
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const response = await fetch(`/api/reviews/${gameId}`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(errorMsg);
      }
      toast.success("Operation sucessfull");
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-96 p-8 rounded space-y-4 border text-center"
      >
        <div className="flex justify-between">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title..." {...field} />
                </FormControl>
                <FormDescription>
                  This is the title of your review.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="score"
            render={({ field }) => (
              <FormItem className="w-20">
                <FormLabel>Score</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="Select your score." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="min-w-0">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((cur) => (
                      <SelectItem value={cur.toString()} key={cur}>
                        {cur}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Your score</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="review"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Review</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Review... (Optional)"
                  className="resize-none h-40"
                  {...field}
                />
              </FormControl>
              <FormDescription>This is your review content.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export default ReviewForm;
