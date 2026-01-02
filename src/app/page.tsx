import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import CampDetails from "@/components/CampDetails";
import ParentsInfo from "@/components/ParentsInfo";
import Gallery from "@/components/Gallery";
import Team from "@/components/Team";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <CampDetails />
      <ParentsInfo />
      <Gallery />
      <Team />
      <Contact />
      <Footer />
    </main>
  );
}
