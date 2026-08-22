import type { User } from "@/src/types";

/**
 * Single permission source for the whole app.
 * Client-side UI adaptation (navItemsForRole) and API guards MUST derive
 * from these helpers. Never hardcode role checks in multiple places.
 */

export type Role = "guest" | "customer" | "vendor" | "admin";

export interface NavItem {
  label: string;
  href: string;
}

export interface WorkspaceNavItem extends NavItem {
  group: "vendor" | "admin";
}

/** Resolve the effective role for a user (unauthenticated => guest). */
export function roleForUser(user: User | null): Role {
  return user?.role ?? "guest";
}

export function hasRole(user: User | null, ...roles: Role[]): boolean {
  return roles.includes(roleForUser(user));
}

export function canAccessCustomerAccount(user: User | null): boolean {
  return hasRole(user, "customer", "vendor", "admin");
}

export function canAccessVendorWorkspace(user: User | null): boolean {
  return hasRole(user, "vendor", "admin");
}

export function canAccessAdminPortal(user: User | null): boolean {
  return hasRole(user, "admin");
}

export function canManageListings(user: User | null): boolean {
  return canAccessVendorWorkspace(user);
}

export function canModerateContent(user: User | null): boolean {
  return canAccessAdminPortal(user);
}

/** Public discovery navigation shown to every role. */
export const publicNavItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Stays", href: "/stays" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Experiences", href: "/experiences" },
  { label: "Guides", href: "/guides" },
];

export const customerNavItems: NavItem[] = [
  { label: "My Account", href: "/account" },
  { label: "Wishlist", href: "/wishlist" },
];

export const vendorWorkspaceNavItems: WorkspaceNavItem[] = [
  { label: "Vendor Dashboard", href: "/vendor/dashboard", group: "vendor" },
  { label: "My Products", href: "/vendor/products", group: "vendor" },
  { label: "Vendor Orders", href: "/vendor/orders", group: "vendor" },
];

export const adminPortalNavItems: WorkspaceNavItem[] = [
  { label: "Admin Dashboard", href: "/admin/dashboard", group: "admin" },
  { label: "Moderate Listings", href: "/admin/products", group: "admin" },
  { label: "Manage Vendors", href: "/admin/vendors", group: "admin" },
  { label: "Platform Settings", href: "/admin/settings", group: "admin" },
];

/** Main navigation links for a role (public discovery + role-specific). */
export function navItemsForRole(role: Role): NavItem[] {
  const items = [...publicNavItems];
  if (role === "customer" || role === "vendor" || role === "admin") {
    items.push(...customerNavItems);
  }
  return items;
}

/** Vendor/Admin portal links visible in the account menu for a role. */
export function workspaceNavItemsForRole(role: Role): WorkspaceNavItem[] {
  const items: WorkspaceNavItem[] = [];
  if (role === "vendor" || role === "admin") {
    items.push(...vendorWorkspaceNavItems);
  }
  if (role === "admin") {
    items.push(...adminPortalNavItems);
  }
  return items;
}
