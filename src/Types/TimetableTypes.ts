export interface Instructor {
    id: number
    name: string
}

export interface Student {
    id: number
    name: string
}

export interface PrecedenceRule {
    before_course_id: number
    after_course_id: number
}

export interface Course {
    course_id: number
    course_name: string
    instructors: Instructor[]
    students: Student[]
    features: string[]
    is_enrollment_open: boolean
    // Index = timeslot_id: 1 = high priority, -1 = low priority, 0 = neutral/unavailable
    course_availability: number[]
    precedence_rules: PrecedenceRule[]
}

export interface Room {
    room_id: number
    capacity: number
    features: string[]
}

export interface TimetableEntry {
    id: number
    timeslot_id: number
    course: Course
    room: Room
}

export type TimetableResponse = TimetableEntry[]