import { redirect } from "next/navigation";
import FolderGrid from "@/components/gallery/FolderGrid";
import { fetchGalleryData, getGalleryFolderList } from "@/lib/gallery";
import GalleryMasonry from "@/components/gallery/GalleryMasonry";

export default async function Gallery() {
  const galleryData = await fetchGalleryData();
  if (!galleryData) redirect("/");

  return (
    <section className="container p-4 my-10 md:my-16 lg:my-20">
      <h2 className="text-6xl mb-8">gallery</h2>

      <GalleryMasonry items={galleryData.general} eagerCount={3} />

      <FolderGrid folders={getGalleryFolderList(galleryData)} />
    </section>
  );
}
