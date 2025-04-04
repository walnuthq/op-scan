import { BadgeCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { type ContractInfo } from "@/lib/types";

const AddressContractInfo = ({ info }: { info: ContractInfo }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-1 text-sm">
      <BadgeCheck className="size-4 text-green-500" />
      <span className="font-semibold">Contract Source Code Verified</span>
      <span className="text-muted-foreground">
        ({info.match === "partial" ? "Partial" : "Perfect"} Match)
      </span>
    </div>
    <div className="grid gap-4 text-sm lg:grid-cols-2">
      <div>
        <div className="grid grid-cols-2">
          <span>Contract Name</span>
          <span className="font-semibold">{info.name}</span>
        </div>
        <Separator className="my-4" />
        <div className="grid grid-cols-2">
          <span>Compiler Version</span>
          <span className="font-semibold">{info.compilerVersion}</span>
        </div>
      </div>
      <div>
        <div className="grid grid-cols-2">
          <span>Optimization Enabled</span>
          <div className="flex items-center gap-1">
            <span className="font-semibold">
              {info.optimizer.enabled ? "Yes" : "No"}
            </span>
            {info.optimizer.enabled && (
              <>
                <span>with</span>
                <span className="font-semibold">{info.optimizer.runs}</span>
                <span>runs</span>
              </>
            )}
          </div>
        </div>
        <Separator className="my-4" />
        <div className="grid grid-cols-2">
          <span>Other Settings</span>
          <div className="flex items-center gap-1">
            <span className="font-semibold">{info.evmVersion}</span>
            <span>evmVersion</span>
            {/* <span className="font-semibold">MIT</span>
            <span>license</span> */}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AddressContractInfo;
