import { createClient } from "@/lib/supabase/server";
import LegalPage from "@/components/store/LegalPage";

export const metadata = {
  title: "Politique de confidentialité — Darytek",
  description:
    "Politique de confidentialité et de protection des données personnelles de Darytek.",
};

export default async function PolitiqueConfidentialitePage() {
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
      title="Politique de confidentialité"
      subtitle="Comment nous collectons, utilisons et protégeons vos données personnelles."
      lastUpdated="Janvier 2025"
      categories={categories ?? []}
      phone={phone}
      whatsapp={whatsapp}
      sections={[
        {
          id: "introduction",
          title: "Introduction",
          body: (
            <>
              <p>
                Chez <strong className="text-navy-800">Darytek</strong>, la
                protection de votre vie privée est une priorité. La présente
                politique explique quelles données nous collectons, pourquoi
                nous les collectons, et comment vous pouvez exercer vos
                droits.
              </p>
              <p>
                En utilisant notre site et nos services, vous acceptez les
                pratiques décrites dans cette politique.
              </p>
            </>
          ),
        },
        {
          id: "collecte",
          title: "Données que nous collectons",
          body: (
            <>
              <p>
                Nous collectons uniquement les données nécessaires au
                traitement de vos commandes :
              </p>
              <ul className="ml-4 list-disc space-y-1 pl-2">
                <li>
                  <strong>Identité :</strong> nom complet, prénom
                </li>
                <li>
                  <strong>Contact :</strong> numéro de téléphone, adresse de
                  livraison
                </li>
                <li>
                  <strong>Commande :</strong> produits commandés, montant,
                  date
                </li>
                <li>
                  <strong>Notes facultatives :</strong> instructions que vous
                  nous transmettez lors de la commande
                </li>
              </ul>
              <p>
                Nous ne collectons <strong>aucune</strong> donnée bancaire
                (le paiement se fait à la livraison en espèces).
              </p>
            </>
          ),
        },
        {
          id: "utilisation",
          title: "Utilisation de vos données",
          body: (
            <>
              <p>Vos données sont utilisées exclusivement pour :</p>
              <ul className="ml-4 list-disc space-y-1 pl-2">
                <li>Traiter et livrer vos commandes</li>
                <li>Vous contacter pour confirmer ou préciser une commande</li>
                <li>Assurer le suivi et le service après-vente</li>
                <li>
                  Répondre à vos questions via WhatsApp, téléphone ou email
                </li>
              </ul>
              <p>
                Nous ne vendons, ne louons et ne partageons{" "}
                <strong>jamais</strong> vos données avec des tiers à des fins
                commerciales.
              </p>
            </>
          ),
        },
        {
          id: "conservation",
          title: "Conservation des données",
          body: (
            <>
              <p>
                Vos données sont conservées pendant la durée nécessaire au
                traitement de votre commande et au respect de nos obligations
                légales (garantie, comptabilité). Passé ce délai, elles sont
                supprimées de nos systèmes.
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
                Notre site utilise uniquement des cookies techniques
                strictement nécessaires à son fonctionnement :
              </p>
              <ul className="ml-4 list-disc space-y-1 pl-2">
                <li>
                  <strong>Panier :</strong> pour mémoriser vos articles
                </li>
                <li>
                  <strong>Session :</strong> pour votre navigation
                </li>
              </ul>
              <p>
                Aucun cookie publicitaire, analytique ou de traçage tiers
                n&apos;est utilisé. Vous pouvez à tout moment vider votre
                panier ou effacer les cookies depuis les paramètres de votre
                navigateur.
              </p>
            </>
          ),
        },
        {
          id: "securite",
          title: "Sécurité",
          body: (
            <>
              <p>
                Nous mettons en œuvre des mesures de sécurité techniques et
                organisationnelles pour protéger vos données contre tout accès
                non autorisé, modification, divulgation ou destruction.
              </p>
              <p>
                L&apos;accès à vos informations est strictement limité aux
                personnes habilitées à traiter votre commande.
              </p>
            </>
          ),
        },
        {
          id: "droits",
          title: "Vos droits",
          body: (
            <>
              <p>Vous disposez à tout moment des droits suivants :</p>
              <ul className="ml-4 list-disc space-y-1 pl-2">
                <li>
                  <strong>Droit d&apos;accès :</strong> consulter les données
                  que nous détenons sur vous
                </li>
                <li>
                  <strong>Droit de rectification :</strong> corriger des
                  informations inexactes
                </li>
                <li>
                  <strong>Droit de suppression :</strong> demander
                  l&apos;effacement de vos données
                </li>
                <li>
                  <strong>Droit d&apos;opposition :</strong> vous opposer à
                  certains traitements
                </li>
              </ul>
              <p>
                Pour exercer ces droits, contactez-nous via WhatsApp ou par
                téléphone. Nous traiterons votre demande dans les meilleurs
                délais.
              </p>
            </>
          ),
        },
        {
          id: "mineurs",
          title: "Protection des mineurs",
          body: (
            <>
              <p>
                Notre site n&apos;est pas destiné aux personnes de moins de
                18 ans. Nous ne collectons pas sciemment de données
                concernant des mineurs.
              </p>
            </>
          ),
        },
        {
          id: "modifications",
          title: "Modifications de cette politique",
          body: (
            <>
              <p>
                Nous nous réservons le droit de modifier cette politique à
                tout moment. La date de dernière mise à jour figure en haut de
                cette page. Nous vous invitons à la consulter régulièrement.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}