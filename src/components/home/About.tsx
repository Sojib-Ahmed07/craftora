import { CustomLink as Link } from "@/components/ui/custom-link";
import { ArrowRight, Sparkles, ShieldCheck, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen py-16 px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="space-y-4 text-center sm:text-left">
          <h1 className="text-4xl font-black tracking-tight text-neutral-900 sm:text-5xl">
            Our Story
          </h1>
          <p className="text-lg text-neutral-500 leading-relaxed">
            Craftora is a live corner of the internet built to connect independent global artisans directly with people looking for intentional, handmade goods.
          </p>
        </div>

        <hr className="border-neutral-100" />

        {/* Pillars / Values Grid */}
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="p-5 border border-neutral-200 rounded-2xl bg-neutral-50/50 space-y-3">
            <Sparkles className="h-5 w-5 text-neutral-900" />
            <h3 className="font-bold text-neutral-900 text-sm">Purely Handmade</h3>
            <p className="text-xs text-neutral-500 leading-normal">
              Every item listed here is shaped, sewn, or crafted by human hands, keeping traditions alive.
            </p>
          </div>

          <div className="p-5 border border-neutral-200 rounded-2xl bg-neutral-50/50 space-y-3">
            <ShieldCheck className="h-5 w-5 text-neutral-900" />
            <h3 className="font-bold text-neutral-900 text-sm">Direct & Honest</h3>
            <p className="text-xs text-neutral-500 leading-normal">
              No middleman networks or massive warehouse markups. Your payment directly protects small-scale producers.
            </p>
          </div>

          <div className="p-5 border border-neutral-200 rounded-2xl bg-neutral-50/50 space-y-3">
            <Heart className="h-5 w-5 text-neutral-900" />
            <h3 className="font-bold text-neutral-900 text-sm">Built for Longevity</h3>
            <p className="text-xs text-neutral-500 leading-normal">
              We swap out cheap, fast-discard commercial throwaways for intentional goods meant to last generations.
            </p>
          </div>
        </div>

        {/* Story Content Block */}
        <div className="space-y-6 text-neutral-600 leading-relaxed text-sm">
          <p>
            We noticed that true craftsmanship was getting drowned out by industrial mass production and identical algorithm-driven storefronts. Authentic makers were spending more time battling platform logistics than focusing on their benches, kilns, and looms.
          </p>
          <p>
            Craftora was created to fix that imbalance. We streamline the checkout architecture, protect metadata handling, and clear structural transaction barriers so creators can focus entirely on what they do best: creating timeless, physical works of art.
          </p>
        </div>

        {/* CTA Banner */}
        <div className="p-6 bg-neutral-950 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-base">Explore the catalog</p>
            <p className="text-xs text-neutral-400 mt-0.5">Find something unique made just for you.</p>
          </div>
          <Link 
            href="/" 
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-neutral-950 font-bold rounded-xl text-xs hover:bg-neutral-100 transition-colors shrink-0"
          >
            Start Browsing <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}