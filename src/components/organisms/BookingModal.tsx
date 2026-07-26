"use client";

import { useState } from "react";
import Image from "next/image";
import { Root, Trigger, Portal, Overlay, Content } from "@radix-ui/react-dialog";
import {
  HiXMark,
  HiCalendarDays,
  HiUser,
  HiEnvelope,
  HiPhone,
  HiCheckCircle,
} from "react-icons/hi2";
import { cn, formatCurrency, formatDateRange } from "@/src/lib/utils";
import { Button } from "@/src/components/atoms/Button";
import { Input } from "@/src/components/atoms/Input";
import { QuantityStepper } from "@/src/components/molecules/QuantityStepper";
import { useUIStore } from "@/src/store/uiStore";
import type { Stay } from "@/src/types";

interface BookingModalProps {
  stay: Stay;
}

type Step = "dates-guests" | "contact" | "review";

export function BookingModal({ stay }: BookingModalProps) {
  const { isBookingModalOpen, closeBookingModal } = useUIStore();
  const [step, setStep] = useState<Step>("dates-guests");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const nights = checkIn && checkOut
    ? Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  const subtotal = nights * stay.pricePerNight;

  const handleClose = () => {
    closeBookingModal();
    setTimeout(() => {
      setStep("dates-guests");
      setCheckIn("");
      setCheckOut("");
      setGuests(1);
      setName("");
      setEmail("");
      setPhone("");
      setIsSubmitted(false);
    }, 300);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const steps: { key: Step; label: string; icon: React.ReactNode }[] = [
    { key: "dates-guests", label: "Dates & Guests", icon: <HiCalendarDays className="h-4 w-4" /> },
    { key: "contact", label: "Contact Details", icon: <HiEnvelope className="h-4 w-4" /> },
    { key: "review", label: "Review & Send", icon: <HiCheckCircle className="h-4 w-4" /> },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  return (
    <Root open={isBookingModalOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <Portal>
        <Overlay className="fixed inset-0 z-40 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out" />
        <Content className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-white p-0 data-[state=open]:animate-in data-[state=closed]:animate-out md:inset-auto md:left-1/2 md:top-1/2 md:w-full md:max-w-lg md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl md:p-0 md:shadow-xl">
          <div className="flex min-h-full flex-col md:min-h-0 md:max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-[#DDDDDD] px-6 py-4">
              <div className="flex items-center gap-2">
                {steps.map((s, i) => (
                  <div key={s.key} className="flex items-center gap-2">
                    <div
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-colors",
                        i <= currentStepIndex
                          ? "bg-[#222222] text-white"
                          : "bg-[#F7F7F7] text-[#717171]"
                      )}
                    >
                      {i + 1}
                    </div>
                    <span
                      className={cn(
                        "hidden text-sm font-medium sm:inline",
                        i <= currentStepIndex ? "text-[#222222]" : "text-[#717171]"
                      )}
                    >
                      {s.label}
                    </span>
                    {i < steps.length - 1 && (
                      <div
                        className={cn(
                          "mx-1 h-px w-6",
                          i < currentStepIndex ? "bg-[#222222]" : "bg-[#DDDDDD]"
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#717171] transition-colors hover:bg-[#F7F7F7] hover:text-[#222222]"
                aria-label="Close modal"
              >
                <HiXMark className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {isSubmitted ? (
                <div className="flex flex-col items-center gap-4 py-8 text-center">
                  <HiCheckCircle className="h-16 w-16 text-green-500" />
                  <h3 className="text-xl font-bold text-[#222222]">Inquiry Sent!</h3>
                  <p className="text-sm text-[#717171]">
                    Your booking request for <strong>{stay.name}</strong> has been sent.
                    The host will respond within 24 hours.
                  </p>
                  <Button onClick={handleClose} className="mt-4">
                    Done
                  </Button>
                </div>
              ) : (
                <>
                  {step === "dates-guests" && (
                    <div className="flex flex-col gap-6">
                      <div>
                        <h3 className="mb-1 text-lg font-bold text-[#222222]">{stay.name}</h3>
                        <p className="text-sm text-[#717171]">{stay.location}</p>
                      </div>
                      <div className="flex flex-col gap-4">
                        <div>
                          <label className="mb-1 block text-sm font-medium text-[#222222]">Check-in</label>
                          <input
                            type="date"
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            className="w-full rounded-lg border border-[#DDDDDD] px-4 py-2.5 text-sm text-[#222222] focus:border-[#222222] focus:outline-none focus:ring-1 focus:ring-[#222222]"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-[#222222]">Check-out</label>
                          <input
                            type="date"
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                            min={checkIn || undefined}
                            className="w-full rounded-lg border border-[#DDDDDD] px-4 py-2.5 text-sm text-[#222222] focus:border-[#222222] focus:outline-none focus:ring-1 focus:ring-[#222222]"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-[#222222]">Guests</label>
                          <QuantityStepper value={guests} onChange={setGuests} min={1} max={stay.maxGuests} />
                        </div>
                      </div>
                    </div>
                  )}

                  {step === "contact" && (
                    <div className="flex flex-col gap-4">
                      <h3 className="text-lg font-bold text-[#222222]">Contact Details</h3>
                      <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
                      <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" />
                      <Input label="Phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+61 4XX XXX XXX" />
                    </div>
                  )}

                  {step === "review" && (
                    <div className="flex flex-col gap-6">
                      <h3 className="text-lg font-bold text-[#222222]">Review your booking</h3>
                      <div className="space-y-3 rounded-xl bg-[#F7F7F7] p-4">
                        <div className="flex items-center gap-3">
                          <Image
                            src={stay.images[0] || "/placeholder.svg"}
                            alt={stay.name}
                            width={56}
                            height={56}
                            className="h-14 w-14 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-semibold text-[#222222]">{stay.name}</p>
                            <p className="text-sm text-[#717171]">{stay.location}</p>
                          </div>
                        </div>
                        <hr className="border-[#DDDDDD]" />
                        <div className="space-y-1.5 text-sm">
                          {checkIn && checkOut && (
                            <div className="flex justify-between">
                              <span className="text-[#717171]">Dates</span>
                              <span className="font-medium text-[#222222]">{formatDateRange(checkIn, checkOut)}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-[#717171]">Guests</span>
                            <span className="font-medium text-[#222222]">{guests}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#717171]">Nights</span>
                            <span className="font-medium text-[#222222]">{nights}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#717171]">Rate</span>
                            <span className="font-medium text-[#222222]">{formatCurrency(stay.pricePerNight)} / night</span>
                          </div>
                          <hr className="border-[#DDDDDD]" />
                          <div className="flex justify-between text-base">
                            <span className="font-semibold text-[#222222]">Total</span>
                            <span className="font-bold text-[#222222]">{formatCurrency(subtotal)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between">
                          <span className="text-[#717171]">Contact</span>
                          <span className="font-medium text-[#222222]">{name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#717171]">Email</span>
                          <span className="font-medium text-[#222222]">{email}</span>
                        </div>
                        {phone && (
                          <div className="flex justify-between">
                            <span className="text-[#717171]">Phone</span>
                            <span className="font-medium text-[#222222]">{phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {!isSubmitted && (
              <div className="flex items-center justify-between gap-3 border-t border-[#DDDDDD] px-6 py-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (step === "dates-guests") handleClose();
                    else setStep(steps[currentStepIndex - 1].key);
                  }}
                >
                  {step === "dates-guests" ? "Cancel" : "Back"}
                </Button>
                <Button
                  onClick={() => {
                    if (step === "review") handleSubmit();
                    else setStep(steps[currentStepIndex + 1].key);
                  }}
                  disabled={
                    (step === "dates-guests" && (!checkIn || !checkOut)) ||
                    (step === "contact" && (!name || !email))
                  }
                >
                  {step === "review" ? "Send Inquiry" : "Continue"}
                </Button>
              </div>
            )}
          </div>
        </Content>
      </Portal>
    </Root>
  );
}
