import { useSearchRestaurants } from "@/api/RestaurantApi";
import SearchBar from "@/components/SearchBar";
import SearchResultCard from "@/components/SearchResultCard";
import SearchResultInfo from "@/components/SearchResultInfo";
import { useParams } from "react-router-dom";

export type SearchState = {
    searchQuery: string;
    page : number;
}

const setSearchQuery = (searchFormData: SearchForm) => {
  setSearchState((prevState) => ({
    ...prevState,
    searchQuery: searchFormData.searchQuery,
    page: 1,
  }));
};

const resetSearch = () => {
  setSearchState((prevState) => ({
    ...prevState,
    searchQuery: "",
    page: 1,
  }));
};

  const setPage = (page: number) => {
    setSearchState((prevState) => ({
      ...prevState,
      page,
    }));
  };



const SearchPage = () => {
  const { city } = useParams();
  const [searchState, setSearchState] = useState<SearchState>({
    searchQuery: "",  
  });
   
  
  
  
  const { results, isLoading } = useSearchRestaurants(city);
  if (!results?.data || !city) {
    return <span>No results found</span>;
  }
  if (isLoading) {
    <span>Loading ...</span>;
  }



  const setSearchQuery = (searchFormData: SearchForm) => {
    setSearchState((prevState) => ({
      ...prevState,
      searchQuery: searchFormData.searchQuery,
      page: 1,
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
      <div id="cuisines-list">insert cuisines here :)</div>
      <div id="main-content" className="flex flex-col gap-5">
        <SearchBar onSubmit={setSearchQuery}
         onSubmit={setSearchQuery}
         placeHolder="Search by Cuisine or Restaurant Name"  />
        onReset={resetSearch}
        <SearchResultInfo total={results.pagination.total} city={city} />
        {results.data.map((restaurant) => (
          <SearchResultCard restaurant={restaurant} />
        ))}
        <PaginationSelector
          page={results.pagination.page}
          pages={results.pagination.pages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};     


    export default SearchPage ;