import { CustomLink as Link } from "@/components/ui/custom-link";

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen py-16 px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-10">
        {/* Header */}
        <div className="space-y-3">
          <h1 className="text-3xl font-black tracking-tight text-neutral-900">
            Terms of Service
          </h1>
          <p className="text-xs text-neutral-400 font-mono">
            Last updated: June 2026
          </p>
        </div>

        <hr className="border-neutral-100" />

        {/* Terms Body Content */}
        <div className="space-y-8 text-neutral-600 text-sm leading-relaxed">
          
          <section className="space-y-2">
            <h2 className="text-base font-bold text-neutral-900">1. Acceptance of Terms</h2>
            <p>
              By accessing and purchasing goods through the Craftora marketplace platforms, you agree to comply with and be bound by these functional operational policies. If you do not accept these criteria, you may not make database transactions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-neutral-900">2. Marketplace Dynamics</h2>
            <p>
              Craftora acts as an optimized bridge routing mechanism between independent sellers and final buyers. Because items are distinctly handmade, slight organic variances in physical layout dimensions, color tones, and surface textures are expected design behaviors and do not represent platform structural defects.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-neutral-900">3. Payments & Stripe Directives</h2>
            <p>
              All payment collection transactions are securely parsed via Stripe APIs. You agree to provide functional metadata tracking payload properties during authentication. Once a session payment returns confirmed checkout values, order fulfillment generation sequences lock atomically into the relational system.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-neutral-900">4. Limitation of Liabilities</h2>
            <p>
              Craftora is not legally accountable for direct production shipping delays or transit packaging errors induced by local dispatch couriers. However, customer dispute sessions can be verified upon request to coordinate platform integrity balance protection.
            </p>
          </section>

        </div>

        <hr className="border-neutral-100" />

        {/* Footer Linkback */}
        <p className="text-xs text-neutral-400 text-center">
          Questions about our platform terms? Return to the{" "}
          <Link href="/" className="text-neutral-900 underline underline-offset-4 font-medium hover:text-neutral-700">
            Home feed
          </Link>
          .
        </p>
      </div>
    </div>
  );
}