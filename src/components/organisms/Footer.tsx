import Link from "next/link";
import { FaFacebookF, FaXTwitter, FaInstagram, FaWhatsapp } from "react-icons/fa6";
import { Logo } from "@/src/components/atoms/Logo";

const supportLinks = [
  { label: "Contact Us", href: "/contact" },
  { label: "FAQs", href: "/faqs" },
  { label: "Cancellations", href: "/cancellations" },
  { label: "Payment & ANZ Bank Transfer", href: "/payment" },
];

const aboutLinks = [
  { label: "About Island Connects", href: "/about" },
  { label: "Artisan Fair Trade", href: "/fair-trade" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

const discoverLinks = [
  { label: "Stays & Eco-Lodges", href: "/stays" },
  { label: "Handicraft Marketplace", href: "/marketplace" },
  { label: "Cultural Experiences", href: "/experiences" },
  { label: "Island Guides & Stories", href: "/guides" },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--gray-300)] bg-white text-[var(--ink)]">
      <div className="container-app py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Logo compact={true} className="mb-1" />
            <p className="text-xs leading-relaxed text-[var(--gray-500)]">
              Connecting conscious travelers directly with local Kiribati homestays, master handicraft artisans, and authentic island experiences across the Pacific atolls.
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--gray-100)] text-[var(--gray-700)] transition-all hover:bg-[var(--rausch)] hover:text-white"
              >
                <FaFacebookF className="h-4 w-4" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--gray-100)] text-[var(--gray-700)] transition-all hover:bg-black hover:text-white"
              >
                <FaXTwitter className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--gray-100)] text-[var(--gray-700)] transition-all hover:bg-rose-600 hover:text-white"
              >
                <FaInstagram className="h-4 w-4" />
              </a>
              <a
                href="https://wa.me/+68673000000"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--gray-100)] text-[var(--gray-700)] transition-all hover:bg-emerald-600 hover:text-white"
              >
                <FaWhatsapp className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--ink)]">Support & Booking</h4>
            <ul className="flex flex-col gap-2">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-[var(--gray-500)] transition-colors hover:text-[var(--ink)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--ink)]">Platform & Impact</h4>
            <ul className="flex flex-col gap-2">
              {aboutLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-[var(--gray-500)] transition-colors hover:text-[var(--ink)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--ink)]">Discover Kiribati</h4>
            <ul className="flex flex-col gap-2">
              {discoverLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-[var(--gray-500)] transition-colors hover:text-[var(--ink)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--gray-200)] bg-[var(--gray-50)]">
        <div className="container-app flex flex-col sm:flex-row items-center justify-between py-4 gap-2">
          <p className="text-xs text-[var(--gray-500)]">
            &copy; {new Date().getFullYear()} Island Connects (`islandconnects.com`). All rights reserved.
          </p>
          <p className="text-xs font-medium text-[var(--gray-500)]">
            100% Direct Island Community Fair-Trade Platform
          </p>
        </div>
      </div>
    </footer>
  );
}
