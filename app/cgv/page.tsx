import { createClient } from "@/lib/supabase/server";
import LegalPage from "@/components/store/LegalPage";

export const metadata = {
  title: "Conditions Générales de Vente — Darytek",
  description:
    "Conditions générales de vente de Darytek, boutique d'électroménager en Tunisie.",
};

export default async function CGVPage() {
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
      title="Conditions Générales de Vente"
      subtitle="Les règles qui régissent vos commandes et nos engagements réciproques."
      lastUpdated="Janvier 2025"
      categories={categories ?? []}
      phone={phone}
      whatsapp={whatsapp}
      sections={[
        {
          id: "objet",
          title: "Objet",
          body: (
            <>
              <p>
                Les présentes Conditions Générales de Vente (CGV) régissent
                les relations contractuelles entre{" "}
                <strong className="text-navy-800">Darytek</strong> et toute
                personne effectuant un achat sur le site.
              </p>
              <p>
                Toute commande implique l&apos;acceptation sans réserve des
                présentes CGV.
              </p>
            </>
          ),
        },
        {
          id: "produits",
          title: "Produits",
          body: (
            <>
              <p>
                Les produits proposés sont des appareils électroménagers et
                articles électroniques, disponibles en stock.
              </p>
              <p>
                Les photographies et descriptions sont fournies à titre
                indicatif et n&apos;ont pas de valeur contractuelle. En cas de
                doute, contactez-nous avant la commande pour confirmation.
              </p>
              <p>
                La disponibilité des produits est mise à jour régulièrement.
                En cas d&apos;indisponibilité après commande, nous vous en
                informerons et vous proposerons un remplacement ou un
                remboursement.
              </p>
            </>
          ),
        },
        {
          id: "prix",
          title: "Prix",
          body: (
            <>
              <p>
                Les prix sont indiqués en dinars tunisiens (DT), toutes taxes
                comprises. Ils sont susceptibles de changer à tout moment,
                mais le prix appliqué est celui affiché au moment de la
                validation de votre commande.
              </p>
              <p>
                Les frais de livraison sont calculés en fonction de votre
                localisation et vous sont communiqués avant confirmation de
                la commande.
              </p>
            </>
          ),
        },
        {
          id: "commande",
          title: "Commande",
          body: (
            <>
              <p>
                Pour passer commande, vous devez fournir des informations
                exactes et complètes (nom, téléphone, adresse).
              </p>
              <p>Le processus est le suivant :</p>
              <ol className="ml-4 list-decimal space-y-1 pl-2">
                <li>Vous ajoutez les produits à votre panier</li>
                <li>
                  Vous remplissez vos informations de livraison sur la page
                  de commande
                </li>
                <li>Vous validez votre commande</li>
                <li>
                  Nous vous contactons par téléphone pour la confirmer avant
                  expédition
                </li>
              </ol>
              <p>
                Nous nous réservons le droit d&apos;annuler toute commande en
                cas d&apos;informations manifestement frauduleuses ou
                incohérentes.
              </p>
            </>
          ),
        },
        {
          id: "paiement",
          title: "Paiement",
          body: (
            <>
              <p>
                Le paiement s&apos;effectue uniquement{" "}
                <strong>à la livraison</strong>, en espèces, directement au
                livreur.
              </p>
              <p>
                Aucun pré-paiement, virement ou paiement en ligne
                n&apos;est demandé.
              </p>
            </>
          ),
        },
        {
          id: "livraison",
          title: "Livraison",
          body: (
            <>
              <p>
                Nous livrons partout en Tunisie sous 24h à 72h après
                confirmation de votre commande.
              </p>
              <p>
                Les délais sont indicatifs et peuvent varier en fonction de
                votre localisation et des conditions extérieures. En cas de
                retard important, nous vous en informerons par téléphone ou
                WhatsApp.
              </p>
              <p>
                La livraison est assurée par nos partenaires de confiance ou
                directement par notre équipe pour la région du Grand-Tunis.
              </p>
            </>
          ),
        },
        {
          id: "retractation",
          title: "Retour et rétractation",
          body: (
            <>
              <p>
                Conformément à notre engagement qualité, vous disposez de{" "}
                <strong>7 jours</strong> à compter de la réception pour
                signaler tout problème ou demander un retour, à condition que
                :
              </p>
              <ul className="ml-4 list-disc space-y-1 pl-2">
                <li>Le produit soit intact, non utilisé</li>
                <li>
                  L&apos;emballage d&apos;origine soit conservé en bon état
                </li>
                <li>
                  Tous les accessoires et notices soient présents
                </li>
              </ul>
              <p>
                Les frais de retour sont à la charge du client sauf en cas de
                défaut de fabrication ou d&apos;erreur de notre part.
              </p>
              <p>
                En cas de remboursement, celui-ci est effectué dans un délai
                de 7 jours ouvrés après réception et vérification du produit
                retourné.
              </p>
            </>
          ),
        },
        {
          id: "garantie",
          title: "Garantie",
          body: (
            <>
              <p>
                Tous nos produits bénéficient de la garantie du fabricant,
                dont la durée varie selon la marque et le modèle. La garantie
                couvre les défauts de fabrication et de matériel, mais ne
                couvre pas :
              </p>
              <ul className="ml-4 list-disc space-y-1 pl-2">
                <li>L&apos;usure normale du produit</li>
                <li>
                  Les dommages causés par une mauvaise utilisation, un choc,
                  une chute ou une exposition à l&apos;humidité
                </li>
                <li>
                  Les réparations ou modifications effectuées par des tiers
                  non autorisés
                </li>
              </ul>
              <p>
                Pour faire jouer la garantie, conservez votre facture
                d&apos;achat et contactez-nous.
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
                Darytek ne peut être tenue responsable des dommages indirects,
                pertes d&apos;exploitation ou tout préjudice immatériel
                résultant de l&apos;utilisation de ses produits.
              </p>
              <p>
                Notre responsabilité est limitée au montant de la commande
                concernée.
              </p>
            </>
          ),
        },
        {
          id: "litiges",
          title: "Litiges et droit applicable",
          body: (
            <>
              <p>
                Les présentes CGV sont régies par le droit tunisien. En cas de
                litige, une solution amiable sera recherchée en priorité.
              </p>
              <p>
                À défaut d&apos;accord amiable, tout litige sera soumis aux
                tribunaux compétents de Tunis.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}