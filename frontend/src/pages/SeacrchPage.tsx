import { useSearchRestaurants } from "@/api/RestaurantApi";
import CuisinesFilter from "@/components/CuisinesFilter";
import SearchBar from "@/components/SearchBar";
import SearchResultCard from "@/components/SearchResultCard";
import SearchResultInfo from "@/components/SearchResultInfo";
import SortOptionDropdown from "@/components/SortOptionDropdown";
import PaginationSelector from "@/components/ui/PaginationSelector";
import { useState } from "react";
import { useParams } from "react-router-dom";

export type SearchState = {
    searchQuery: string;
    page : number;
    selectedCuisines: string[];
    sortOption: string;
};

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
    page: 1,
    selectedCuisines: [],  
    sortOption: "bestMatch",
  });
   
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  
  
  const { results, isLoading } = useSearchRestaurants(searchState, city);
  
  const setSortOption = (sortOption: string)=> {
     setSearchState((prevState)=> ({
       ...prevState,
       selectedCuisines,
       page: 1,
     }));
  };

  const setSelectedCuisines = (selectedCuisiness: string[]) => {
    setSearchState((prevState)=> ({
      ...prevState,
      selectedCuisines,
      page: 1,
    }));
  };

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
      <div id="cuisines-list">
        <CuisinesFilter
        selectedCuisines={searchState.selectedCuisines}
        onChange={setSelectedCuisines}
        isExpanded={isExpanded}
        onExpandedClick={()=> 
          setIsExpanded((prevIsExpanded)=> !prevExpanded)}
      />
      </div>
      <div id="main-content" className="flex flex-col gap-5">
        <SearchBar onSubmit={setSearchQuery}
         onSubmit={setSearchQuery}
         placeHolder="Search by Cuisine or Restaurant Name"  
        onReset={resetSearch}
        />
        <div className="flex justify-between flex-col gap-3 lg:flex-row">

          <SearchResultInfo total={results.pagination.total} city={city} />
        <SortOptionDropdown 
        sortOption={searchState.sortOption} 
        onChange={(value)=> setSortOption(value)}
        /> 
        </div>
        
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