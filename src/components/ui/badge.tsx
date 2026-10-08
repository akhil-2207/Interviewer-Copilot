import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold leading-none",
  {
    variants: {
      variant: {
        neutral: "bg-subtle text-secondary",
        success: "bg-brand-soft text-[#397C25]",
        warning: "bg-warning-soft text-[#A05205]",
        info: "bg-info-soft text-info",
        outline: "border border-line bg-white text-secondary",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
)

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
