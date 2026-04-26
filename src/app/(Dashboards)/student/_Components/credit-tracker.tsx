import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface CreditTrackerProps {
  current: number
  total: number
}

export function CreditTracker({ current, total }: CreditTrackerProps) {
  const percentage = (current / total) * 100

  return (
    <Card className="w-64">
      <CardContent className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">CREDIT TRACKER</span>
          <div className="text-right">
            <span className="text-2xl font-bold text-primary">{current}</span>
            <span className="text-muted-foreground">/{total}</span>
          </div>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div 
            className="h-full rounded-full bg-primary transition-all" 
            style={{ width: `${percentage}%` }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
