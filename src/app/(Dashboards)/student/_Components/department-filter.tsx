"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DepartmentFilterProps {
  departments: string[]
  selected: string
  onSelect: (department: string) => void
}

export function DepartmentFilter({ departments, selected, onSelect }: DepartmentFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {departments.map((dept) => (
        <Button
          key={dept}
          onClick={() => onSelect(dept)}
          variant={selected === dept ? "default" : "outline"}
          className={cn(
            "rounded-full px-6",
            selected !== dept && "text-muted-foreground hover:text-foreground"
          )}
        >
          {dept}
        </Button>
      ))}
    </div>
  )
}
