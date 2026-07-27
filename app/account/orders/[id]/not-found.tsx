import Link from "next/link";
import { HiShieldExclamation, HiArrowLeft } from "react-icons/hi2";

export default function OrderNotFound() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-sm">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-[#FF385C]">
        <HiShieldExclamation className="h-8 w-8" />
      </div>
      <h2 className="mb-2 text-xl font-bold text-ink">Order Not Found or Access Denied</h2>
      <p className="mb-6 max-w-md text-sm text-gray-500">
        The order you are looking for does not exist, or you do not have permission to view it. Please check your order history.
      </p>
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-2 rounded-lg bg-[#FF385C] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#E31C5F]"
      >
        <HiArrowLeft className="h-4 w-4" />
        Back to Order History
      </Link>
    </div>
  );
}
