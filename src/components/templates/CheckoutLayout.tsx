import { cn } from "@/src/lib/utils";
import { HiCheck } from "react-icons/hi2";

interface CheckoutLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  steps: string[];
  className?: string;
}

export function CheckoutLayout({ children, currentStep, steps, className }: CheckoutLayoutProps) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-center gap-0">
          {steps.map((step, i) => {
            const isCompleted = i < currentStep;
            const isActive = i === currentStep;
            const isUpcoming = i > currentStep;

            return (
              <div key={step} className="flex items-center">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-colors",
                      isCompleted && "bg-[#222222] text-white",
                      isActive && "border-2 border-[#222222] bg-white text-[#222222]",
                      isUpcoming && "border-2 border-[#DDDDDD] bg-white text-[#DDDDDD]"
                    )}
                  >
                    {isCompleted ? (
                      <HiCheck className="h-5 w-5" />
                    ) : (
                      <span>{i + 1}</span>
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium",
                      isActive && "text-[#222222]",
                      isCompleted && "text-[#222222]",
                      isUpcoming && "text-[#DDDDDD]"
                    )}
                  >
                    {step}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={cn(
                      "mx-2 h-px w-16 sm:w-24",
                      i < currentStep ? "bg-[#222222]" : "bg-[#DDDDDD]"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className={cn(className)}>{children}</div>
    </div>
  );
}
