import Link from "next/link";
import { ArrowLeft } from "lucide-react";
export default function NotFound() { return <div className="container not-found"><span>404 / NOT FOUND</span><h1>This path ends here.</h1><p>The page may have moved, or the address may be incorrect. Return to the Varizen homepage to continue.</p><Link className="button" href="/"><ArrowLeft size={16} />Back to Varizen</Link></div>; }
