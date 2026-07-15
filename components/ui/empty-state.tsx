import { GradientButton } from "./gradient-button"

interface EmptyStateProps {
  icon: string
  title: string
  description: string
  action?: { label: string; onClick: () => void }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-3xl mb-4">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-white/80 mb-2">{title}</h3>
      <p className="text-sm text-white/35 max-w-xs leading-relaxed mb-6">{description}</p>
      {action && (
        <GradientButton onClick={action.onClick} size="sm">{action.label}</GradientButton>
      )}
    </div>
  )
}