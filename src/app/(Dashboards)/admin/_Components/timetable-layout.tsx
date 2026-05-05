"use client"

import { useState } from "react"
import { 
    Calendar, 
    Clock, 
    MapPin, 
    User, 
    RefreshCw, 
    Search,
    BookOpen,
    LayoutGrid,
    Wand2,
    Loader2,
    Info,
    Users
} from "lucide-react"
import { TimetableResponse } from "@/Types/TimetableTypes"
import { toast } from "react-toastify"
import { GetTimetable } from "@/ServerActions/Timetable/GetTimetable"
import { TriggerGeneration } from "@/ServerActions/Timetable/TriggerGeneration"

interface TimetableLayoutProps {
    initialTimetable: TimetableResponse
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const HOURS = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"]

export default function TimetableLayout({ initialTimetable }: TimetableLayoutProps) {
    const [timetable, setTimetable] = useState<TimetableResponse>(initialTimetable)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [activeDayMobile, setActiveDayMobile] = useState(0)

    const handleRefresh = async () => {
        setIsRefreshing(true)
        try {
            const fresh = await GetTimetable()
            setTimetable(fresh)
        } catch {
            toast.error("Failed to refresh schedule")
        } finally {
            setIsRefreshing(false)
        }
    }

    const handleGenerate = async () => {
        setIsGenerating(true)
        try {
            const result = await TriggerGeneration()
            toast.success(result.message || "Generation started!")
            await handleRefresh()
        } catch (error) {
            toast.error("Failed to trigger generation")
        } finally {
            setIsGenerating(false)
        }
    }

    const getEntryAt = (dayIdx: number, hourIdx: number) => {
        const timeslotId = (dayIdx * 9) + hourIdx
        const entry = timetable.find(item => item.timeslot_id === timeslotId)
        
        if (!entry) return { entry: null, isMatch: true, id: timeslotId }
        
        const isMatch = searchQuery === "" || 
            entry.course.course_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.room.room_id.toString().includes(searchQuery)

        return { entry, isMatch, id: timeslotId }
    }

    return (
        <div className="w-full  max-w-full lg:max-w-[1600px] mx-auto p-3 md:p-6 space-y-4 md:space-y-6 animate-in fade-in duration-500 overflow-x-hidden border-none">
            
            {/* --- HEADER --- */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-100 pb-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 shadow-lg shadow-indigo-100">
                        <LayoutGrid className="h-5 w-5 md:h-6 md:w-6 text-white" />
                    </div>
                    <h1 className="text-lg md:text-2xl font-extrabold tracking-tight text-slate-900">Academic Timetable</h1>
                </div>

                <div className="flex flex-col gap-3 w-full lg:w-auto">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Filter course..."
                            className="w-full lg:w-64 pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full">
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing || isGenerating}
                            className="flex-1 lg:flex-none cursor-pointer flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-600 active:scale-95 disabled:opacity-50"
                        >
                            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                            Sync
                        </button>

                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating || isRefreshing}
                            className="flex-1 lg:flex-none cursor-pointer flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md active:scale-95 disabled:opacity-70"
                        >
                            {isGenerating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Wand2 className="h-3.5 w-3.5" />}
                            <span>{isGenerating ? "..." : "Generate"}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* --- MOBILE DAY TABS --- */}
            <div className="flex lg:hidden overflow-x-auto pb-1 gap-2 no-scrollbar max-w-full">
                {DAYS.map((day, idx) => (
                    <button
                        key={day}
                        onClick={() => setActiveDayMobile(idx)}
                        className={`px-4 py-2 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                            activeDayMobile === idx 
                            ? "bg-indigo-600 text-white shadow-md" 
                            : "bg-slate-50 text-slate-500 border border-slate-100"
                        }`}
                    >
                        {day}
                    </button>
                ))}
            </div>

            {/* --- TIMETABLE CONTAINER --- */}
            <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                
                {/* DESKTOP VIEW */}
                <div className="hidden lg:block w-full overflow-x-auto">
                    <table className="w-full border-collapse table-fixed min-w-[1000px]">
                        <thead>
                            <tr className="bg-slate-50/80">
                                <th className="p-2 border-b border-r border-slate-100 text-[9px] font-bold uppercase tracking-tighter text-slate-400 w-24">
                                    Day / Time
                                </th>
                                {HOURS.map(hour => (
                                    <th key={hour} className="p-2 border-b border-slate-100 text-[9px] font-bold uppercase text-slate-900">
                                        <div className="flex flex-col items-center">
                                            <Clock className="h-3 w-3 text-indigo-500 mb-0.5" />
                                            {hour}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {DAYS.map((day, dayIdx) => (
                                <tr key={day} className="group hover:bg-slate-50/30">
                                    <td className="p-2 border-r border-slate-100 bg-white group-hover:bg-slate-50">
                                        <span className="text-[10px] font-extrabold text-slate-800 block leading-tight">{day}</span>
                                    </td>
                                    
                                    {HOURS.map((_, hourIdx) => {
                                        const { entry, isMatch, id } = getEntryAt(dayIdx, hourIdx)
                                        return (
                                            <td key={id} className={`p-1 border-r border-slate-50 h-28 transition-opacity duration-300 ${isMatch ? "opacity-100" : "opacity-10 grayscale"}`}>
                                                {entry ? (
                                                    <div className="h-full rounded-lg p-1.5 border border-slate-100 bg-white shadow-sm flex flex-col justify-between overflow-hidden">
                                                        <h3 className="text-[9px] font-black text-slate-800 leading-tight line-clamp-2 uppercase">
                                                            {entry.course.course_name}
                                                        </h3>
                                                        <div className="space-y-0.5 pt-1 border-t border-slate-50 mt-1">
                                                            <div className="text-[8px] font-medium text-slate-500 truncate flex items-center gap-1">
                                                                <User className="h-2 w-2 shrink-0" />
                                                                {entry.course.instructors[0]?.name || "Staff"}
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <div className="text-[8px] font-bold text-emerald-600 flex items-center gap-0.5">
                                                                    <MapPin className="h-2 w-2" />
                                                                    R-{entry.room.room_id}
                                                                </div>
                                                                <p className="flex items-center gap-1 text-[8px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg shrink-0">
                                                                    <Users className="h-2 w-2" />
                                                                    {entry.course.students.length || 0}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="h-full rounded-lg border border-dashed border-slate-50 flex items-center justify-center bg-slate-50/10">
                                                        <span className="text-[7px] font-mono text-slate-200">FREE</span>
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

                {/* MOBILE VIEW */}
                <div className="lg:hidden w-full overflow-hidden">
                    <div className="bg-indigo-50/50 p-3 border-b border-indigo-100 flex justify-between items-center overflow-hidden">
                        <h2 className="text-xs font-black text-indigo-700 uppercase tracking-wider flex items-center gap-2 truncate">
                            <Calendar className="h-3 w-3 shrink-0" /> {DAYS[activeDayMobile]}
                        </h2>
                        <span className="text-[9px] font-bold text-indigo-400 bg-white px-1.5 py-0.5 rounded border border-indigo-100">
                            CYCLE {activeDayMobile + 1}
                        </span>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {HOURS.map((hour, hourIdx) => {
                            const { entry, isMatch, id } = getEntryAt(activeDayMobile, hourIdx)
                            if (!isMatch && searchQuery !== "") return null;

                            return (
                                <div key={id} className="p-3 flex items-start gap-3 w-full">
                                    <div className="w-16 shrink-0 pt-1">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase block leading-none mb-1">Time</span>
                                        <span className="text-[11px] font-black text-slate-900 whitespace-nowrap">{hour}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        {entry ? (
                                            <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
                                                <div className="flex justify-between items-start gap-2 mb-2">
                                                    <h3 className="text-xs font-black text-slate-900 leading-tight uppercase truncate">
                                                        {entry.course.course_name}
                                                    </h3>
                                                    <div className="flex items-center gap-0.5 text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1 rounded shrink-0">
                                                        <Users className="h-2 w-2" />
                                                        {entry.course.students.length || 0}
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-50">
                                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 truncate">
                                                        <User className="h-3 w-3 text-indigo-400 shrink-0" />
                                                        <span className="truncate">{entry.course.instructors[0]?.name || "Staff"}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 justify-end">
                                                        <p>
                                                            <MapPin className="h-3 w-3 shrink-0" />
                                                            <span>R-{entry.room.room_id}</span>
                                                        </p>
                                                        <p className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg shrink-0">
                                                            <Users className="h-3 w-3" />
                                                            {entry.course.students.length || 0}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="h-10 border border-dashed border-slate-100 rounded-lg flex items-center justify-center bg-slate-50/20">
                                                <span className="text-[9px] font-bold text-slate-200 uppercase">Free Period</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <div className="flex items-center justify-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <Info className="h-3 w-3 text-indigo-400" />
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wide text-center">
                    8-day rotation cycle (Index 0-71)
                </p>
            </div>
        </div>
    )
}