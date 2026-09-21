import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/store/Navbar";
import CopyButton from "@/components/store/CopyButton";

type SuccessPageProps = {
  searchParams: Promise<{
    order?: string;
  }>;
};

// ---------- Icons ----------
function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function PhoneCallIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
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
function PackageIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}
function WhatsappIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}
function ArrowRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const orderNumber = params.order;

  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("name", { ascending: true });

  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const phone = process.env.NEXT_PUBLIC_PHONE ?? "+216 XX XXX XXX";

  const whatsappMessage = encodeURIComponent(
    orderNumber
      ? `Bonjour, je viens de passer la commande #${orderNumber}. Je souhaite avoir plus d'informations.`
      : "Bonjour, je viens de passer une commande. Je souhaite avoir plus d'informations."
  );
  const whatsappUrl = whatsapp
    ? `https://wa.me/${whatsapp}?text=${whatsappMessage}`
    : "#";

  return (
    <main className="min-h-screen bg-white">
      <Navbar categories={categories ?? []} />

      {/* ============ BREADCRUMB ============ */}
      <section className="border-b border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <nav className="flex items-center gap-2 text-xs text-gray-500 sm:text-sm">
            <Link href="/" className="hover:text-orange-600">
              Accueil
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-400">Commande</span>
            <span className="text-gray-300">/</span>
            <span className="font-semibold text-gray-900">Confirmation</span>
          </nav>
        </div>
      </section>

      {/* ============ PROGRESS STEPS (all complete) ============ */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-xs font-black text-white">
                ✓
              </div>
              <span className="hidden text-xs font-bold text-gray-900 sm:inline">
                Panier
              </span>
            </div>
            <div className="h-px w-8 bg-green-500 sm:w-16" />
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-xs font-black text-white">
                ✓
              </div>
              <span className="hidden text-xs font-bold text-gray-900 sm:inline">
                Livraison
              </span>
            </div>
            <div className="h-px w-8 bg-green-500 sm:w-16" />
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-xs font-black text-white">
                ✓
              </div>
              <span className="text-xs font-bold text-green-600">
                Confirmée
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ MAIN CONTENT ============ */}
      <section className="mx-auto max-w-3xl px-4 py-12 lg:py-16">
        {/* Success hero */}
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 sm:h-24 sm:w-24">
            <CheckIcon />
          </div>

          <h1 className="mt-6 text-2xl font-black tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
            Commande confirmée !
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-gray-500 sm:text-base">
            Merci pour votre confiance. Nous allons vous contacter
            prochainement pour confirmer les détails de la livraison.
          </p>
        </div>

        {/* Order number card */}
        {orderNumber && (
          <div className="mt-8 overflow-hidden rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50">
            <div className="p-5 text-center">
              <p className="text-[11px] font-black uppercase tracking-widest text-orange-700">
                Numéro de commande
              </p>
              <div className="mt-2 flex items-center justify-center gap-2">
                <span className="text-2xl font-black tracking-tight text-blue-900 sm:text-3xl">
                  #{orderNumber}
                </span>
                <CopyButton value={`#${orderNumber}`} />
              </div>
              <p className="mt-2 text-xs text-orange-600">
                Conservez ce numéro pour suivre votre commande
              </p>
            </div>
          </div>
        )}

        {/* What happens next */}
        <div className="mt-10">
          <h2 className="mb-4 text-xs font-black uppercase tracking-widest text-gray-500">
            Prochaines étapes
          </h2>

          <div className="space-y-3">
            {/* Step 1 */}
            <div className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                <PhoneCallIcon />
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-gray-900">
                  Confirmation par téléphone
                </p>
                <p className="mt-1 text-xs leading-6 text-gray-500">
                  Nous vous appellerons dans les prochaines heures pour
                  confirmer votre commande et l&apos;adresse de livraison.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                <PackageIcon />
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-gray-900">
                  Préparation de votre colis
                </p>
                <p className="mt-1 text-xs leading-6 text-gray-500">
                  Une fois confirmée, votre commande sera préparée avec soin
                  et vérifiée avant expédition.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                <TruckIcon />
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-gray-900">
                  Livraison et paiement
                </p>
                <p className="mt-1 text-xs leading-6 text-gray-500">
                  Vous recevrez votre commande chez vous sous 24h à 72h et
                  paierez en espèces au livreur.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Help / WhatsApp card */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-6 sm:p-8">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black text-gray-900">
                Une question sur votre commande ?
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Notre équipe est disponible sur WhatsApp.
              </p>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-sm font-black text-white transition hover:bg-green-600"
            >
              <WhatsappIcon />
              Contacter sur WhatsApp
            </a>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-7 py-3.5 text-sm font-black text-white transition hover:bg-orange-600"
          >
            Continuer mes achats
            <ArrowRight />
          </Link>
          <Link
            href="/track-order"
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-7 py-3.5 text-sm font-black text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
          >
            Suivre ma commande
          </Link>
        </div>

        {/* Trust strip */}
        <div className="mt-12 grid grid-cols-3 gap-3 border-t border-gray-100 pt-8">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-orange-600">
              <TruckIcon />
            </div>
            <div>
              <p className="text-[11px] font-black text-gray-900">Livraison</p>
              <p className="text-[10px] text-gray-500">Toute la Tunisie</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-orange-600">
              <CashIcon />
            </div>
            <div>
              <p className="text-[11px] font-black text-gray-900">Paiement</p>
              <p className="text-[10px] text-gray-500">À la livraison</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-orange-600">
              <PhoneCallIcon />
            </div>
            <div>
              <p className="text-[11px] font-black text-gray-900">Support</p>
              <p className="text-[10px] text-gray-500">7j/7</p>
            </div>
          </div>
        </div>

        {/* Call us hint */}
        <p className="mt-8 text-center text-xs text-gray-400">
          Besoin d&apos;aide immédiate ?{" "}
          <a
            href={`tel:${phone}`}
            className="font-bold text-orange-600 hover:text-orange-700"
          >
            Appelez le {phone}
          </a>
        </p>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="mt-12 border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-3 text-xs text-gray-500 sm:flex-row">
            <p>
              © {new Date().getFullYear()} Darytek — Tous droits réservés.
            </p>
            <div className="flex gap-4">
              <Link href="/" className="hover:text-orange-600">
                Accueil
              </Link>
              <Link href="/products" className="hover:text-orange-600">
                Produits
              </Link>
              <Link href="/track-order" className="hover:text-orange-600">
                Suivi
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}