import CardComponent from "./HomeScreen/CardComponent";
import FAQ from "./HomeScreen/FAQ";
import Info from "./HomeScreen/Info";

const Hero = () => {
  return (
    <div>
      <iframe
        src="/hero.html"
        className="w-full h-[700px] border-none"
        title="Hero Section"
      ></iframe>
      <Info />
      {/* <JoinPlatform /> */}
      <CardComponent />
      {/* <PlatformFeatures />
      <AppsInfo />
      <OrderFavorites /> */}
      <FAQ />
    </div>
  );
};

export default Hero;
