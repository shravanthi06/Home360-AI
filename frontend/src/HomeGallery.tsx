import React from "react";

/**
 * HOME360 AI — The Living Blueprint photo gallery.
 * Place this component on the dashboard; it needs no extra package.
 */
const homePhotos = [
  {
    title: "Spaces to come home to",
    detail: "Living · Interior architecture",
    src: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85",
    alt: "Warm modern living room with natural materials and elegant furniture",
    feature: true,
  },
  {
    title: "Everyday rituals",
    detail: "Kitchen · Interiors",
    src: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=85",
    alt: "Bright contemporary kitchen with warm wood finishes",
  },
  {
    title: "Comfort, considered",
    detail: "Bedroom · Calm living",
    src: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=85",
    alt: "Thoughtfully styled contemporary home interior",
  },
  {
    title: "A home that thinks ahead",
    detail: "Smart home · Connected living",
    src: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=900&q=85",
    alt: "Modern smart-home control and connected living technology",
  },
  {
    title: "Care that keeps things working",
    detail: "Maintenance · Home services",
    src: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=900&q=85",
    alt: "Professional technician working on a home repair",
  },
];

export default function HomeImageGallery() {
  const feature = homePhotos.find((photo) => photo.feature);
  const supporting = homePhotos.filter((photo) => !photo.feature);

  if (!feature) return null;

  return (
    <section className="home-image-gallery" aria-label="Explore thoughtful home design">
      <figure className="home-image-gallery__feature">
        <img
          src={feature.src}
          alt={feature.alt}
          loading="lazy"
          decoding="async"
        />
        <figcaption className="home-image-gallery__caption">
          {feature.title}
          <small>{feature.detail}</small>
        </figcaption>
      </figure>

      <div className="home-image-gallery__stack">
        {supporting.map((photo) => (
          <figure className="home-image-gallery__tile" key={photo.title}>
            <img
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              decoding="async"
            />
            <figcaption className="home-image-gallery__caption">
              {photo.title}
              <small>{photo.detail}</small>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
