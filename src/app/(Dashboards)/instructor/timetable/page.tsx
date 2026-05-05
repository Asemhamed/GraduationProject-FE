import { GetProfile } from "@/ServerActions/Profile/GetProfile";
import { GetTimetable } from "@/ServerActions/Timetable/GetTimetable";
import { InstructorRecord } from "@/Types/StudentTypes";
import { TimetableResponse } from "@/Types/TimetableTypes";
import InstructorTimetableLayout from "../_Components/timetable-layout";

export default async function TimetablePage() {
    let initialTimetable:TimetableResponse = [];
    let instructor:InstructorRecord;
    try {
        initialTimetable = await GetTimetable();
        instructor = await GetProfile();
    } catch {
        initialTimetable = []
        instructor = {} as InstructorRecord;
    }

    return <InstructorTimetableLayout initialTimetable={initialTimetable} instructor={instructor} />
}