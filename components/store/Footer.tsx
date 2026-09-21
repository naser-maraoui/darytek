import Link from "next/link";
import Logo from "@/components/brand/Logo";

// ---------- Icons ----------
function MailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
function MapPinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function TruckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </svg>
  );
}
function CashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <rect width="20" height="12" x="2" y="6" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  );
}
function HeadsetIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm18 0h-3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-5Z" />
      <path d="M21 11a9 9 0 1 0-18 0" />
      <path d="M21 16v2a4 4 0 0 1-4 4h-3" />
    </svg>
  );
}

const socialIcons = [
  {
    label: "Facebook",
    href: "#",
    path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
  },
  {
    label: "Instagram",
    href: "#",
    path: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zm1.5-4.87h.01M4 4h16v16H4z",
  },
];

export default function Footer({
  whatsapp,
  phone,
}: {
  whatsapp: string;
  phone: string;
}) {
  return (
    <footer className="relative overflow-hidden bg-navy-950 text-white">
      {/* Decorative orbs */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-orange-500/5 blur-3xl" />

      {/* ============ NEWSLETTER ============ */}
      <div className="relative border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <span className="inline-flex rounded-full bg-orange-500/15 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-orange-400">
                Newsletter
              </span>
              <h2 className="mt-3 text-2xl font-black leading-tight sm:text-3xl">
                Recevez nos meilleures offres
              </h2>
              <p className="mt-2 max-w-md text-sm text-gray-400">
                Inscrivez-vous et recevez en avant-première nos promotions
                et nouveaux arrivages.
              </p>
            </div>

            <form className="flex w-full gap-2">
              <div className="relative flex-1">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <MailIcon />
                </span>
                <input
                  type="email"
                  placeholder="votre@email.com"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-orange-500 focus:bg-white/10"
                />
              </div>
              <button
                type="submit"
                className="flex h-12 items-center rounded-xl bg-orange-500 px-5 text-sm font-black text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600"
              >
                S&apos;inscrire
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ============ MAIN COLUMNS ============ */}
      <div className="relative mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Logo variant="light" size="lg" />
            <p className="mt-4 max-w-sm text-sm leading-6 text-gray-400">
              Darytek — votre partenaire de confiance pour l&apos;électroménager
              en Tunisie. Livraison rapide, paiement à la livraison,
              satisfaction garantie.
            </p>

            <div className="mt-6 flex gap-2">
              {socialIcons.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-gray-400 transition hover:bg-orange-500 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Boutique */}
          <div>
            <h4 className="mb-4 text-xs font-black uppercase tracking-widest text-orange-400">
              Boutique
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Tous les produits", href: "/products" },
                { label: "Promotions", href: "/products?promo=1" },
                { label: "Nouveautés", href: "/products" },
                { label: "Marques", href: "/products" },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="group inline-flex items-center gap-1 text-gray-400 transition hover:text-white"
                  >
                    <span className="h-px w-0 bg-orange-500 transition-all duration-300 group-hover:w-4" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Aide */}
          <div>
            <h4 className="mb-4 text-xs font-black uppercase tracking-widest text-orange-400">
              Aide & Service
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/track-order" className="group inline-flex items-center gap-1 text-gray-400 transition hover:text-white">
                  <span className="h-px w-0 bg-orange-500 transition-all duration-300 group-hover:w-4" />
                  Suivre ma commande
                </Link>
              </li>
              <li>
                <a href={`https://wa.me/${whatsapp}`} className="group inline-flex items-center gap-1 text-gray-400 transition hover:text-white">
                  <span className="h-px w-0 bg-orange-500 transition-all duration-300 group-hover:w-4" />
                  Contacter le support
                </a>
              </li>
              <li>
                <Link href="/products" className="group inline-flex items-center gap-1 text-gray-400 transition hover:text-white">
                  <span className="h-px w-0 bg-orange-500 transition-all duration-300 group-hover:w-4" />
                  Retours et garantie
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-xs font-black uppercase tracking-widest text-orange-400">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <PhoneIcon />
                <a href={`tel:${phone}`} className="transition hover:text-white">
                  {phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPinIcon />
                <span>Tunis, Tunisie</span>
              </li>
              <li className="flex items-start gap-2">
                <MailIcon />
                <a href="mailto:contact@darytek.tn" className="transition hover:text-white">
                  contact@darytek.tn
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ============ TRUST STRIP ============ */}
      <div className="relative border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { Icon: TruckIcon, t: "Livraison rapide", s: "24h à 48h" },
              { Icon: CashIcon, t: "Paiement à la livraison", s: "Sans prépaiement" },
              { Icon: ShieldIcon, t: "Produits garantis", s: "Qualité vérifiée" },
              { Icon: HeadsetIcon, t: "Support 7j/7", s: "À votre écoute" },
            ].map(({ Icon, t, s }) => (
              <div key={t} className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-orange-500/15 text-orange-400">
                  <Icon />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-black text-white">{t}</p>
                  <p className="truncate text-[11px] text-gray-500">{s}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ BOTTOM BAR ============ */}
      <div className="relative border-t border-white/5 bg-navy-950/80">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} <span className="font-black text-white">Dary<span className="text-orange-500">tek</span></span> — Tous droits réservés.Conçu par <a href="https://www.facebook.com/Naser.maraoui" target="_blank" rel="noopener noreferrer" className="font-black text-white transition hover:text-orange-500">Naser Maraoui</a>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500">
                <Link
                    href="/mentions-legales"
                    className="transition hover:text-white"
                >
                    Mentions légales
                </Link>
                <span className="text-navy-800">·</span>
                <Link
                    href="/politique-confidentialite"
                    className="transition hover:text-white"
                >
                    Politique de confidentialité
                </Link>
                <span className="text-navy-800">·</span>
                <Link href="/cgv" className="transition hover:text-white">
                    CGV
                </Link>
            </div>

          {/* Payment badges
          <div className="flex items-center gap-2">
            {["VISA", "MC", "COD"].map((p) => (
              <span
                key={p}
                className="rounded-md bg-white/5 px-2 py-1 text-[10px] font-black tracking-wider text-gray-400"
              >
                {p}
              </span>
            ))}
          </div> */}
        </div>
      </div>
    </footer>
  );
}