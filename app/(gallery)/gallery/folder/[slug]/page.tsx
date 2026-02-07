import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchGalleryData } from "@/lib/gallery";
import GalleryMasonry from "@/components/gallery/GalleryMasonry";

interface FolderPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function FolderPage({ params }: FolderPageProps) {
  const { slug } = await params;
  const galleryData = await fetchGalleryData();
  if (!galleryData) notFound();

  const folder = galleryData.folders[slug];

  if (!folder) {
    notFound();
  }

  return (
    <section className="container p-4 my-10 md:my-16 lg:my-20">
      <div className="mb-8">
        <Link
          href="/gallery"
          className="text-sm text-gray-600 hover:text-black transition-colors mb-2 inline-block"
        >
          ← back to gallery
        </Link>
        <h2 className="text-6xl">{folder.name}</h2>
        <p className="text-gray-600 mt-2">{folder.items.length} items</p>
      </div>

      <Suspense fallback={<div className="min-h-[40vh]" />}>
        <GalleryMasonry items={folder.items} eagerCount={3} />
      </Suspense>
    </section>
  );
}

export async function generateStaticParams() {
  const galleryData = await fetchGalleryData();
  if (!galleryData) return [];

  return Object.keys(galleryData.folders).map((slug) => ({ slug }));
}
