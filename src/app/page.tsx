import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { Characters } from "@/components/sections/Characters";
import { Anatomy } from "@/components/sections/Anatomy";
import { Transformation } from "@/components/sections/Transformation";
import { Services } from "@/components/sections/Services";
import { Formats } from "@/components/sections/Formats";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Characters />
        <Anatomy />
        <Transformation />
        <Services />
        <Formats />
      </main>
    </>
  );
}
