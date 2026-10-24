import Link from "next/link";
import Image from "next/image";

/** Verified native Varizen assets. Never redraw, stretch or apply color filters. */
export function Brand({ footer = false }: { footer?: boolean }) {
  if (footer) {
    return <Link href="/" className="brand brand-footer" aria-label="Varizen home">
      <Image className="brand-logo brand-logo-light" src="/brand/varizen-logo-black.png" alt="Varizen logo" width={283} height={370} />
      <Image className="brand-logo brand-logo-dark" src="/brand/varizen-logo.png" alt="" aria-hidden="true" width={283} height={370} />
    </Link>;
  }
  return <Link href="/" className="brand" aria-label="Varizen home">
    <Image className="brand-logo brand-logo-light" src="/brand/varizen-nav-black.png" alt="Varizen logo" width={385} height={87} priority />
    <Image className="brand-logo brand-logo-dark" src="/brand/varizen-nav.png" alt="" aria-hidden="true" width={385} height={87} />
  </Link>;
}
