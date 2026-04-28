"use client"

import { useState, useEffect } from "react"
import { Sparkles } from "lucide-react"
import { Badge, FeaturesLayout } from "../_Components/features-layout"
import { GetFeaturs } from "@/app/api/facilities/features/route"

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

        const data = await GetFeaturs();
        // Handle array response or paginated response
        const featuresList = data;

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
    <FeaturesLayout
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
