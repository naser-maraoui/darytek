import { createClient } from "@/lib/supabase/server";
import LegalPage from "@/components/store/LegalPage";

export const metadata = {
  title: "Mentions légales — Darytek",
  description:
    "Mentions légales du site Darytek, boutique d'électroménager en Tunisie.",
};

export default async function MentionsLegalesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("name", { ascending: true });

  const phone = process.env.NEXT_PUBLIC_PHONE ?? "+216 XX XXX XXX";
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

  return (
    <LegalPage
      title="Mentions légales"
      subtitle="Informations légales relatives à l'édition et à l'exploitation du site Darytek."
      lastUpdated="Janvier 2025"
      categories={categories ?? []}
      phone={phone}
      whatsapp={whatsapp}
      sections={[
        {
          id: "editeur",
          title: "Éditeur du site",
          body: (
            <>
              <p>
                Le site <strong className="text-navy-800">Darytek</strong> est
                édité et exploité par :
              </p>
              <ul className="ml-4 list-disc space-y-1 pl-2">
                <li>
                  <strong>Raison sociale :</strong> Darytek
                </li>
                <li>
                  <strong>Forme juridique :</strong> Entreprise individuelle
                </li>
                <li>
                  <strong>Siège social :</strong> Tunis, Tunisie
                </li>
                <li>
                  <strong>Matricule fiscal :</strong> À compléter
                </li>
                <li>
                  <strong>Téléphone :</strong>{" "}
                  <a href={`tel:${phone}`} className="text-orange-600 hover:underline">
                    {phone}
                  </a>
                </li>
                <li>
                  <strong>Email :</strong>{" "}
                  <a href="mailto:contact@darytek.tn" className="text-orange-600 hover:underline">
                    contact@darytek.tn
                  </a>
                </li>
              </ul>
              <p className="text-xs italic text-gray-400">
                Ces informations sont fournies à titre indicatif et doivent
                être complétées avec les données réelles de l&apos;entreprise.
              </p>
            </>
          ),
        },
        {
          id: "hebergement",
          title: "Hébergement",
          body: (
            <>
              <p>Le site est hébergé par :</p>
              <ul className="ml-4 list-disc space-y-1 pl-2">
                <li>
                  <strong>Hébergeur :</strong> Vercel Inc.
                </li>
                <li>
                  <strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA
                  91789, États-Unis
                </li>
                <li>
                  <strong>Site web :</strong>{" "}
                  <a
                    href="https://vercel.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:underline"
                  >
                    vercel.com
                  </a>
                </li>
              </ul>
            </>
          ),
        },
        {
          id: "propriete",
          title: "Propriété intellectuelle",
          body: (
            <>
              <p>
                L&apos;ensemble des éléments composant le site Darytek
                (structure, textes, images, logos, marques, illustrations,
                vidéos et tout autre contenu) est la propriété exclusive de
                Darytek ou de ses partenaires, et est protégé par les lois
                tunisiennes et internationales relatives à la propriété
                intellectuelle.
              </p>
              <p>
                Toute reproduction, représentation, modification, publication,
                adaptation ou exploitation de tout ou partie du site, par
                quelque moyen que ce soit, est strictement interdite sans
                autorisation écrite préalable de Darytek.
              </p>
              <p>
                Les marques et logos de tiers présents sur le site (Samsung,
                LG, Whirlpool, Bosch, Beko, etc.) sont la propriété de leurs
                détenteurs respectifs et sont utilisés dans le cadre de la
                revente de leurs produits.
              </p>
            </>
          ),
        },
        {
          id: "responsabilite",
          title: "Responsabilité",
          body: (
            <>
              <p>
                Darytek s&apos;efforce d&apos;assurer l&apos;exactitude et la
                mise à jour des informations diffusées sur son site.
                Toutefois, elle ne peut garantir l&apos;exactitude,
                l&apos;exhaustivité ou l&apos;actualité des informations
                publiées.
              </p>
              <p>
                Darytek décline toute responsabilité pour :
              </p>
              <ul className="ml-4 list-disc space-y-1 pl-2">
                <li>Les interruptions temporaires du service</li>
                <li>Les erreurs typographiques ou inexactitudes</li>
                <li>
                  Les dommages directs ou indirects résultant de
                  l&apos;utilisation du site
                </li>
                <li>
                  Le contenu des sites tiers vers lesquels des liens peuvent
                  être établis
                </li>
              </ul>
            </>
          ),
        },
        {
          id: "donnees",
          title: "Protection des données",
          body: (
            <>
              <p>
                Darytek collecte et traite les données personnelles des
                utilisateurs conformément à sa{" "}
                <a
                  href="/politique-confidentialite"
                  className="font-bold text-orange-600 hover:underline"
                >
                  Politique de confidentialité
                </a>
                , qui fait partie intégrante des présentes mentions légales.
              </p>
            </>
          ),
        },
        {
          id: "cookies",
          title: "Cookies",
          body: (
            <>
              <p>
                Le site utilise uniquement des cookies techniques strictement
                nécessaires à son bon fonctionnement (panier, session
                utilisateur, préférences). Aucun cookie publicitaire ou de
                traçage tiers n&apos;est utilisé.
              </p>
            </>
          ),
        },
        {
          id: "droit",
          title: "Droit applicable",
          body: (
            <>
              <p>
                Les présentes mentions légales sont régies par le droit
                tunisien. Tout litige relatif à l&apos;utilisation du site
                relève de la compétence exclusive des tribunaux tunisiens.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}