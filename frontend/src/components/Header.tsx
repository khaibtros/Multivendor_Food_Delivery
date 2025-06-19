import { Link, useNavigate } from "react-router-dom";
import MobileNav from "./MobileNav";
import MainNav from "./MainNav";
import SearchBar, { SearchForm } from "./SearchBar";

const Header = () => {
  const navigate = useNavigate();

  const handleSearchSubmit = (searchFormValues: SearchForm) => {
    navigate({
      pathname: `/search/${searchFormValues.searchQuery}`,
    });
  };

  return (
    <div className="border-b-2 border-b-red-500 py-6">
      <div className="container mx-auto">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/"
            className="text-3xl font-bold tracking-tight text-red-500"
          >
            QuickMunch
          </Link>
          <div className="flex-1 max-w-2xl mx-4">
            <SearchBar
              placeHolder="Enter your location (Ward, District, City)"
              onSubmit={handleSearchSubmit}
            />
          </div>
          <div className="md:hidden">
            <MobileNav />
          </div>
          <div className="hidden md:block">
            <MainNav />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
