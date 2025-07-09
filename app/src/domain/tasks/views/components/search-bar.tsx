import { Input } from "@/components/ui/input";
import { useDebounce } from "@/domain/common/hooks/use-debounce";
import { useEffect, useState } from "react";

type Props = {
    onSearch: (search: string) => void;
}
export const SearchBar = ({ onSearch }: Props) => {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        onSearch(debouncedSearch);
    }, [debouncedSearch, onSearch]);

    return (
        <Input
            placeholder="Search for tasks"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />
    )
}