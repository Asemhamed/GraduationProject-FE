import { GetTimetable } from "@/ServerActions/Timetable/GetTimetable"
import TimetableLayout from "../_Components/timetable-layout"
import { TimetableResponse } from "@/Types/TimetableTypes"

export default async function TimetablePage() {
    let initialTimetable:TimetableResponse = []
    try {
        initialTimetable = await GetTimetable()
    } catch {
        initialTimetable = []
    }

    return <TimetableLayout initialTimetable={initialTimetable} />
}