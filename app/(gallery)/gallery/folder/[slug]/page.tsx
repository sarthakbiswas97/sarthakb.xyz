import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Video from "../../video";
import { galleryFolders } from "@/data/gallery-folders";

interface FolderPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function FolderPage({ params }: FolderPageProps) {
  const { slug } = await params;
  const folder = galleryFolders.find((f) => f.id === slug);

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
        <p className="text-gray-600 mt-2">{folder.date} · {folder.items.length} items</p>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
        {folder.items.map((item, index) => (
          <div
            key={item.id}
            className="mb-4 break-inside-avoid overflow-hidden bg-gray-100 group cursor-pointer relative"
          >
            {item.type === "image" ? (
              <div className="relative w-full">
                <Image
                  src={item.src}
                  alt={item.caption}
                  width={800}
                  height={600}
                  className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                  loading={index < 3 ? "eager" : "lazy"}
                  priority={index < 3}
                  quality={85}
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-gradient-to-t from-black/70 to-transparent">
                  <p className="text-sm font-medium">{item.caption}</p>
                </div>
              </div>
            ) : (
              <Video item={item} />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export async function generateStaticParams() {
  return galleryFolders.map((folder) => ({
    slug: folder.id,
  }));
}
