import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

const Search = () => (
  <form className="ml-auto flex-1 sm:flex-initial">
    <div className="relative">
      <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search by Address / Txn Hash / Block / Token"
        className="pl-8 sm:w-[110px] md:w-[360px] lg:w-[480px]"
      />
    </div>
  </form>
);

export default Search;
