import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

const supportedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

function getGalleryImages() {
  const galleryDirectory = path.join(process.cwd(), "public", "gallery");

  try {
    return fs
      .readdirSync(galleryDirectory)
      .filter((file) => supportedExtensions.has(path.extname(file).toLowerCase()))
      .sort()
      .map((file) => ({
        src: `/gallery/${file}`,
        alt: file
          .replace(/\.[^.]+$/, "")
          .replace(/[-_]+/g, " ")
          .replace(/\b\w/g, (letter) => letter.toUpperCase()),
      }));
  } catch {
    return [];
  }
}

export function Gallery() {
  const images = getGalleryImages();

  return (
    <section id="gallery" className="section gallery-section">
      <div className="container">
        <div className="section-heading text-center mx-auto">
          <span className="eyebrow">Our work</span>
          <h2>Real moves. Real care.</h2>
          <p>
            This gallery is reserved for actual Kings Movers projects—never
            random stock or AI-generated moving photos.
          </p>
        </div>

        {images.length > 0 ? (
          <div className="gallery-grid">
            {images.map((image) => (
              <figure className="gallery-item" key={image.src}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </figure>
            ))}
          </div>
        ) : (
          <div className="gallery-empty">
            <div className="gallery-empty-icon" aria-hidden="true">
              <i className="bi bi-images" />
            </div>
            <div>
              <h3>Company photos are being added</h3>
              <p className="mb-0">
                Drop the company&apos;s real images into{" "}
                <code>public/gallery</code> and they will appear here
                automatically.
              </p>
            </div>
          </div>
        )}

        <div className="flyer-card">
          <div className="flyer-copy">
            <span className="eyebrow">Original company flyer</span>
            <h3>Moving help is one call away.</h3>
            <p>
              Furniture moving, household cleanup, waste removal, loading,
              unloading, and short- or long-distance moves.
            </p>
            <a href="tel:+12023089917" className="btn btn-brand">
              <i className="bi bi-telephone-fill me-2" aria-hidden="true" />
              Call (202) 308-9917
            </a>
          </div>
          <div className="flyer-image-wrap">
            <Image
              src="/kings-movers-flyer.png"
              alt="Original Kings Movers and Junk Removal Services flyer"
              width={959}
              height={609}
            />
          </div>
        </div>
      </div>
    </section>
  );
}