import { getMachineryCatalog } from "@/lib/farmer/queries"
import { MachineryGallery } from "./machinery-gallery"

export async function MachineryGalleryServer() {
  const machines = await getMachineryCatalog()

  return <MachineryGallery initialMachines={machines} />
}
