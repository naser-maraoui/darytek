import Image from "next/image";

type Review = {
  name: string;
  city: string;
  text: string;
  rating: number;
  avatarInitials: string;
};

const reviews: Review[] = [
  {
    name: "Ahmed B.",
    city: "Tunis",
    text: "Livraison rapide et produit conforme. Le réfrigérateur est arrivé en parfait état, installé par le livreur. Je recommande !",
    rating: 5,
    avatarInitials: "AB",
  },
  {
    name: "Fatma K.",
    city: "Sfax",
    text: "Excellent rapport qualité-prix. J'ai commandé une machine à laver et elle fonctionne parfaitement depuis 6 mois.",
    rating: 5,
    avatarInitials: "FK",
  },
  {
    name: "Karim M.",
    city: "Sousse",
    text: "Service client très réactif sur WhatsApp. Ils m'ont aidé à choisir le bon climatiseur pour mon salon.",
    rating: 5,
    avatarInitials: "KM",
  },
  {
    name: "Leila T.",
    city: "Ariana",
    text: "Paiement à la livraison, aucun stress. Le colis est arrivé en 48h à l'adresse indiquée. Merci Darytek !",
    rating: 5,
    avatarInitials: "LT",
  },
  {
    name: "Mohamed S.",
    city: "Bizerte",
    text: "Bonne communication du début à la fin. Produit de qualité, prix très compétitif par rapport aux autres boutiques.",
    rating: 5,
    avatarInitials: "MS",
  },
  {
    name: "Sonia J.",
    city: "Nabeul",
    text: "J'hésitais à commander en ligne, mais tout s'est très bien passé. Je recommande vivement cette boutique.",
    rating: 5,
    avatarInitials: "SJ",
  },
];

function StarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-orange-500/20">
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
    </svg>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="mx-3 w-80 flex-shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:w-96">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-xs font-black text-white">
            {review.avatarInitials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-black text-gray-900">
              {review.name}
            </p>
            <p className="truncate text-[11px] text-gray-500">
              📍 {review.city}
            </p>
          </div>
        </div>
        <QuoteIcon />
      </div>

      <div className="mt-3 flex items-center gap-0.5 text-orange-400">
        {Array.from({ length: review.rating }).map((_, i) => (
          <StarIcon key={i} />
        ))}
      </div>

      <p className="mt-3 text-sm leading-6 text-gray-600">
        &ldquo;{review.text}&rdquo;
      </p>
    </div>
  );
}

export default function TestimonialsMarquee() {
  return (
    <section className="overflow-hidden border-y border-gray-100 bg-gradient-to-b from-orange-50/30 to-white py-14">
      <div className="mx-auto mb-8 max-w-7xl px-4 text-center">
        <span className="text-[11px] font-black uppercase tracking-widest text-orange-600">
          💬 Ils nous font confiance
        </span>
        <h2 className="mt-1 text-xl font-black tracking-tight text-gray-900 sm:text-2xl">
          Ce que disent nos clients
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
          Plus de 500 clients satisfaits partout en Tunisie.
        </p>
      </div>

      <div className="relative">
        <div className="flex animate-marquee-slow whitespace-nowrap py-2">
          {[...reviews, ...reviews].map((r, i) => (
            <ReviewCard key={i} review={r} />
          ))}
        </div>

        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-orange-50/30 to-transparent sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent sm:w-32" />
      </div>
    </section>
  );
}