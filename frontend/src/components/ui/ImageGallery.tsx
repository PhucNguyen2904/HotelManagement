'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { RoomImage } from '@/types';

interface ImageGalleryProps {
  images: RoomImage[];
  alt?: string;
  className?: string;
}

/**
 * Image Gallery Component
 * - Hiển thị ảnh chính lớn và thumbnails nhỏ bên dưới
 * - Click thumbnail để đổi ảnh chính
 * - Click ảnh chính để mở lightbox full screen
 */
export function ImageGallery({ images, alt = 'Ảnh phòng', className }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const currentImage = images?.[selectedIndex] || images?.[0];

  const handlePrevious = useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? (images?.length || 1) - 1 : prev - 1));
  }, [images?.length]);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === (images?.length || 1) - 1 ? 0 : prev + 1));
  }, [images?.length]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') setIsLightboxOpen(false);
    },
    [handlePrevious, handleNext],
  );

  if (!images || images.length === 0) {
    return (
      <div className={cn('relative w-full h-64 bg-gray-200 rounded-lg', className)}>
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          Không có ảnh
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={cn('space-y-3', className)} onKeyDown={handleKeyDown} tabIndex={0}>
        {/* Main Image */}
        <div
          className="relative w-full aspect-[4/3] rounded-lg overflow-hidden cursor-pointer group"
          onClick={() => setIsLightboxOpen(true)}
        >
          <Image
            src={currentImage.url}
            alt={`${alt} - ${selectedIndex + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
            className="object-cover transition-transform group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
            {selectedIndex + 1} / {images.length}
          </div>
          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                aria-label="Ảnh trước"
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                aria-label="Ảnh tiếp"
              >
                ›
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedIndex(index)}
                className={cn(
                  'relative w-20 h-16 flex-shrink-0 rounded-md overflow-hidden transition-all',
                  index === selectedIndex
                    ? 'ring-2 ring-blue-500 ring-offset-2'
                    : 'opacity-70 hover:opacity-100',
                )}
              >
                <Image
                  src={image.url}
                  alt={`${alt} thumbnail ${index + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setIsLightboxOpen(false)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 z-10"
            aria-label="Đóng"
          >
            ×
          </button>

          <div
            className="relative max-w-[90vw] max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={currentImage.url}
              alt={`${alt} - ${selectedIndex + 1}`}
              fill
              sizes="90vw"
              className="object-contain"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-colors"
                  aria-label="Ảnh trước"
                >
                  ‹
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-colors"
                  aria-label="Ảnh tiếp"
                >
                  ›
                </button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
              {selectedIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
