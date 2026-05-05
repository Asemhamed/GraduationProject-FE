"use client"

import { GetTimetable } from "@/ServerActions/Timetable/GetTimetable"
import { Course } from "@/Types/CourseTypes"
import { StudentRecord } from "@/Types/StudentTypes"
import { TimetableResponse } from "@/Types/TimetableTypes"
import {
    BookOpen,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Clock,
    GraduationCap,
    Layers,
    LayoutGrid,
    Loader2,
    MapPin,
    RefreshCw,
    Search,
    User
} from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "react-toastify"

interface StudentTimetableLayoutProps {
    initialTimetable: TimetableResponse
    student: StudentRecord
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const HOURS = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"]

const COURSE_COLORS = [
    { bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-700", dot: "bg-violet-400", accent: "text-violet-500" },
    { bg: "bg-sky-50", border: "border-sky-200", text: "text-sky-700", dot: "bg-sky-400", accent: "text-sky-500" },
    { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-400", accent: "text-emerald-500" },
    { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", dot: "bg-amber-400", accent: "text-amber-500" },
    { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700", dot: "bg-rose-400", accent: "text-rose-500" },
    { bg: "bg-fuchsia-50", border: "border-fuchsia-200", text: "text-fuchsia-700", dot: "bg-fuchsia-400", accent: "text-fuchsia-500" },
    { bg: "bg-teal-50", border: "border-teal-200", text: "text-teal-700", dot: "bg-teal-400", accent: "text-teal-500" },
    { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", dot: "bg-orange-400", accent: "text-orange-500" },
]

export default function StudentTimetableLayout({ initialTimetable, student }: StudentTimetableLayoutProps) {
    const [timetable, setTimetable] = useState<TimetableResponse>(initialTimetable)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [activeDayMobile, setActiveDayMobile] = useState(0)

    // Collect all course IDs this student is enrolled in by matching student_id across courses
    const studentCourseIds = useMemo(() => {
        const ids = new Set<number>()
        timetable.forEach(item => {
            const course: Course = item.course
            const isEnrolled = course.students.some(s => s.student_id === student.student_id)
            if (isEnrolled) ids.add(course.course_id)
        })
        return ids
    }, [timetable, student.student_id])

    // Build a color map per course_id for consistent coloring
    const courseColorMap = useMemo(() => {
        const map = new Map<number, typeof COURSE_COLORS[0]>()
        let i = 0
        timetable.forEach(item => {
            const { course_id } = item.course
            if (studentCourseIds.has(course_id) && !map.has(course_id)) {
                map.set(course_id, COURSE_COLORS[i % COURSE_COLORS.length])
                i++
            }
        })
        return map
    }, [timetable, studentCourseIds])

    // Filter timetable to only student's courses
    const studentTimetable = useMemo(() => {
        return timetable.filter(item => studentCourseIds.has(item.course.course_id))
    }, [timetable, studentCourseIds])

    const handleRefresh = async () => {
        setIsRefreshing(true)
        try {
            const fresh = await GetTimetable()
            setTimetable(fresh)
            toast.success("Schedule updated")
        } catch {
            toast.error("Failed to refresh schedule")
        } finally {
            setIsRefreshing(false)
        }
    }

    const getEntryAt = (dayIdx: number, hourIdx: number) => {
        const timeslotId = dayIdx * 9 + hourIdx
        const entry = studentTimetable.find(item => item.timeslot_id === timeslotId)
        if (!entry) return { entry: null, isMatch: true, id: timeslotId, color: null }

        const color = courseColorMap.get(entry.course.course_id) ?? COURSE_COLORS[0]

        const isMatch =
            searchQuery === "" ||
            entry.course.course_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.room.room_id.toString().includes(searchQuery)

        return { entry, isMatch, id: timeslotId, color }
    }

    const enrolledCount = courseColorMap.size
    const totalSlots = studentTimetable.length

    // Derive semester badge label
    const semesterLabel = student.semester

    return (
        <div className="w-full max-w-[1600px] mx-auto p-3 md:p-6 space-y-5 font-[family-name:var(--font-geist-sans,_'Geist',_sans-serif)]">

            {/* ── STUDENT PROFILE BANNER ── */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-r from-indigo-600 to-violet-800 p-5 md:p-6 shadow-xl">
                <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-8 left-20 h-32 w-32 rounded-full bg-violet-500/10 blur-2xl" />

                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="relative flex h-12 w-12 md:h-14 md:w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-500 shadow-lg shadow-indigo-900/40 text-white font-black text-lg md:text-xl select-none">
                            {(student.full_name ?? "S").charAt(0).toUpperCase()}
                        </div>

                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-300 mb-0.5">Student Schedule</p>
                            <h1 className="text-base md:text-xl font-extrabold text-white leading-tight">
                                {student.full_name?.toUpperCase() ?? "Unknown Student"}
                            </h1>
                            <div className="mt-1 flex flex-wrap items-center gap-2">
                                {student.student_id && (
                                    <span className="flex items-center gap-1 rounded-md bg-white/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-300">
                                        ID-{student.student_id}
                                    </span>
                                )}
                                {student.semester && (
                                    <span className="flex items-center gap-1 rounded-md bg-white/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-300">
                                        <GraduationCap className="h-2.5 w-2.5" /> {semesterLabel}
                                    </span>
                                )}
                                {student.user_id && (
                                    <span className="flex items-center gap-1 rounded-md bg-indigo-500/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-indigo-300">
                                        <Layers className="h-2.5 w-2.5" /> UID {student.user_id}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stats pills */}
                    <div className="flex gap-3 shrink-0">
                        <div className="flex flex-col items-center rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 px-4 py-2.5 backdrop-blur-sm">
                            <span className="text-xl font-black text-white">{enrolledCount}</span>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-white">Courses</span>
                        </div>
                       
                    </div>
                </div>
            </div>

            {/* ── CONTROLS ── */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-600 shadow-md shadow-indigo-200">
                        <LayoutGrid className="h-4 w-4 text-white" />
                    </div>
                    <h2 className="text-sm font-extrabold tracking-tight text-slate-800">Weekly Timetable</h2>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-500">
                        7-day cycle
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative flex-1 sm:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search course or room…"
                            className="w-full sm:w-56 pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white shadow-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 shadow-sm transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isRefreshing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                        Sync
                    </button>
                </div>
            </div>


            {/* ── MOBILE DAY TABS ── */}
            <div className="flex lg:hidden overflow-x-auto pb-1 gap-2 no-scrollbar">
                {DAYS_SHORT.map((day, idx) => (
                    <button
                        key={day}
                        onClick={() => setActiveDayMobile(idx)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                            activeDayMobile === idx
                                ? "bg-indigo-600 text-white shadow-md"
                                : "bg-slate-50 text-slate-500 border border-slate-100"
                        }`}
                    >
                        {day}
                    </button>
                ))}
            </div>

            {/* ── TIMETABLE ── */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

                {/* DESKTOP */}
                <div className="hidden lg:block w-full overflow-x-auto">
                    <table className="w-full border-collapse table-fixed min-w-[900px]">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-100">
                                <th className="p-2 border-r border-slate-100 text-[9px] font-bold uppercase tracking-widest text-slate-400 w-24">
                                    Day / Time
                                </th>
                                {HOURS.map(hour => (
                                    <th key={hour} className="p-2 border-r border-slate-50 last:border-r-0 text-[9px] font-bold uppercase text-slate-700">
                                        <div className="flex flex-col items-center gap-0.5">
                                            <Clock className="h-3 w-3 text-indigo-400" />
                                            {hour}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {DAYS.map((day, dayIdx) => (
                                <tr key={day} className="group hover:bg-slate-50/40 transition-colors">
                                    <td className="p-2 border-r border-slate-100 bg-white group-hover:bg-slate-50/80 transition-colors">
                                        <span className="text-[10px] font-extrabold text-slate-800 block leading-tight">{day}</span>
                                    </td>
                                    {HOURS.map((_, hourIdx) => {
                                        const { entry, isMatch, id, color } = getEntryAt(dayIdx, hourIdx)
                                        return (
                                            <td
                                                key={id}
                                                className={`p-1 border-r border-slate-50 last:border-r-0 h-28 transition-opacity duration-300 ${
                                                    isMatch ? "opacity-100" : "opacity-10 grayscale"
                                                }`}
                                            >
                                                {entry && color ? (
                                                    <div className={`h-full rounded-xl p-2 border ${color.border} ${color.bg} flex flex-col justify-between overflow-hidden`}>
                                                        <div>
                                                            <div className={`h-0.5 w-8 rounded-full mb-1.5`} />
                                                            <h3 className={`text-[9px] font-black leading-tight line-clamp-2 uppercase ${color.text}`}>
                                                                {entry.course.course_name}
                                                            </h3>
                                                        </div>
                                                        <div className="space-y-0.5 pt-1 border-t border-slate-100 mt-1">
                                                            <div className="flex items-center gap-1 text-[7px] font-semibold text-slate-500 truncate">
                                                                <User className="h-2 w-2 shrink-0" />
                                                                {entry.course.instructors?.[0]?.name ?? "Staff"}
                                                            </div>
                                                            <div className={`flex items-center gap-0.5 text-[7px] font-bold ${color.accent}`}>
                                                                <MapPin className="h-2 w-2 shrink-0" />
                                                                Room {entry.room.room_id}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="h-full rounded-xl border border-dashed border-slate-100 flex items-center justify-center">
                                                        <span className="text-[7px] font-mono text-slate-200">—</span>
                                                    </div>
                                                )}
                                            </td>
                                        )
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* MOBILE */}
                <div className="lg:hidden">
                    <div className="flex items-center justify-between bg-indigo-50/60 border-b border-indigo-100 px-4 py-3">
                        <button
                            onClick={() => setActiveDayMobile(d => Math.max(0, d - 1))}
                            disabled={activeDayMobile === 0}
                            className="p-1 rounded-lg disabled:opacity-30 active:bg-indigo-100 transition-colors"
                        >
                            <ChevronLeft className="h-4 w-4 text-indigo-600" />
                        </button>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                            <h2 className="text-xs font-black text-indigo-800 uppercase tracking-wider">{DAYS[activeDayMobile]}</h2>
                        </div>
                        <button
                            onClick={() => setActiveDayMobile(d => Math.min(DAYS.length - 1, d + 1))}
                            disabled={activeDayMobile === DAYS.length - 1}
                            className="p-1 rounded-lg disabled:opacity-30 active:bg-indigo-100 transition-colors"
                        >
                            <ChevronRight className="h-4 w-4 text-indigo-600" />
                        </button>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {HOURS.map((hour, hourIdx) => {
                            const { entry, isMatch, id, color } = getEntryAt(activeDayMobile, hourIdx)
                            if (!isMatch && searchQuery !== "") return null

                            return (
                                <div key={id} className="flex items-start gap-3 px-4 py-3">
                                    <div className="w-16 shrink-0 pt-1 text-right">
                                        <span className="text-[10px] font-black text-slate-900 whitespace-nowrap">{hour}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        {entry && color ? (
                                            <div className={`rounded-xl border ${color.border} ${color.bg} p-3`}>
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <h3 className={`text-xs font-black leading-tight uppercase ${color.text}`}>
                                                        {entry.course.course_name}
                                                    </h3>
                                                    <span className={`text-[8px] font-bold ${color.accent} shrink-0`}>
                                                        #{entry.course.course_id}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between pt-2 border-t border-white/60">
                                                    <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 truncate">
                                                        <User className="h-3 w-3 shrink-0 text-slate-400" />
                                                        <span className="truncate">{entry.course.instructors?.[0]?.name ?? "Staff"}</span>
                                                    </div>
                                                    <div className={`flex items-center gap-1 text-[10px] font-bold ${color.accent}`}>
                                                        <MapPin className="h-3 w-3 shrink-0" />
                                                        R-{entry.room.room_id}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="h-9 rounded-xl border border-dashed border-slate-100 bg-slate-50/30 flex items-center justify-center">
                                                <span className="text-[9px] font-bold text-slate-200 uppercase">Free</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* ── FOOTER ── */}
            <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
                <BookOpen className="h-3 w-3 text-indigo-400" />
                <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                    Showing {enrolledCount} enrolled course{enrolledCount !== 1 ? "s" : ""} · {totalSlots} scheduled session{totalSlots !== 1 ? "s" : ""}
                </p>
            </div>
        </div>
    )
}