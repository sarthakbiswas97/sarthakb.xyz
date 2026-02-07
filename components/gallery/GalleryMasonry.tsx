"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import VideoPlayer from "@/components/gallery/VideoPlayer";
import type { GalleryMedia } from "@/lib/gallery";

interface GalleryMasonryProps {
  items: GalleryMedia[];
  eagerCount?: number;
}

export default function GalleryMasonry({
  items,
  eagerCount = 0,
}: GalleryMasonryProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeMedia = searchParams.get("media");
  const activeIndex = useMemo(() => {
    if (!activeMedia) return -1;
    return items.findIndex((item) => `${item.type}-${item.id}` === activeMedia);
  }, [items, activeMedia]);
  const activeItem = activeIndex >= 0 ? items[activeIndex] : null;

  const setModalQuery = (value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("media", value);
    } else {
      params.delete("media");
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const openModal = (index: number) => {
    const item = items[index];
    if (!item) return;
    setModalQuery(`${item.type}-${item.id}`);
  };

  const closeModal = () => setModalQuery(null);

  useEffect(() => {
    if (activeItem === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeItem]);

  const tweetUrl = useMemo(() => {
    if (!activeItem) return "#";
    const text = `${activeItem.caption}\n\n${activeItem.src}`;
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  }, [activeItem]);

  return (
    <>
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
        {items.map((item, index) => (
          <button
            key={`${item.type}-${item.id}-${index}`}
            type="button"
            className="mb-4 break-inside-avoid overflow-hidden bg-gray-100 relative w-full text-left cursor-zoom-in"
            onClick={() => openModal(index)}
          >
            {item.type === "image" ? (
              <div className="relative w-full group">
                <Image
                  src={item.src}
                  alt={item.caption}
                  width={800}
                  height={600}
                  className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                  loading={index < eagerCount ? "eager" : "lazy"}
                  priority={index < eagerCount}
                  quality={85}
                />
              </div>
            ) : (
              <div className="relative w-full">
                <VideoPlayer item={item} onActivate={() => openModal(index)} />
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-gradient-to-t from-black/70 to-transparent pointer-events-none">
              <p className="text-sm font-medium">{item.caption}</p>
            </div>
          </button>
        ))}
      </div>

      {activeItem && (
        <div
          className="fixed inset-0 z-50 bg-black/85 p-4 md:p-8 flex items-center justify-center"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-6xl max-h-[92vh]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="group relative w-full h-[65vh] md:h-[75vh] bg-black flex items-center justify-center">
              {activeItem.type === "image" ? (
                <Image
                  src={activeItem.src}
                  alt={activeItem.caption}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  quality={95}
                  priority
                />
              ) : (
                <VideoPlayer
                  item={activeItem}
                  observeVisibility={false}
                  wrapperClassName="relative h-full w-full flex items-center justify-center overflow-hidden cursor-pointer"
                  fit="contain"
                  className="h-full w-full object-contain"
                />
              )}

              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute top-3 right-3 flex items-center gap-2 pointer-events-auto">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-3 py-2 text-sm bg-black/70 text-white hover:bg-black/90 cursor-pointer"
                  >
                    close
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
                  <p className="text-sm md:text-base text-white">{activeItem.caption}</p>
                  <div className="flex items-center gap-2">
                    <a
                      href={activeItem.src}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 text-sm bg-white text-black hover:bg-gray-200"
                    >
                      download
                    </a>
                    <a
                      href={tweetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 text-sm bg-sky-500 text-white hover:bg-sky-600"
                    >
                      tweet
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
