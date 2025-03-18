import { Address } from "viem";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AddressAvatar = ({
  address,
  className,
}: {
  address: Address;
  className?: string;
}) => (
  <Avatar className={className}>
    <AvatarImage
      src={`https://effigy.im/a/${address}.svg`}
      alt="Ethereum avatar"
    />
    <AvatarFallback>0x</AvatarFallback>
  </Avatar>
);

export default AddressAvatar;
