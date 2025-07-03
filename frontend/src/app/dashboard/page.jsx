import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/server/session";
import { fetch } from "@/lib/server/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Page() {
  const { user } = await getCurrentSession();
  if (user === null) {
    return redirect("/login");
  }

  const documents = await fetch(
    `
    SELECT id, filename, created_at, status, role
    FROM documents
    WHERE user_id = $1 AND status IN ('processing', 'done')
    ORDER BY created_at DESC
    `,
    [user.id]
  );

  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto mt-10 space-y-4">
      <h1 className="text-2xl font-semibold text-center">Your Documents</h1>
      {documents.length === 0 ? (
        <p className="text-center text-muted-foreground">No documents found.</p>
      ) : (
        documents.map((doc) => (
          <Card key={doc.id}>
            <CardHeader>
              <CardTitle className="text-base">{doc.filename}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>Status: <span className="capitalize">{doc.status}</span></p>
              <p>Role: {doc.role}</p>
              <p>Uploaded: {new Date(doc.created_at).toLocaleString()}</p>
              <Link href={`/dashboard/report/${doc.id}`}>
                <Button>View Analysis Report</Button>
              </Link>
            </CardContent>
          </Card>
        ))
      )}
      <Button>
      <Link href="/dashboard/new">
        Analyze new Document
      </Link>
      </Button>
    </div>
  );
}
