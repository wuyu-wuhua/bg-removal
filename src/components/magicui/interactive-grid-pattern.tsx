"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export function InteractiveGridPattern({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const patternRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pattern = patternRef.current;
    if (!pattern) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = pattern.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      pattern.style.setProperty("--mouse-x", `${x}px`);
      pattern.style.setProperty("--mouse-y", `${y}px`);
    };

    pattern.addEventListener("mousemove", handleMouseMove);
    return () => pattern.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={patternRef}
      className={cn(
        "absolute inset-0 [--mouse-x:50%] [--mouse-y:50%]",
        className
      )}
      {...props}
    >
      {/* 基础渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20 dark:from-blue-800/30 dark:via-purple-800/30 dark:to-pink-800/30" />
      
      {/* 主要网格图案 - 更明显 */}
      <div className="absolute inset-0 opacity-60" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='20' cy='20' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      
      {/* 次要网格图案 - 更密集 */}
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      
      {/* 动态光晕效果 */}
      <div
        className="absolute inset-0 opacity-50 transition-opacity duration-300"
        style={{
          backgroundImage: `
            radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(59, 130, 246, 0.4), transparent 60%),
            radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(147, 51, 234, 0.4), transparent 60%),
            radial-gradient(200px circle at var(--mouse-x) var(--mouse-y), rgba(236, 72, 153, 0.4), transparent 60%)
          `,
        }}
      />
      
      {/* 线性渐变效果 */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(0deg, transparent 0%, rgba(59, 130, 246, 0.15) 50%, transparent 100%),
            linear-gradient(90deg, transparent 0%, rgba(147, 51, 234, 0.15) 50%, transparent 100%),
            linear-gradient(45deg, transparent 0%, rgba(236, 72, 153, 0.15) 50%, transparent 100%)
          `,
        }}
      />
      
      {/* 动态网格点 - 跟随鼠标 */}
      <div
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage: `
            radial-gradient(4px 4px at var(--mouse-x) var(--mouse-y), rgba(255, 255, 255, 1), transparent),
            radial-gradient(4px 4px at calc(var(--mouse-x) + 40px) calc(var(--mouse-y) + 40px), rgba(147, 51, 234, 0.8), transparent),
            radial-gradient(4px 4px at calc(var(--mouse-x) - 40px) calc(var(--mouse-y) - 40px), rgba(236, 72, 153, 0.8), transparent),
            radial-gradient(4px 4px at calc(var(--mouse-x) + 80px) calc(var(--mouse-y) - 40px), rgba(59, 130, 246, 0.8), transparent),
            radial-gradient(4px 4px at calc(var(--mouse-x) - 80px) calc(var(--mouse-y) + 40px), rgba(255, 255, 255, 0.8), transparent)
          `,
        }}
      />
      
      {/* 装饰性光效 */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/2 w-24 h-24 bg-pink-500/30 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>
    </div>
  );
} 