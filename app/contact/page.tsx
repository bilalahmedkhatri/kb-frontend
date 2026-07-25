"use client";

import { InfoLayout } from "@/src/components/templates/InfoLayout";
import { Button } from "@/src/components/atoms/Button";
import { Input } from "@/src/components/atoms/Input";
import { HiEnvelope, HiMapPin } from "react-icons/hi2";
import { FaWhatsapp } from "react-icons/fa";

export default function ContactPage() {
  return (
    <InfoLayout
      title="Contact & Support"
      subtitle="Have questions about booking a stay, purchasing handicrafts, or hosting an artisan workshop? Get in touch with our team."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold text-[var(--ink)] mb-4">Send Us a Message</h2>
          <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-xs font-semibold text-[var(--gray-700)] mb-1">Your Name</label>
              <Input placeholder="e.g. John Doe" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--gray-700)] mb-1">Email Address</label>
              <Input type="email" placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--gray-700)] mb-1">Message</label>
              <textarea
                rows={4}
                placeholder="How can we help you?"
                className="w-full rounded-lg border border-[var(--gray-300)] p-3 text-sm focus:border-[var(--ink)] focus:outline-hidden"
              />
            </div>
            <Button variant="primary" className="w-full">
              Send Message
            </Button>
          </form>
        </div>

        <div className="flex flex-col gap-6 rounded-2xl bg-[var(--gray-50)] p-6 border border-[var(--gray-200)]">
          <h2 className="text-xl font-bold text-[var(--ink)]">Direct Contact Info</h2>
          
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <FaWhatsapp className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--gray-500)]">WhatsApp Instant Inquiry</h3>
              <p className="text-sm font-semibold text-[var(--ink)]">+686 7300 0000</p>
              <p className="text-xs text-[var(--gray-500)]">Best for island homestays & workshop availability</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <HiEnvelope className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--gray-500)]">Email Support</h3>
              <p className="text-sm font-semibold text-[var(--ink)]">support@islandconnects.com</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
              <HiMapPin className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--gray-500)]">Kiribati Head Office</h3>
              <p className="text-sm font-semibold text-[var(--ink)]">Bairiki, South Tarawa, Kiribati</p>
            </div>
          </div>
        </div>
      </div>
    </InfoLayout>
  );
}
