"use client"

import {
    BookOpen,
    CalendarDays,
    ChevronDown,
    ChevronUp,
    Clock,
    DoorOpen,
    Loader2,
    RefreshCw,
    Search,
    Sparkles,
    User,
    Users
} from "lucide-react"
import { useState } from "react"
import { toast } from "react-toastify"

// Server Actions
import { GetTimetable } from "@/ServerActions/Timetable/GetTimetable"
import { TriggerGeneration } from "@/ServerActions/Timetable/TriggerGeneration"

// Types
import { TimetableResponse } from "@/Types/TimetableTypes"

interface TimetableLayoutProps {
    initialTimetable: TimetableResponse
}

const SEMESTER_COLORS: Record<string, string> = {
    Fall:   "bg-orange-50 text-orange-600",
    Spring: "bg-emerald-50 text-emerald-600",
    Summer: "bg-sky-50 text-sky-600",
}

const STATUS_COLORS: Record<string, string> = {
    pending:    "bg-yellow-50 text-yellow-600 border-yellow-200",
    processing: "bg-blue-50 text-blue-600 border-blue-200",
    completed:  "bg-emerald-50 text-emerald-600 border-emerald-200",
    failed:     "bg-red-50 text-red-600 border-red-200",
}

export default function TimetableLayout({ initialTimetable }: TimetableLayoutProps) {
    const [timetable, setTimetable] = useState<TimetableResponse>(initialTimetable)
    const [isGenerating, setIsGenerating] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [expandedRow, setExpandedRow] = useState<number | null>(null)
    const [jobStatus, setJobStatus] = useState<{ message: string; job_id: string; status: string } | null>(null)

    const filtered = timetable.filter(entry =>
        entry.course.course_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.timeslot_id.toString().includes(searchQuery) ||
        entry.room.room_id.toString().includes(searchQuery) ||
        entry.course.instructors.some(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    const handleGenerate = async () => {
        setIsGenerating(true)
        setJobStatus(null)
        try {
            const result = await TriggerGeneration()
            setJobStatus(result)
            toast.success(result.message)
        } catch {
            toast.error("Failed to trigger timetable generation")
        } finally {
            setIsGenerating(false)
        }
    }

    const handleRefresh = async () => {
        setIsRefreshing(true)
        try {
            const fresh = await GetTimetable()
            setTimetable(fresh)
            toast.success("Timetable refreshed")
        } catch {
            toast.error("Failed to refresh timetable")
        } finally {
            setIsRefreshing(false)
        }
    }

    const toggleExpand = (id: number) => {
        setExpandedRow(prev => prev === id ? null : id)
    }

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-8">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 md:h-14 md:w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 shadow-xl shadow-indigo-100">
                        <CalendarDays className="h-6 w-6 md:h-7 md:w-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
                            Timetable
                        </h1>
                        <p className="text-xs md:text-base text-slate-500 font-medium">
                            View and generate course scheduling
                        </p>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50 shadow-sm"
                    >
                        <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                        Refresh
                    </button>
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-3 text-sm font-bold text-white shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
                    >
                        {isGenerating
                            ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</>
                            : <><Sparkles className="h-4 w-4" /> Generate Timetable</>
                        }
                    </button>
                </div>
            </div>

            {/* Job status banner */}
            {jobStatus && (
                <div className={`flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl border px-5 py-4 ${STATUS_COLORS[jobStatus.status] ?? "bg-slate-50 text-slate-600 border-slate-200"}`}>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Clock className="h-4 w-4 shrink-0" />
                        <p className="text-sm font-bold truncate">{jobStatus.message}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs font-mono opacity-70">Job: {jobStatus.job_id}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${STATUS_COLORS[jobStatus.status] ?? ""}`}>
                            {jobStatus.status}
                        </span>
                    </div>
                </div>
            )}

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 flex flex-col gap-1 shadow-sm">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <CalendarDays className="h-3.5 w-3.5" /> Total Slots
                    </div>
                    <p className="text-2xl font-extrabold text-slate-800">{timetable.length}</p>
                    <p className="text-xs text-slate-400">scheduled entries</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 flex flex-col gap-1 shadow-sm">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <BookOpen className="h-3.5 w-3.5" /> Courses
                    </div>
                    <p className="text-2xl font-extrabold text-slate-800">
                        {new Set(timetable.map(e => e.course.course_id)).size}
                    </p>
                    <p className="text-xs text-slate-400">unique courses</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 flex flex-col gap-1 shadow-sm col-span-2 md:col-span-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <DoorOpen className="h-3.5 w-3.5" /> Rooms
                    </div>
                    <p className="text-2xl font-extrabold text-slate-800">
                        {new Set(timetable.map(e => e.room.room_id)).size}
                    </p>
                    <p className="text-xs text-slate-400">rooms in use</p>
                </div>
            </div>

            {/* Main table/cards */}
            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">

                {/* Toolbar */}
                <div className="p-4 md:p-6 border-b border-slate-100 bg-slate-50/30">
                    <div className="relative w-full md:max-w-sm">
                        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="search"
                            placeholder="Search course, room or instructor..."
                            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* ── DESKTOP table ── */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Slot</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Course</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Instructor(s)</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Room</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Capacity</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Students</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Features</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.map((entry) => (
                                <tr key={entry.id} className="hover:bg-indigo-50/20 transition-colors">

                                    {/* Slot ID */}
                                    <td className="px-6 py-5">
                                        <span className="text-xs font-mono font-bold text-indigo-500 bg-indigo-50 px-2.5 py-1 rounded-lg">
                                            #{entry.timeslot_id.toString().padStart(3, "0")}
                                        </span>
                                    </td>

                                    {/* Course */}
                                    <td className="px-6 py-5 max-w-[200px]">
                                        <p className="text-sm font-bold text-slate-800 truncate">{entry.course.course_name}</p>
                                        <p className="text-xs font-mono text-slate-400 mt-0.5">
                                            ID #{entry.course.course_id.toString().padStart(3, "0")}
                                        </p>
                                    </td>

                                    {/* Instructors */}
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            {entry.course.instructors.length > 0
                                                ? entry.course.instructors.map(inst => (
                                                    <div key={inst.instructor_id} className="flex items-center gap-1.5 text-xs text-slate-600">
                                                        <User className="h-3 w-3 text-slate-400 shrink-0" />
                                                        {inst.name}
                                                    </div>
                                                ))
                                                : <span className="text-xs text-slate-400 italic">Unassigned</span>
                                            }
                                        </div>
                                    </td>

                                    {/* Room */}
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                                            <DoorOpen className="h-4 w-4 text-slate-400" />
                                            Room {entry.room.room_id}
                                        </div>
                                    </td>

                                    {/* Capacity */}
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-1.5">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-sm font-bold text-slate-700">{entry.room.capacity}</span>
                                                <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full bg-indigo-400 transition-all"
                                                        style={{ width: `${Math.min((entry.course.students.length / entry.room.capacity) * 100, 100)}%` }}
                                                    />
                                                </div>
                                                <span className="text-[10px] text-slate-400">
                                                    {entry.course.students.length}/{entry.room.capacity} filled
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Students */}
                                    <td className="px-6 py-5">
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600">
                                            <Users className="h-3.5 w-3.5" />
                                            {entry.course.students.length}
                                        </div>
                                    </td>

                                    {/* Features */}
                                    <td className="px-6 py-5">
                                        <div className="flex flex-wrap gap-1">
                                            {entry.room.features.length > 0
                                                ? entry.room.features.map(f => (
                                                    <span key={f.feature_id} className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase font-bold">
                                                        {f.feature_name}
                                                    </span>
                                                ))
                                                : <span className="text-xs text-slate-300">—</span>
                                            }
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filtered.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                                <CalendarDays className="h-7 w-7 text-slate-300" />
                            </div>
                            <p className="text-sm font-bold text-slate-400">No timetable entries found</p>
                            <p className="text-xs text-slate-400">Try generating a timetable or adjust your search.</p>
                        </div>
                    )}
                </div>

                {/* ── MOBILE cards ── */}
                <div className="md:hidden divide-y divide-slate-100">
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                                <CalendarDays className="h-7 w-7 text-slate-300" />
                            </div>
                            <p className="text-sm font-bold text-slate-400">No timetable entries found</p>
                        </div>
                    ) : filtered.map((entry) => (
                        <div key={entry.id} className="p-4 hover:bg-indigo-50/20 transition-colors">

                            {/* Top row */}
                            <div
                                className="flex items-start justify-between gap-3 cursor-pointer"
                                onClick={() => toggleExpand(entry.id)}
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className="shrink-0 text-xs font-mono font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-lg">
                                        #{entry.timeslot_id.toString().padStart(3, "0")}
                                    </span>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-slate-800 truncate">{entry.course.course_name}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="flex items-center gap-1 text-xs text-slate-500">
                                                <DoorOpen className="h-3 w-3" /> Room {entry.room.room_id}
                                            </span>
                                            <span className="flex items-center gap-1 text-xs text-slate-500">
                                                <Users className="h-3 w-3" /> {entry.course.students.length} students
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {expandedRow === entry.id
                                    ? <ChevronUp className="h-4 w-4 text-slate-400 shrink-0 mt-1" />
                                    : <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 mt-1" />
                                }
                            </div>

                            {/* Expanded details */}
                            {expandedRow === entry.id && (
                                <div className="mt-4 space-y-3 pl-1 border-t border-slate-100 pt-4">

                                    {/* Instructors */}
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Instructors</p>
                                        <div className="flex flex-col gap-1">
                                            {entry.course.instructors.length > 0
                                                ? entry.course.instructors.map(inst => (
                                                    <div key={inst.instructor_id} className="flex items-center gap-1.5 text-xs text-slate-600">
                                                        <User className="h-3 w-3 text-slate-400" /> {inst.name}
                                                    </div>
                                                ))
                                                : <span className="text-xs text-slate-400 italic">Unassigned</span>
                                            }
                                        </div>
                                    </div>

                                    {/* Room capacity bar */}
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Room Capacity</p>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-indigo-400 transition-all"
                                                    style={{ width: `${Math.min((entry.course.students.length / entry.room.capacity) * 100, 100)}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-slate-500 font-bold shrink-0">
                                                {entry.course.students.length}/{entry.room.capacity}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Semesters breakdown */}
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Students by Semester</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {(["Fall", "Spring", "Summer"] as const).map(sem => {
                                                const count = entry.course.students.filter(s => s.semester === sem).length
                                                if (count === 0) return null
                                                return (
                                                    <span key={sem} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${SEMESTER_COLORS[sem]}`}>
                                                        {sem}: {count}
                                                    </span>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/* Room features */}
                                    {entry.room.features.length > 0 && (
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Room Features</p>
                                            <div className="flex flex-wrap gap-1">
                                                {entry.room.features.map(f => (
                                                    <span key={f.feature_id} className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase font-bold">
                                                        {f.feature_name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-4 md:p-6 bg-slate-50/30 border-t border-slate-100">
                    <p className="text-sm text-slate-500">
                        Showing <span className="text-slate-900 font-bold">{filtered.length}</span> of{" "}
                        <span className="text-slate-900 font-bold">{timetable.length}</span> entries
                    </p>
                </div>
            </div>
        </div>
    )
}