import Link from "next/link";

const supportLinks = [
  { label: "Contact Us", href: "/contact" },
  { label: "FAQs", href: "/faqs" },
  { label: "Cancellations", href: "/cancellations" },
  { label: "Payment", href: "/payment" },
];

const aboutLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Blog", href: "/blog" },
  { label: "Careers", href: "/careers" },
];

const discoverLinks = [
  { label: "Tarawa", href: "/guides/tarawa" },
  { label: "Kiritimati", href: "/guides/kiritimati" },
  { label: "Outer Islands", href: "/guides/outer-islands" },
  { label: "Map", href: "/map" },
];

export function Footer() {
  return (
    <footer className="border-t border-[#DDDDDD] bg-white">
      <div className="container-app py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-3">
            <Link href="/" className="text-xl font-bold text-[#FF385C]">
              Kiribati
            </Link>
            <p className="text-sm leading-relaxed text-[#717171]">
              Discover the authentic beauty of Kiribati Islands. From handcrafted
              products to unique stays and cultural guides, we connect you with
              the heart of the Pacific.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-[#222222]">Support</h4>
            <ul className="flex flex-col gap-2">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#717171] transition-colors hover:text-[#222222]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-[#222222]">About</h4>
            <ul className="flex flex-col gap-2">
              {aboutLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#717171] transition-colors hover:text-[#222222]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-[#222222]">Discover</h4>
            <ul className="flex flex-col gap-2">
              {discoverLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#717171] transition-colors hover:text-[#222222]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-[#DDDDDD]">
        <div className="container-app flex items-center justify-between py-4">
          <p className="text-xs text-[#717171]">
            &copy; {new Date().getFullYear()} Kiribati Islands. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
