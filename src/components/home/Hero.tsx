"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FEATURED_ITEMS = [
  {
    title: "Logitech G Pro X Superlight 2 Dex",
    category: "Enthusiast Gear",
    price: "$159.99",
    image:
      "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/776b4db3-e2f4-4412-b45c-99cbef911bd6.jpg",
    link: "/explore?product=logitech-g-pro",
  },
  {
    title: "AOC AGON Pro AG276QKD Gaming Monitor",
    category: "Displays",
    price: "$699.00",
    image:
      "https://www.startech.com.bd/image/cache/catalog/monitor/aoc/agon-pro-ag276qkd/agon-pro-ag276qkd-001-500x500.webp",
    link: "/explore?product=aoc-agon-pro",
  },
  {
    title: "PlayStation 5 Slim Edition Console",
    category: "Gaming Hardware",
    price: "$499.99",
    image:
      "https://www.startech.com.bd/image/cache/catalog/gaming-console/playstation/playstation-5-analog-console-slim-edition/playstation-5-analog-console-slim-edition-01-500x500.webp",
    link: "/explore?product=ps5-slim",
  },
];

export default function Hero() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 3000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    // Safely assign initial state on the next event loop tick
    const timeoutId = setTimeout(() => onSelect(), 0);

    return () => {
      clearTimeout(timeoutId);
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="w-full border-b bg-background overflow-hidden lg:h-[65vh] lg:max-h-[65vh] flex items-center">
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-0 w-full">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-foreground text-balance">
              Bespoke objects for the{" "}
              <span className="text-primary">modern workspace.</span>
            </h1>

            <p className="mt-4 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty">
              Discover Craftora—a premium marketplace built for high-tier
              enthusiast hardware, refined custom gear, and clean setup
              essentials. Engineered for those who value absolute craftsmanship.
            </p>

            {/* Call to Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="rounded-xl px-8 font-medium gap-2 shadow-sm transition-transform active:scale-95"
                asChild
              >
                <Link href="/explore">
                  Browse Catalog
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="rounded-xl px-8 font-medium transition-transform active:scale-95"
                asChild
              >
                <Link href="/about">Our Philosophy</Link>
              </Button>
            </div>

            {/* Dynamic Statistics Block */}
            <div className="mt-10 grid grid-cols-3 gap-6 border-t pt-6 max-w-md">
              <div>
                <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  12k+
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Verified Items
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  99.4%
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Satisfaction
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  24/7
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Direct Support
                </p>
              </div>
            </div>
          </div>

          {/* Right Slider Column */}
          <div className="lg:col-span-5 w-full flex flex-col justify-center items-center lg:items-end min-w-0 gap-4">
            <div className="w-full max-w-md rounded-xl border bg-card text-card-foreground shadow-md overflow-hidden transition-all">
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex touch-pan-y backface-hidden">
                  {FEATURED_ITEMS.map((item, index) => (
                    <div
                      className="grow-0 shrink-0 basis-full min-w-0 p-5"
                      key={index}
                    >
                      {/* Product Canvas */}
                      <div className="relative aspect-square w-full rounded-lg bg-neutral-50 dark:bg-neutral-900/50 flex items-center justify-center mb-4 border overflow-hidden group">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-contain p-6 select-none mix-blend-multiply dark:mix-blend-normal transform transition-transform duration-500 group-hover:scale-105"
                        />
                        <Button
                          size="sm"
                          variant="secondary"
                          className="absolute bottom-3 right-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity gap-1.5 shadow"
                          asChild
                        >
                          <Link href={item.link}>
                            <ShoppingBag size={14} />
                            View Details
                          </Link>
                        </Button>
                      </div>

                      {/* Product Spec Meta */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-0.5 min-w-0">
                          <p className="text-[10px] font-bold text-primary uppercase tracking-wider">
                            {item.category}
                          </p>
                          <h3 className="text-base font-semibold tracking-tight text-foreground truncate">
                            {item.title}
                          </h3>
                        </div>
                        <span className="text-base font-bold text-foreground shrink-0">
                          {item.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pagination Track Dots */}
            <div className="flex items-center gap-1.5 px-1">
              {FEATURED_ITEMS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => emblaApi && emblaApi.scrollTo(index)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    selectedIndex === index
                      ? "w-6 bg-primary"
                      : "w-1.5 bg-muted-foreground/30",
                  )}
                  aria-label={`Go to item slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
