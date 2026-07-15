import { create } from "zustand";

interface UIState {
  isCartOpen: boolean;
  isMobileNavOpen: boolean;
  isBookingModalOpen: boolean;
  activeBookingStayId: string | null;
  openCart: () => void;
  closeCart: () => void;
  toggleMobileNav: () => void;
  closeMobileNav: () => void;
  openBookingModal: (stayId: string) => void;
  closeBookingModal: () => void;
}

export const useUIStore = create<UIState>()((set, get) => ({
  isCartOpen: false,
  isMobileNavOpen: false,
  isBookingModalOpen: false,
  activeBookingStayId: null,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleMobileNav: () =>
    set({ isMobileNavOpen: !get().isMobileNavOpen }),
  closeMobileNav: () => set({ isMobileNavOpen: false }),
  openBookingModal: (stayId) =>
    set({ isBookingModalOpen: true, activeBookingStayId: stayId }),
  closeBookingModal: () =>
    set({ isBookingModalOpen: false, activeBookingStayId: null }),
}));
