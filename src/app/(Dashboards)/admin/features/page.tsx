import { GetFeatures } from "@/ServerActions/Feature/GetFeatures"
import FeaturesLayout from "../_Components/features-layout"




export default async function FeaturesPage() {
  const features = await GetFeatures()
  return (
    <FeaturesLayout features={features}/>
  )
}
