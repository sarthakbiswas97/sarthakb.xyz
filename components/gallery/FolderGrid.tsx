import Link from "next/link";
import Image from "next/image";
import type { GalleryFolderListItem } from "@/lib/gallery";

interface FolderGridProps {
  folders: GalleryFolderListItem[];
}

export default function FolderGrid({ folders }: FolderGridProps) {
  return (
    <div className="mt-16">
      <h3 className="text-3xl mb-6">folders</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {folders.map((folder) => (
          <Link
            key={folder.id}
            href={`/gallery/folder/${folder.id}`}
            className="group cursor-pointer"
          >
            <div className="relative aspect-square overflow-hidden bg-gray-100">
              <Image
                src={folder.cover}
                alt={folder.name}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-100 group-hover:opacity-90 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <p className="font-medium text-lg">{folder.name}</p>
                <p className="text-sm opacity-80">{folder.items.length} items</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
