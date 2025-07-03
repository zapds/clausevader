import { fetchOne } from "@/lib/server/db";
import Report from "./Report";

export default async function Page({ params }) {
	const { docId } = await params;

	const document = await fetchOne(
		`SELECT * FROM documents WHERE id = $1`,
		[docId]
	);

	if (!document) {
		return <div>Document not found</div>;
	}

	return <Report document={document} />;
}
