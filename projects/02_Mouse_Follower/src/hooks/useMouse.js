import { useEffect, useRef, useState } from "react";

export function useMouse() {
  const [enable, setEnable] = useState(false);
  const followerRef = useRef(null);

  useEffect(() => {
    if (!enable) return;

    const follower = followerRef.current;
    let mouseX = 0;
    let mouseY = 0;
    let posX = 0;
    let posY = 0;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      // suavizado (lerp)
      posX += (mouseX - posX) * 0.1;
      posY += (mouseY - posY) * 0.1;

      follower.style.transform = `
          translate3d(${posX}px, ${posY}px, 0)
          translate(-50%, -50%)
        `;

      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [enable]);

  useEffect(() => {
    document.body.classList.toggle("no-cursor", enable);
    return () => document.body.classList.remove("no-cursor");
  }, [enable]);
  const toggleEnable = () => setEnable(!enable);
  return { enable, toggleEnable, followerRef };
}
