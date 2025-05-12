import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar = ({
  onSearch,
  placeholder = "Search the Bhāgavatam...",
}: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md mx-auto">
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pr-10 bg-white/80 border-orange-200 focus:border-orange-400"
      />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-full text-orange-800"
      >
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default SearchBar;
