import { Badge } from "@/components/ui/badge";

const ChainBadge = ({ name }: { name: string }) => (
  <Badge variant="outline">{name}</Badge>
);

export default ChainBadge;
