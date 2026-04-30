import { GetFeaturs } from "@/ServerAPIs/GetFeatures"
import FeaturesLayout from "../_Components/features-layout"




export default async function FeaturesPage() {
  const features = await GetFeaturs()
  return (
    <FeaturesLayout features={features}/>
  )
}
