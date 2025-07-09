import { Input } from "@/components/ui/input";
import { TEST_IDS } from "@/constants/test-ids";
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
            data-testid={TEST_IDS.SEARCH_BAR_INPUT}
            placeholder="Search for tasks"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />
    )
}