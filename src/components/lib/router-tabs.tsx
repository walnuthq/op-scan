import { type ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";

const RouterTabs = ({
  tabs,
  currentTab,
  children,
}: {
  tabs: Record<string, ReactNode>;
  currentTab: string;
  children: ReactNode;
}) => {
  const router = useRouter();
  return (
    <Tabs
      defaultValue={currentTab}
      onValueChange={(value) => router.push(value)}
    >
      <TabsList>
        {Object.keys(tabs).map((tab) => (
          <TabsTrigger
            key={tab}
            value={tab}
            data-state={currentTab === tab ? "active" : "inactive"}
          >
            {tabs[tab]}
          </TabsTrigger>
        ))}
      </TabsList>
      {Object.keys(tabs).map((tab) => (
        <TabsContent key={tab} value={tab}>
          {children}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default RouterTabs;
