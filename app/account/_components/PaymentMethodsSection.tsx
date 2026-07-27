"use client";

import { useState } from "react";
import { Button } from "@/src/components/atoms/Button";
import { Input } from "@/src/components/atoms/Input";
import { Badge } from "@/src/components/atoms/Badge";
import { HiCreditCard, HiPlus } from "react-icons/hi2";
import { Toast, ToastData } from "./AccountToast";

interface SavedCard {
  id: string;
  brand: string;
  last4: string;
  expiry: string;
  isDefault: boolean;
}

const MOCK_CARDS: SavedCard[] = [
  { id: "card-1", brand: "Visa", last4: "4242", expiry: "12/28", isDefault: true },
  { id: "card-2", brand: "Mastercard", last4: "8888", expiry: "06/27", isDefault: false },
];

export function PaymentMethodsSection() {
  const [cards, setCards] = useState<SavedCard[]>(MOCK_CARDS);
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardName, setCardName] = useState("");

  const [addingCard, setAddingCard] = useState(false);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSetDefaultCard = async (id: string) => {
    setSettingDefaultId(id);
    // Simulate backend response delay
    await new Promise((r) => setTimeout(r, 700));
    setCards((prev) => prev.map((c) => ({ ...c, isDefault: c.id === id })));
    setSettingDefaultId(null);
    showToast("Default payment method updated");
  };

  const handleAddCard = async () => {
    if (!cardNumber || !expiry || !cvc || !cardName) {
      showToast("All card details are required", "error");
      return;
    }
    setAddingCard(true);
    // Simulate backend response delay
    await new Promise((r) => setTimeout(r, 950));
    const newCard: SavedCard = {
      id: `card-${Date.now()}`,
      brand: cardNumber.startsWith("4") ? "Visa" : "Mastercard",
      last4: cardNumber.slice(-4) || "9999",
      expiry,
      isDefault: cards.length === 0,
    };
    setCards((prev) => [...prev, newCard]);
    setAddingCard(false);
    setShowCardForm(false);
    setCardNumber("");
    setExpiry("");
    setCvc("");
    setCardName("");
    showToast("New card added successfully");
  };

  return (
    <section>
      <h2 className="mb-4 text-lg font-bold text-[#222222]">Saved Payment Methods</h2>
      <div className="flex flex-col gap-4 rounded-xl border border-[#DDDDDD] p-6 bg-white">
        {cards.map((card) => (
          <div key={card.id} className="flex items-center justify-between rounded-lg bg-[#F7F7F7] px-4 py-3">
            <div className="flex items-center gap-3">
              <HiCreditCard className="h-5 w-5 text-[#717171]" />
              <div>
                <p className="text-sm font-medium text-[#222222]">{card.brand} &bull;&bull;&bull;&bull; {card.last4}</p>
                <p className="text-xs text-[#717171]">Expires {card.expiry}</p>
              </div>
              {card.isDefault && <Badge variant="primary" className="ml-2">Default</Badge>}
            </div>
            {!card.isDefault && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs font-medium text-[#FF385C] hover:underline hover:bg-transparent"
                onClick={() => handleSetDefaultCard(card.id)}
                isLoading={settingDefaultId === card.id}
              >
                Set as Default
              </Button>
            )}
          </div>
        ))}
        <div>
          {showCardForm ? (
            <div className="mb-4 rounded-lg border border-[#DDDDDD] p-4 bg-white">
              <div className="mb-3 grid gap-3 md:grid-cols-2">
                <Input
                  label="Card Number"
                  placeholder="1234 5678 9012 3456"
                  className="md:col-span-2"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  disabled={addingCard}
                />
                <Input
                  label="Expiry Date"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  disabled={addingCard}
                />
                <Input
                  label="CVC"
                  placeholder="123"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  disabled={addingCard}
                />
                <Input
                  label="Cardholder Name"
                  placeholder="John Smith"
                  className="md:col-span-2"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  disabled={addingCard}
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddCard} isLoading={addingCard}>
                  {addingCard ? "Adding Card..." : "Add Card"}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowCardForm(false)} disabled={addingCard}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" size="sm" leftIcon={<HiPlus className="h-4 w-4" />} onClick={() => setShowCardForm(true)}>
              Add Payment Method
            </Button>
          )}
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </section>
  );
}
