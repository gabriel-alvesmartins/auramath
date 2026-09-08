import React, { useEffect, useRef } from 'react';

export const CosmicBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Gerador de partículas estelares
    const starCount = Math.min(80, Math.floor(width / 18));
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.5,
      speedY: Math.random() * 0.25 + 0.05,
      speedX: (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.7 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      color: Math.random() > 0.6 ? '#00F2FE' : Math.random() > 0.4 ? '#8A2BE2' : '#F8FAFC',
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Fundo escuro Obsidian com gradiente sutil
      const bgGrad = ctx.createRadialGradient(
        width * 0.5, height * 0.2, 50,
        width * 0.5, height * 0.5, Math.max(width, height) * 0.8
      );
      bgGrad.addColorStop(0, '#0C111E');
      bgGrad.addColorStop(0.5, '#07090E');
      bgGrad.addColorStop(1, '#030407');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Manchas de nebulosa bioluminescente
      const nebula1 = ctx.createRadialGradient(
        width * 0.2, height * 0.3, 10,
        width * 0.2, height * 0.3, width * 0.4
      );
      nebula1.addColorStop(0, 'rgba(0, 242, 254, 0.06)');
      nebula1.addColorStop(0.6, 'rgba(0, 242, 254, 0.01)');
      nebula1.addColorStop(1, 'transparent');
      ctx.fillStyle = nebula1;
      ctx.fillRect(0, 0, width, height);

      const nebula2 = ctx.createRadialGradient(
        width * 0.8, height * 0.7, 10,
        width * 0.8, height * 0.7, width * 0.45
      );
      nebula2.addColorStop(0, 'rgba(138, 43, 226, 0.07)');
      nebula2.addColorStop(0.6, 'rgba(138, 43, 226, 0.015)');
      nebula2.addColorStop(1, 'transparent');
      ctx.fillStyle = nebula2;
      ctx.fillRect(0, 0, width, height);

      // Desenho e animação das estrelas
      stars.forEach(star => {
        star.y -= star.speedY;
        star.x += star.speedX;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;

        star.alpha += Math.sin(Date.now() * star.pulseSpeed * 0.1) * 0.01;
        const currentAlpha = Math.max(0.15, Math.min(0.9, star.alpha));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = currentAlpha;
        ctx.fill();

        // Glow sutil nas maiores
        if (star.size > 1.4) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.globalAlpha = currentAlpha * 0.25;
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        width: '100vw',
        height: '100vh',
      }}
    />
  );
};
