import Image from 'next/image';
import type { StudyMedia } from '@/content/villa';
import styles from '@/styles/villa.module.css';

export function StudyImage({ image, priority = false, sizes = '(max-width: 767px) 100vw, 50vw', className = '' }: { image: StudyMedia; priority?: boolean; sizes?: string; className?: string }) {
  return (
    <picture className={`${styles.picture} ${className}`}>
      {priority && image.name === 'lake' && <source media="(max-width: 767px)" type="image/avif" srcSet="/images/lake-mobile-640.avif 640w, /images/lake-mobile-960.avif 960w" sizes="100vw" />}
      <source type="image/avif" srcSet={[640, 960, 1280, 1920].map(width => `/images/${image.name}-${width}.avif ${width}w`).join(', ')} sizes={sizes} />
      <source type="image/webp" srcSet={[640, 1280, 1920].map(width => `/images/${image.name}-${width}.webp ${width}w`).join(', ')} sizes={sizes} />
      <Image src={`/images/${image.name}-1280.webp`} alt={image.alt} width={image.width} height={image.height} sizes={sizes} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} unoptimized style={{ objectPosition: image.position }} />
    </picture>
  );
}


