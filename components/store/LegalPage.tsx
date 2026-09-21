import Link from "next/link";
import Navbar from "@/components/store/Navbar";
import Footer from "@/components/store/Footer";

type Section = {
  id: string;
  title: string;
  body: React.ReactNode;
};

type Props = {
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: Section[];
  categories: { id: number; name: string; slug: string }[];
  phone: string;
  whatsapp: string;
};

function ArrowRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export default function LegalPage({
  title,
  subtitle,
  lastUpdated,
  sections,
  categories,
  phone,
  whatsapp,
}: Props) {
  return (
    <main className="min-h-screen bg-white">
      <Navbar categories={categories} />

      {/* Breadcrumb */}
      <section className="border-b border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <nav className="flex items-center gap-2 text-xs text-gray-500 sm:text-sm">
            <Link href="/" className="hover:text-orange-600">
              Accueil
            </Link>
            <span className="text-gray-300">/</span>
            <span className="font-semibold text-gray-900">{title}</span>
          </nav>
        </div>
      </section>

      {/* Header */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-b from-orange-50/40 to-white">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center sm:py-16">
          <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-orange-700">
            Document légal
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-navy-900 sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
            {subtitle}
          </p>
          <p className="mt-4 text-xs font-bold uppercase tracking-widest text-gray-400">
            Dernière mise à jour : {lastUpdated}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-6xl px-4 py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
          {/* Sidebar — table of contents */}
          <aside className="hidden lg:block">
            <div className="sticky top-32">
              <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-gray-400">
                Sommaire
              </p>
              <nav className="space-y-1 border-l-2 border-gray-100">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block border-l-2 border-transparent py-2 pl-4 text-sm font-medium text-gray-600 transition hover:border-orange-500 hover:text-orange-600"
                  >
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <div className="min-w-0 space-y-10">
            {sections.map((s, i) => (
              <div key={s.id} id={s.id} className="scroll-mt-32">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-xs font-black text-white shadow-md shadow-orange-500/20">
                    {i + 1}
                  </span>
                  <h2 className="text-lg font-black tracking-tight text-navy-900 sm:text-xl">
                    {s.title}
                  </h2>
                </div>
                <div className="space-y-3 pl-0 text-sm leading-7 text-gray-600 sm:pl-11 sm:text-[15px]">
                  {s.body}
                </div>
              </div>
            ))}

            {/* Contact block */}
            <div className="mt-12 overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-navy-950 to-navy-900 p-6 sm:p-8">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-orange-400">
                    Une question ?
                  </p>
                  <h3 className="mt-2 text-lg font-black text-white">
                    Contactez-nous
                  </h3>
                  <p className="mt-1 text-xs text-gray-400">
                    Pour toute question relative à ce document.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`https://wa.me/${whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2.5 text-xs font-black text-white transition hover:bg-green-600"
                  >
                    💬 WhatsApp
                  </a>
                  <a
                    href={`tel:${phone}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-black text-white transition hover:bg-white/10"
                  >
                    📞 Appeler
                  </a>
                </div>
              </div>
            </div>

            {/* Back to shop */}
            <div className="border-t border-gray-100 pt-8 text-center">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 transition hover:text-orange-700"
              >
                Continuer mes achats <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer whatsapp={whatsapp} phone={phone} />
    </main>
  );
}