import React from 'react';
import type { MeaningVideoSource } from '../../config/meaningData';

export type MeaningVideoPlayerVariant = 'hero' | 'inline' | 'card' | 'modal';

export interface MeaningVideoPlayerProps {
  source: MeaningVideoSource;
  variant?: MeaningVideoPlayerVariant;
  className?: string;
  posterFallback?: string;
}

const MeaningVideoPlayer: React.FC<MeaningVideoPlayerProps> = ({
  source,
  variant = 'inline',
  className,
  posterFallback,
}) => {
  if (source.kind === 'selfHosted') {
    const videoPoster = source.selfHosted.poster || posterFallback;
    const commonProps = {
      src: source.selfHosted.src,
      poster: videoPoster,
      className,
      playsInline: true,
    } as const;

    if (variant === 'hero') {
      return (
        <video
          {...commonProps}
          muted
          loop
          autoPlay
          controls={false}
        />
      );
    }

    if (variant === 'modal') {
      return (
        <video
          {...commonProps}
          controls
          autoPlay
        />
      );
    }

    return (
      <video
        {...commonProps}
        controls={variant === 'card'}
      />
    );
  }

  // embed
  const embedUrl = source.embed.embedUrl;
  const title = source.embed.title || 'Meaning video';

  return (
    <iframe
      src={embedUrl}
      title={title}
      className={className}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
};

export default MeaningVideoPlayer;

