"use client"

import { useState, useEffect } from "react"
import { Sparkles } from "lucide-react"
import { Badge, DataPageLayout } from "../_Components/data-page-layout"

interface Feature {
  id: number
  feature_id?: number
  feature_name: string
  name?: string
}

const columns = [
  { key: "feature_id", label: "ID" },
  { key: "feature_name", label: "Feature Name" },
]

const formFields = [
  { key: "feature_name", label: "Feature Name", type: "text" as const, placeholder: "Enter feature name" },
]

export default function FeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        setLoading(true)
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3Nzc5OTQ4ODJ9.yj3VIYF0kt3idHSezL3yN_xwZRG5t4KQyN7Ltqum00w"
        
        const response = await fetch("http://localhost:8000/api/facilities/features?skip=0&limit=100", {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch features")
        }

        const data = await response.json()
        
        // Handle array response or paginated response
        const featuresList = Array.isArray(data) ? data : data.data || data.items || []
        
        // Transform data to match Feature interface
        const transformedFeatures: Feature[] = featuresList.map((item: any, index: number) => ({
          id: item.feature_id || item.id || index + 1,
          feature_id: item.feature_id || item.id || index + 1,
          feature_name: item.feature_name || item.name || "",
        }))

        setFeatures(transformedFeatures)
        setError(null)
      } catch (err) {
        console.error("[v0] Error fetching features:", err)
        setError(err instanceof Error ? err.message : "Failed to load features")
        setFeatures([])
      } finally {
        setLoading(false)
      }
    }

    fetchFeatures()
  }, [])

  const handleAdd = (item: Partial<Feature>) => {
    const newFeature: Feature = {
      id: features.length > 0 ? Math.max(...features.map(f => f.id || 0)) + 1 : 1,
      feature_id: features.length > 0 ? Math.max(...features.map(f => f.feature_id || 0)) + 1 : 1,
      feature_name: item.feature_name || "",
    }
    setFeatures([...features, newFeature])
  }

  const handleEdit = (item: Feature) => {
    setFeatures(features.map((f) => (f.id === item.id ? item : f)))
  }

  const handleDelete = (id: number) => {
    setFeatures(features.filter((f) => f.id !== id))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading features...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-red-500">Error: {error}</p>
      </div>
    )
  }

  return (
    <DataPageLayout
      title="Features"
      description="Manage platform features and capabilities"
      icon={<Sparkles className="h-6 w-6 text-white" />}
      columns={columns}
      data={features}
      formFields={formFields}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  )
}
