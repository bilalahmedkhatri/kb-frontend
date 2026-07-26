import type { Metadata } from "next";
import { InfoLayout } from "@/src/components/templates/InfoLayout";

export const metadata: Metadata = {
  title: "Careers | Island Connects",
  description: "Join our mission to empower Pacific island communities through sustainable digital innovation.",
};

export default function CareersPage() {
  return (
    <InfoLayout
      title="Careers at Island Connects"
      subtitle="Join our mission to empower Pacific island communities through sustainable digital innovation."
    >
      <div className="rounded-2xl border border-[var(--gray-200)] p-6 bg-[var(--gray-50)] text-sm text-[var(--gray-700)]">
        <h2 className="text-lg font-bold text-[var(--ink)] mb-2">No Open Roles Currently</h2>
        <p>
          Island Connects is currently operated in partnership with local Kiribati island elders and community cooperatives. Check back soon for future roles in community operations and logistics!
        </p>
      </div>
    </InfoLayout>
  );
}
