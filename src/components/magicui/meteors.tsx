"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface MeteorsProps {
  number?: number;
  className?: string;
}

export function Meteors({ number = 20, className }: MeteorsProps) {
  const [meteorStyles, setMeteorStyles] = useState<Array<{
    top: string;
    left: string;
    delay: string;
    duration: string;
  }>>([]);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // 检查当前主题
    const checkTheme = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
    };

    // 初始检查
    checkTheme();

    // 监听主题变化
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const styles = Array.from({ length: number }, () => ({
      top: Math.floor(Math.random() * 100) + "%",
      left: Math.floor(Math.random() * 100) + "%",
      delay: Math.random() * 1 + "s",
      duration: Math.random() * 1 + 0.5 + "s",
    }));
    setMeteorStyles(styles);
  }, [number]);

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {meteorStyles.map((style, idx) => (
        <span
          key={idx}
          className={cn(
            "absolute h-0.5 w-0.5 rotate-[215deg] animate-meteor rounded-[9999px] before:absolute before:top-0 before:transform before:-translate-y-[50%] before:w-[50px] before:h-[1px]",
            isDark 
              ? "bg-slate-500 shadow-[0_0_0_1px_#ffffff10] before:bg-gradient-to-r before:from-[#64748b] before:to-transparent"
              : "bg-gray-600 shadow-[0_0_0_1px_#00000010] before:bg-gradient-to-r before:from-[#4b5563] before:to-transparent"
          )}
          style={{
            top: style.top,
            left: style.left,
            animationDelay: style.delay,
            animationDuration: style.duration,
          }}
        />
      ))}
    </div>
  );
} 