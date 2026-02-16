import HomeContent from "./HomeContent";
import { OrganizationJsonLd, WebsiteJsonLd } from "../components/JsonLd";

export const metadata = {
  title: {
    absolute: "DealDirect — Buy & Sell Properties Without Middlemen",
  },
  description:
    "DealDirect is India's #1 platform for buying, selling, and renting properties directly from owners — no brokerage, no middlemen. Browse apartments, villas, plots across Mumbai, Delhi, Bangalore and more.",
  keywords: ["real estate", "property", "buy property", "sell property", "rent property", "no brokerage", "India"],
};

export default function HomePage() {
  return (
    <>
      <OrganizationJsonLd />
      <WebsiteJsonLd />
      <HomeContent />
    </>
  );
}
