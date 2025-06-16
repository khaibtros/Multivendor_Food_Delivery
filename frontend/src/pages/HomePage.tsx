import SearchBar, { SearchForm } from "@/components/SearchBar";
import { useNavigate } from "react-router-dom";
import CardComponent from "@/components/HomeScreen/CardComponent";
import FAQ from "@/components/HomeScreen/FAQ";
import Info from "@/components/HomeScreen/Info";

const HomePage = () => {
  const navigate = useNavigate();

  const handleSearchSubmit = (searchFormValues: SearchForm) => {
    navigate({
      pathname: `/search/${searchFormValues.searchQuery}`,
    });
  };

  return (
    <div className="flex flex-col gap-12">
      <div className="md:px-32 bg-white rounded-lg shadow-md py-8 flex flex-col gap-5 text-center -mt-16">
        <SearchBar
          placeHolder="Search by City or Town"
          onSubmit={handleSearchSubmit}
        />
      </div>
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
