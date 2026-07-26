import type { Metadata } from "next";
import { InfoLayout } from "@/src/components/templates/InfoLayout";
import { IslandExplorer } from "@/src/components/organisms/IslandExplorer";

export const metadata: Metadata = {
  title: "Kiribati Island Map & Directory | Island Connects",
  description: "Explore the 33 islands of Kiribati across the Gilbert, Line, and Phoenix Island groups.",
};

export default function MapPage() {
  return (
    <InfoLayout
      title="Kiribati Island Map & Directory"
      subtitle="Explore the 33 islands of Kiribati across the Gilbert, Line, and Phoenix Island groups."
    >
      <div className="flex flex-col gap-6">
        <IslandExplorer />
      </div>
    </InfoLayout>
  );
}
