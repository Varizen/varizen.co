"use client";
import { useEffect } from "react";
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) { useEffect(() => { console.error("Public route error", error.digest ?? "No reference"); }, [error]); return <div className="container not-found"><span>SOMETHING WENT WRONG</span><h1>Let’s try that again.</h1><p>The page could not be loaded. No sensitive details have been exposed.</p><button className="button" onClick={reset}>Try again</button></div>; }
