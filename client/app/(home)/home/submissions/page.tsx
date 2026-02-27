import SubmissionsList from "@/components/home/submissions/submissions-list";

export default function SubmissionsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Submissions</h1>
        <p className="text-muted-foreground">
          View all your code submissions and their results
        </p>
      </div>
      <SubmissionsList />
    </div>
  );
}