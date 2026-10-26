// src/components/TintedCarImage.tsx
import React, { useEffect, useRef, useState } from 'react';

interface TintedCarImageProps {
  imageUrl: string;
  colorHex: string;
  className?: string;
  style?: React.CSSProperties;
}

export const TintedCarImage: React.FC<TintedCarImageProps> = ({ imageUrl, colorHex, className, style }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Если цвет заводской (original) или прозрачный, ничего не красим
    if (colorHex === 'original' || colorHex === 'transparent') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Конвертируем HEX цвет в RGB
      const r = parseInt(colorHex.slice(1, 3), 16);
      const g = parseInt(colorHex.slice(3, 5), 16);
      const b = parseInt(colorHex.slice(5, 7), 16);

      for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3];
        if (alpha === 0) continue; // Пропускаем прозрачные пиксели

        // Считаем яркость пикселя (luminance)
        const pr = data[i];
        const pg = data[i + 1];
        const pb = data[i + 2];
        const brightness = (0.299 * pr + 0.587 * pg + 0.114 * pb) / 255;

        // 👇 МАГИЯ ТОНИРОВАНИЯ (сохранение бликов и теней)
        if (brightness < 0.5) {
          // Тени и темные участки (от черного до нашего цвета)
          const factor = brightness * 2;
          data[i] = r * factor;
          data[i + 1] = g * factor;
          data[i + 2] = b * factor;
        } else {
          // Блики и светлые участки (от нашего цвета до белого)
          const factor = (brightness - 0.5) * 2;
          data[i] = r + (255 - r) * factor;
          data[i + 1] = g + (255 - g) * factor;
          data[i + 2] = b + (255 - b) * factor;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      setIsLoaded(true);
    };
  }, [imageUrl, colorHex]);

  // Если цвет заводской, просто показываем оригинальную картинку
  if (colorHex === 'original' || colorHex === 'transparent') {
    return (
      <img 
        src={imageUrl} 
        className={className} 
        style={style} 
        alt="car" 
        draggable={false} 
        onError={(e) => { e.currentTarget.style.opacity = '0'; }}
      />
    );
  }

  // Если цвет выбран, показываем покрашенный Canvas
  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        ...style,
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.2s ease',
      }}
    />
  );
};