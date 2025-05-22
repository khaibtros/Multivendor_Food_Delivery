import Info from "../components/HomeScreen/Info.tsx";
import CardComponent from "../components/HomeScreen/CardComponent.tsx";
import Faq from "../components/HomeScreen/FAQ.tsx";

const HomePage = () => {
  return (
    <div className="flex flex-col gap-12">
      <div className="md:px-32 bg-white rounded-lg shadow-md py-8 flex flex-col gap-5 text-center -mt-16">
        <h1 className="text-5xl font-bold tracking-tight text-orange-600">
          
        </h1>
        <span className="text-xl"></span>
      </div>
      <Info />
      <CardComponent />
      <Faq />
    </div>
  );
};

export default HomePage;
