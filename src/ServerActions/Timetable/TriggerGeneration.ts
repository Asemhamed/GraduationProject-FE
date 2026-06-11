'use server'

import { getToken } from "@/cookies/auth.actions"

interface GenerationResult {
    message?: string
}

export async function TriggerGeneration(): Promise<GenerationResult> {
    const token = await getToken()
    try {
        const response = await fetch(`http://localhost:8000/api/timetable/generate/`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error(`Generation failed: ${response.status}`)
        }

        const data: GenerationResult = await response.json()
        return data
    } catch (error) {
        console.error("Error triggering timetable generation:", error)
        throw error
    }
}