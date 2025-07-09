import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

type Props = {
    onSearch: (search: string) => void;
}
export const SearchBar = ({ onSearch }: Props) => {
    const [search, setSearch] = useState("");

    useEffect(() => {
        const timeout = setTimeout(() => {
            onSearch(search);
        }, 500);
        return () => clearTimeout(timeout);
    }, [search, onSearch]);

    return (
        <Input
            placeholder="Search for tasks"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />
    )
}