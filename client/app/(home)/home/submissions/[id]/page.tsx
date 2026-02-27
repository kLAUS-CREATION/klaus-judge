import SubmissionDetail from "@/components/home/submissions/submission-detail";

interface SubmissionDetailPageProps {
  params: {
    id: string;
  };
}

export default function SubmissionDetailPage({ params }: SubmissionDetailPageProps) {
  return (
    <div className="container mx-auto py-6">
      <SubmissionDetail submissionId={params.id} />
    </div>
  );
}