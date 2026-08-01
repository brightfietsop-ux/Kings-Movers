import Image from "next/image";

type GalleryImage = {
  src: string;
  alt: string;
};

type GalleryLightboxProps = {
  images: GalleryImage[];
};

export function GalleryLightbox({ images }: GalleryLightboxProps) {
  return (
    <>
      <div className="gallery-grid">
        {images.map((image, index) => (
          <a
            href={`#gallery-lightbox-${index}`}
            className="gallery-item"
            key={image.src}
            aria-label={`Open ${image.alt} full screen`}
          >
            <span className="gallery-item-image">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </span>
          </a>
        ))}
      </div>

      {images.map((image, index) => (
        <div
          id={`gallery-lightbox-${index}`}
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Full-screen image: ${image.alt}`}
          key={`${image.src}-lightbox`}
        >
          <a
            href="#gallery"
            className="gallery-lightbox-backdrop"
            aria-label="Close full-screen image"
          />

          <div className="gallery-lightbox-image">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="100vw"
              style={{ objectFit: "contain" }}
              priority
            />
          </div>

          <a
            href="#gallery"
            className="gallery-lightbox-close"
            aria-label="Close full-screen image"
          >
            &times;
          </a>
        </div>
      ))}
    </>
  );
}
