import CardComponent from "@/components/HomeScreen/CardComponent";
import FAQ from "@/components/HomeScreen/FAQ";
import Info from "@/components/HomeScreen/Info";

const HomePage = () => {
  return (
    <div className="flex flex-col gap-12">
      <div>
        <Info />
        {/* <JoinPlatform /> */}
        <CardComponent />
        {/* <PlatformFeatures />
      <AppsInfo />
      <OrderFavorites /> */}
        <FAQ />
      </div>
    </div>
  );
};

export default HomePage;
