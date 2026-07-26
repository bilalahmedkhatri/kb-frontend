"use client";

import Link from "next/link";
import Image from "next/image";
import { Root, Portal, Overlay, Content } from "@radix-ui/react-dialog";
import { HiXMark, HiShoppingCart, HiArrowRight } from "react-icons/hi2";
import { formatCurrency } from "@/src/lib/utils";
import { Button } from "@/src/components/atoms/Button";
import { QuantityStepper } from "@/src/components/molecules/QuantityStepper";
import { useCartStore } from "@/src/store/cartStore";
import { useUIStore } from "@/src/store/uiStore";

export function CartDrawer() {
  const { isCartOpen, closeCart } = useUIStore();
  const { items, removeItem, updateQuantity, subtotal, itemCount } = useCartStore();

  return (
    <Root open={isCartOpen} onOpenChange={(open) => { if (!open) closeCart(); }}>
      <Portal>
        <Overlay className="fixed inset-0 z-40 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out" />
        <Content className="fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-white shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out sm:max-w-md">
          <div className="flex items-center justify-between border-b border-[#DDDDDD] px-6 py-4">
            <div className="flex items-center gap-2">
              <HiShoppingCart className="h-5 w-5 text-[#222222]" />
              <span className="text-lg font-bold text-[#222222]">Cart</span>
              {itemCount() > 0 && (
                <span className="text-sm text-[#717171]">({itemCount()})</span>
              )}
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#717171] transition-colors hover:bg-[#F7F7F7] hover:text-[#222222]"
              aria-label="Close cart"
            >
              <HiXMark className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <HiShoppingCart className="mb-3 h-16 w-16 text-[#DDDDDD]" />
                <p className="text-base font-medium text-[#717171]">Your cart is empty</p>
                <p className="mt-1 text-sm text-[#717171]">Add some items to get started.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 rounded-xl border border-[#DDDDDD] p-3">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-[#F7F7F7]">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[#222222]">{item.name}</p>
                          {item.vendorName && (
                            <p className="text-xs text-[#717171]">{item.vendorName}</p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[#717171] transition-colors hover:bg-[#F7F7F7] hover:text-[#222222]"
                          aria-label={`Remove ${item.name}`}
                        >
                          <HiXMark className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <QuantityStepper
                          value={item.quantity}
                          onChange={(q) => updateQuantity(item.id, q)}
                          min={1}
                        />
                        <span className="text-sm font-semibold text-[#222222]">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-[#DDDDDD] px-6 py-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-base font-semibold text-[#222222]">Subtotal</span>
                <span className="text-lg font-bold text-[#222222]">{formatCurrency(subtotal())}</span>
              </div>
              <Link href="/checkout" onClick={closeCart}>
                <Button className="w-full" leftIcon={<HiArrowRight className="h-4 w-4" />}>
                  Checkout
                </Button>
              </Link>
            </div>
          )}
        </Content>
      </Portal>
    </Root>
  );
}
