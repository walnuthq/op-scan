import { CommandItem } from "cmdk";
import { truncateText } from "@/utils";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import Link from "next/link";

type ItemProps = {
  selectedCategory: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
  value: string;
  index: number;
};

const Item = ({ selectedCategory, setOpen, value, index }: ItemProps) => {
  const router = useRouter();

  const categoryToRedirect =
    selectedCategory === "Transactions"
      ? "tx"
      : selectedCategory === "Blocks"
        ? "block"
        : "address";

  // Handle click
  const handleItemClick = (value: string) => {
    setOpen(false);
    router.push(`/${categoryToRedirect}/${value}`);
  };

  return (
    <Link
      key={index}
      href={`/${categoryToRedirect}/${value}`}
      onClick={() => setOpen(false)}
    >
      <CommandItem value={value} onSelect={() => handleItemClick(value)}>
        <div className="self-start rounded-md bg-transparent p-2 text-sm opacity-[0.6]">
          {truncateText(value, 16)}
        </div>
      </CommandItem>
    </Link>
  );
};

export default Item;
