import { ProfileSection } from "./_components/ProfileSection";
import { EmergencyContactSection } from "./_components/EmergencyContactSection";
import { RegionalPreferencesSection } from "./_components/RegionalPreferencesSection";
import { SecuritySection } from "./_components/SecuritySection";
import { PaymentMethodsSection } from "./_components/PaymentMethodsSection";
import { SavedAddressesSection } from "./_components/SavedAddressesSection";

export default function AccountPage() {
  return (
    <div className="flex flex-col gap-8">
      <ProfileSection />
      <EmergencyContactSection />
      <RegionalPreferencesSection />
      <SecuritySection />
      <PaymentMethodsSection />
      <SavedAddressesSection />
    </div>
  );
}