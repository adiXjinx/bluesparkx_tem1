type ErrorComponentProps = {
  message: string
  icon?: string
  className?: string
}

export function ErrorComponent({ message, icon = "⚠️", className = "" }: ErrorComponentProps) {
  return (
    <div
      className={`flex items-center gap-2 rounded bg-red-100 p-2 text-sm text-red-600 ${className}`}
    >
      <span>{icon}</span>
      <span>{message}</span>
    </div>
  )
}
