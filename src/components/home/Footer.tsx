"use client";

import Link from "next/link";
import { ShoppingBag, ShieldCheck } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-neutral-100 dark:border-neutral-900">
          {/* Column 1: Brand & Identity */}
          <div className="space-y-4 col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-neutral-950 dark:bg-white flex items-center justify-center text-white dark:text-neutral-950 shadow-sm">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <span className="text-sm font-black tracking-tight text-neutral-900 dark:text-white uppercase">
                Storefront
              </span>
            </Link>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-normal">
              High-performance digital experiences engineered with Next.js,
              Prisma architecture, and optimized database ledgers.
            </p>
          </div>

          {/* Column 2: Marketplace Catalog */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Catalog Collections
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/shop"
                  className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=electronics"
                  className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors"
                >
                  Electronics Hub
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=clothing"
                  className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors"
                >
                  Apparel Matrix
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Corporate Routing */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Company Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/about"
                  className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors"
                >
                  Our About Story
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors"
                >
                  Direct Contact Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: System Metrics Badge */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              System Status
            </h4>
            <div className="p-3.5 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl border border-neutral-200/60 dark:border-neutral-800 space-y-2">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                <ShieldCheck className="h-3.5 w-3.5" /> Operations Online
              </div>
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500 leading-normal font-normal">
                All components, payment gateways, and database index pools
                running under nominal load parameters.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Attribution Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-neutral-400 dark:text-neutral-500 text-center sm:text-left font-normal">
            &copy; {currentYear} Storefront System Inc. All ledger rights
            reserved.
          </div>

          <div className="flex items-center gap-6 text-neutral-500 dark:text-neutral-400 font-medium">
            <Link
              href="/privacy"
              className="hover:text-neutral-950 dark:hover:text-white transition-colors"
            >
              Privacy Ledger
            </Link>
            <Link
              href="/terms"
              className="hover:text-neutral-950 dark:hover:text-white transition-colors"
            >
              Terms of Use
            </Link>

            {/* Social Anchor Icons */}
            <div className="flex items-center gap-3 border-l border-neutral-200 dark:border-neutral-800 pl-6 text-neutral-400 dark:text-neutral-500">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-neutral-950 dark:hover:text-white transition-colors"
              >
                <FaGithub />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-neutral-950 dark:hover:text-white transition-colors"
              >
                <FaTwitter />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
