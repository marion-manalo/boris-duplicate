import React from 'react';
import Image, { StaticImageData } from 'next/image';
import './ImageSlide.css';

interface SlideItem {
  image: string | StaticImageData;
  title: string;
  description: string;
}

interface ImageSlideProps {
  items: SlideItem[];
}

const ImageSlide = ({ items }: ImageSlideProps) => {
  if (!items || items.length === 0) return null;

  const mainItem = items[0];
  const burstItems = items.slice(1);

  // generate image slide animation on front public page
  return (
    <div className="image-burst-wrapper">
      <Image
        src={mainItem.image}
        alt="Main"
        className="image-burst-main"
      />

      {burstItems.map((item, index) => {
        const offset = index - (burstItems.length - 1) / 2;
        return (
          <div
            key={index}
            className="image-burst-slide"
            style={{
              animationDelay: `${0.5 + index * 0.3}s`,
              ['--slide-offset' as any]: offset,
            }}
          >
            <Image
              src={item.image}
              alt={`Burst ${index + 1}`}
              className="image-burst-inner"
            />
            <div className="image-burst-title">{item.title}</div>
            <div className="image-burst-description">{item.description}</div>
          </div>
        );
      })}
    </div>
  );
};

export default ImageSlide;
