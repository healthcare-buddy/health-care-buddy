import { Navbar } from "@/components/Navbar";
import { Spotlight } from "@/components/ui/spotlight";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Spotlight className="sm:-top-[50rem] -top-[55rem] " fill="violet" />
      <Navbar />
      <main className="container mx-auto py-8">{children}</main>
    </>
  );
}
