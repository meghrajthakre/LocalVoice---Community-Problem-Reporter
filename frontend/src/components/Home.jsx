import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import RequestsTable from "../components/RequestsTable";
import CTA from "../components/CTA";

const Home = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar/>
      <Hero/>
      <Stats/>
      <RequestsTable/>
      <CTA/>
    </div>
  );
};

export default Home;
