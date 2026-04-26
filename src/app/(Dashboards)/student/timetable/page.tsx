"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, User, Utensils, Monitor } from "lucide-react"
import { cn } from "@/lib/utils"

const weekDays = [
  { short: "MON", full: "Monday", date: 12 },
  { short: "TUE", full: "Tuesday", date: 13 },
  { short: "WED", full: "Wednesday", date: 14 },
  { short: "THU", full: "Thursday", date: 15 },
  { short: "FRI", full: "Friday", date: 16 },
]

const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]

// Desktop schedule with grid positioning
const desktopSchedule = [
  {
    id: 1,
    day: "MON",
    startHour: 9,
    duration: 2, // hours
    course: "Algorithms",
    code: "CSCI 301",
    type: "CORE",
    room: "Lab 402",
    instructor: "Dr. Smith",
    color: "bg-primary",
  },
  {
    id: 2,
    day: "MON",
    startHour: 14,
    duration: 2,
    course: "Tech Ethics",
    code: "",
    type: "",
    room: "Hall B",
    instructor: "",
    color: "bg-primary",
  },
  {
    id: 3,
    day: "TUE",
    startHour: 10,
    duration: 2.5,
    course: "Data Structures",
    code: "CSCI 302",
    type: "",
    room: "Room 101",
    instructor: "Dr. Lee",
    color: "bg-primary",
  },
  {
    id: 4,
    day: "TUE",
    startHour: 13,
    duration: 1.5,
    course: "Database Systems",
    code: "",
    type: "",
    room: "Lab 305",
    instructor: "",
    color: "bg-primary",
  },
  {
    id: 5,
    day: "WED",
    startHour: 9,
    duration: 2,
    course: "Machine Learning",
    code: "",
    type: "",
    room: "Room 204",
    instructor: "",
    color: "bg-accent",
  },
  {
    id: 6,
    day: "WED",
    startHour: 15,
    duration: 2,
    course: "Software Eng",
    code: "",
    type: "",
    room: "Lab 402",
    instructor: "Dr. Smith",
    color: "bg-accent",
  },
  {
    id: 7,
    day: "THU",
    startHour: 10,
    duration: 2.5,
    course: "Web Dev",
    code: "",
    type: "",
    room: "Lab 110",
    instructor: "Mr. Wilson",
    color: "bg-accent",
  },
  {
    id: 8,
    day: "THU",
    startHour: 14,
    duration: 2,
    course: "HCI",
    code: "",
    type: "",
    room: "Room 302",
    instructor: "Dr. Adams",
    color: "bg-primary",
  },
  {
    id: 9,
    day: "FRI",
    startHour: 11,
    duration: 2,
    course: "Algorithms Seminar",
    code: "",
    type: "REQ",
    room: "Room 105",
    instructor: "",
    color: "bg-accent",
  },
]

// Mobile schedule
const mobileSchedule = [
  {
    id: 1,
    day: "TUE",
    time: "09:00",
    endTime: "10:30",
    course: "Data Structures & Algorithms",
    type: "Core",
    room: "Lab 402, CS Building",
    instructor: "Dr. Emily Smith",
    dotColor: "bg-primary",
  },
  {
    id: 2,
    day: "TUE",
    time: "11:00",
    endTime: "12:30",
    course: "Database Management Systems",
    type: "Lec",
    room: "Room 301, Main Hall",
    instructor: "Prof. Alan Johnson",
    dotColor: "bg-primary",
  },
  {
    id: 3,
    day: "TUE",
    time: "12:30",
    endTime: "14:00",
    course: "Lunch Break",
    type: "break",
    room: "",
    instructor: "",
    dotColor: "bg-muted-foreground/30",
  },
  {
    id: 4,
    day: "TUE",
    time: "14:00",
    endTime: "15:30",
    course: "Modern Web Development",
    type: "Elective",
    room: "Online (Zoom)",
    instructor: "Sarah Davis, MSc",
    dotColor: "bg-accent",
    isOnline: true,
  },
  {
    id: 5,
    day: "MON",
    time: "09:00",
    endTime: "10:30",
    course: "Advanced Artificial Intelligence",
    type: "Core",
    room: "Hall A",
    instructor: "Dr. James Wilson",
    dotColor: "bg-primary",
  },
]

export default function TimetablePage() {
  const [selectedDay, setSelectedDay] = useState("TUE")

  const daySchedule = mobileSchedule.filter((s) => s.day === selectedDay)

  // Calculate position for desktop grid
  const getClassStyle = (startHour: number, duration: number) => {
    const topOffset = (startHour - 8) * 60 // 60px per hour starting from 8:00
    const height = duration * 60
    return {
      top: `${topOffset}px`,
      height: `${height}px`,
    }
  }

  return (
    <div className="space-y-6">
      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-foreground">My Timetable</h1>
          <p className="mt-2 text-muted-foreground">Standard Academic Schedule</p>
        </div>

        {/* Calendar Grid */}
        <div className="overflow-hidden rounded-lg border bg-card">
          {/* Header Row */}
          <div className="grid grid-cols-[60px_repeat(5,1fr)] border-b bg-muted/30">
            <div className="p-3" />
            {weekDays.map((day) => (
              <div key={day.short} className="border-l p-3 text-center">
                <span className="font-medium text-foreground">{day.full}</span>
              </div>
            ))}
          </div>

          {/* Time Grid */}
          <div className="relative grid grid-cols-[60px_repeat(5,1fr)]">
            {/* Time Labels */}
            <div className="relative">
              {timeSlots.map((time, index) => (
                <div
                  key={time}
                  className="flex h-[60px] items-start justify-end border-b pr-3 pt-0 text-sm text-muted-foreground"
                  style={{ height: "60px" }}
                >
                  {time}
                </div>
              ))}
            </div>

            {/* Day Columns */}
            {weekDays.map((day, dayIndex) => (
              <div key={day.short} className="relative border-l" style={{ height: `${timeSlots.length * 60}px` }}>
                {/* Hour lines */}
                {timeSlots.map((_, index) => (
                  <div
                    key={index}
                    className="absolute left-0 right-0 border-b"
                    style={{ top: `${index * 60}px`, height: "60px" }}
                  />
                ))}

                {/* Lunch break line at 13:00 */}
                <div
                  className="absolute left-0 right-0 border-t-2 border-dashed border-muted-foreground/30"
                  style={{ top: `${5 * 60}px` }}
                />

                {/* Class blocks */}
                {desktopSchedule
                  .filter((cls) => cls.day === day.short)
                  .map((cls) => {
                    const style = getClassStyle(cls.startHour, cls.duration)
                    return (
                      <div
                        key={cls.id}
                        className={cn(
                          "absolute left-1 right-1 overflow-hidden rounded-lg p-2 text-white",
                          cls.color
                        )}
                        style={style}
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-sm font-semibold">{cls.course}</span>
                          {cls.type && (
                            <Badge variant="secondary" className="ml-1 shrink-0 bg-white/20 text-[10px] text-white">
                              {cls.type}
                            </Badge>
                          )}
                        </div>
                        {cls.code && (
                          <p className="text-xs text-white/80">{cls.code}</p>
                        )}
                        <div className="mt-auto pt-2">
                          {cls.room && (
                            <div className="flex items-center gap-1 text-xs text-white/90">
                              <MapPin className="h-3 w-3" />
                              {cls.room}
                            </div>
                          )}
                          {cls.instructor && (
                            <div className="flex items-center gap-1 text-xs text-white/90">
                              <User className="h-3 w-3" />
                              {cls.instructor}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <h1 className="mb-4 text-2xl font-bold text-foreground">Daily Schedule</h1>

        {/* Day Selector */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {weekDays.map((day) => (
            <button
              key={day.short}
              onClick={() => setSelectedDay(day.short)}
              className={cn(
                "flex min-w-[60px] flex-col items-center rounded-xl px-4 py-3 transition-colors",
                selectedDay === day.short
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              <span className="text-xs font-medium">{day.short}</span>
              <span className="text-lg font-bold">{day.date}</span>
            </button>
          ))}
        </div>

        {/* Timeline View */}
        <div className="space-y-4">
          {daySchedule.map((item) => (
            <div key={item.id} className="flex gap-4">
              {/* Time & Dot */}
              <div className="flex flex-col items-center">
                <span className="text-sm font-medium text-muted-foreground">{item.time}</span>
                <div className={cn("mt-2 h-3 w-3 rounded-full", item.dotColor)} />
                {item.type !== "break" && (
                  <div className="mt-1 h-full w-0.5 bg-border" />
                )}
              </div>

              {/* Card */}
              {item.type === "break" ? (
                <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-muted-foreground/30 py-4">
                  <Utensils className="mr-2 h-4 w-4 text-muted-foreground/50" />
                  <span className="text-muted-foreground/50">{item.course}</span>
                </div>
              ) : (
                <Card className={cn(
                  "flex-1 border-l-4",
                  item.type === "Elective" ? "border-l-accent" : "border-l-primary"
                )}>
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-start justify-between">
                      <h3 className="font-semibold text-foreground">{item.course}</h3>
                      <Badge
                        variant="outline"
                        className={cn(
                          "ml-2 shrink-0",
                          item.type === "Elective" && "border-accent text-accent",
                          item.type === "Core" && "border-destructive text-destructive",
                          item.type === "Lec" && "border-primary text-primary"
                        )}
                      >
                        {item.type}
                      </Badge>
                    </div>
                    <div className="space-y-1.5 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{item.time} - {item.endTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.isOnline ? (
                          <Monitor className="h-4 w-4" />
                        ) : (
                          <MapPin className="h-4 w-4" />
                        )}
                        <span>{item.room}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{item.instructor}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
