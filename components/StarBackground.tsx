"use client";

import { useEffect, useRef, useCallback, useState } from "react";

interface Star {
    x: number;
    y: number;
    baseX: number;
    baseY: number;
    size: number;
    opacity: number;
    twinkleSpeed: number;
    twinkleOffset: number;
}

interface MousePos {
    x: number;
    y: number;
}

const MOBILE_BREAKPOINT = 768;

export default function StarBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const starsRef = useRef<Star[]>([]);
    const mouseRef = useRef<MousePos>({ x: -1000, y: -1000 });
    const animationFrameRef = useRef<number>(0);
    const isMobileRef = useRef<boolean>(false);

    const STAR_COUNT = 200;
    const INTERACTION_RADIUS = 150;
    const REPEL_STRENGTH = 0.15;
    const RETURN_SPEED = 0.05;
    const CONNECTION_DISTANCE = 80;

    const initStars = useCallback((width: number, height: number) => {
        const stars: Star[] = [];
        for (let i = 0; i < STAR_COUNT; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            stars.push({
                x,
                y,
                baseX: x,
                baseY: y,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.5 + 0.3,
                twinkleSpeed: Math.random() * 0.02 + 0.01,
                twinkleOffset: Math.random() * Math.PI * 2,
            });
        }
        starsRef.current = stars;
    }, []);

    const drawStar = useCallback(
        (ctx: CanvasRenderingContext2D, star: Star, mouseX: number, mouseY: number, time: number) => {
            // Calculate distance to cursor for proximity glow
            const distToCursor = Math.hypot(star.x - mouseX, star.y - mouseY);
            const proximityRadius = 120;
            const proximityBoost = distToCursor < proximityRadius
                ? (1 - distToCursor / proximityRadius) * 0.8
                : 0;

            // Mobile breathing effect - each star breathes at its own random pace
            let breathMultiplier = 1;
            let sizeMultiplier = 1;
            if (isMobileRef.current) {
                // Each star has unique fast breathing speed (~1-3 second cycles)
                // Faster base speed + random variation per star
                const starBreathSpeed = 0.002 + star.twinkleSpeed * 0.003;
                const breathCycle = Math.sin(time * starBreathSpeed + star.twinkleOffset);

                // Strong opacity variation (0.4 to 1.2 range) for visible effect
                breathMultiplier = 0.8 + breathCycle * 0.4;

                // Glow size also pulses noticeably
                sizeMultiplier = 1 + breathCycle * 0.3;
            }

            // Base glow + proximity boost + mobile breathing
            const glowOpacity = ((star.opacity * 0.6) + proximityBoost) * breathMultiplier;
            const glowSize = star.size * (4 + proximityBoost * 2) * sizeMultiplier;

            // Draw outer neon glow
            const gradient = ctx.createRadialGradient(
                star.x,
                star.y,
                0,
                star.x,
                star.y,
                glowSize
            );
            gradient.addColorStop(0, `rgba(212, 175, 55, ${Math.min(glowOpacity * 0.8, 1)})`);
            gradient.addColorStop(0.3, `rgba(212, 175, 55, ${Math.min(glowOpacity * 0.4, 0.8)})`);
            gradient.addColorStop(0.6, `rgba(180, 140, 40, ${Math.min(glowOpacity * 0.2, 0.5)})`);
            gradient.addColorStop(1, "rgba(180, 140, 40, 0)");

            ctx.beginPath();
            ctx.arc(star.x, star.y, glowSize, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            // Draw core with soft white-gold
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 245, 220, ${Math.min(glowOpacity + 0.2, 1)})`;
            ctx.fill();
        },
        []
    );

    const drawConnections = useCallback(
        (ctx: CanvasRenderingContext2D, stars: Star[]) => {
            const mouse = mouseRef.current;

            for (let i = 0; i < stars.length; i++) {
                const star = stars[i];
                const distToMouse = Math.hypot(star.x - mouse.x, star.y - mouse.y);

                if (distToMouse < INTERACTION_RADIUS) {
                    // Connect nearby stars to each other when cursor is close
                    for (let j = i + 1; j < stars.length; j++) {
                        const otherStar = stars[j];
                        const distBetween = Math.hypot(
                            star.x - otherStar.x,
                            star.y - otherStar.y
                        );
                        const otherDistToMouse = Math.hypot(
                            otherStar.x - mouse.x,
                            otherStar.y - mouse.y
                        );

                        if (
                            distBetween < CONNECTION_DISTANCE &&
                            otherDistToMouse < INTERACTION_RADIUS
                        ) {
                            const opacity =
                                (1 - distBetween / CONNECTION_DISTANCE) *
                                (1 - distToMouse / INTERACTION_RADIUS) *
                                0.4;

                            ctx.beginPath();
                            ctx.moveTo(star.x, star.y);
                            ctx.lineTo(otherStar.x, otherStar.y);
                            ctx.strokeStyle = `rgba(212, 175, 55, ${opacity})`;
                            ctx.lineWidth = 0.5;
                            ctx.stroke();
                        }
                    }
                }
            }
        },
        []
    );

    const updateStarPositions = useCallback((stars: Star[]) => {
        const mouse = mouseRef.current;

        stars.forEach((star) => {
            const dx = star.x - mouse.x;
            const dy = star.y - mouse.y;
            const distance = Math.hypot(dx, dy);

            if (distance < INTERACTION_RADIUS && distance > 0) {
                // Repel from cursor
                const force = (INTERACTION_RADIUS - distance) / INTERACTION_RADIUS;
                const angle = Math.atan2(dy, dx);
                star.x += Math.cos(angle) * force * REPEL_STRENGTH * 10;
                star.y += Math.sin(angle) * force * REPEL_STRENGTH * 10;
            }

            // Return to base position
            star.x += (star.baseX - star.x) * RETURN_SPEED;
            star.y += (star.baseY - star.y) * RETURN_SPEED;
        });
    }, []);

    const animate = useCallback(
        (ctx: CanvasRenderingContext2D, width: number, height: number) => {
            const render = (time: number) => {
                ctx.clearRect(0, 0, width, height);

                // Update mobile detection on each frame
                isMobileRef.current = window.innerWidth < MOBILE_BREAKPOINT;

                const stars = starsRef.current;
                updateStarPositions(stars);
                drawConnections(ctx, stars);

                const mouse = mouseRef.current;
                stars.forEach((star) => {
                    drawStar(ctx, star, mouse.x, mouse.y, time);
                });

                animationFrameRef.current = requestAnimationFrame(render);
            };

            animationFrameRef.current = requestAnimationFrame(render);
        },
        [drawStar, drawConnections, updateStarPositions]
    );

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStars(canvas.width, canvas.height);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        const handleMouseLeave = () => {
            mouseRef.current = { x: -1000, y: -1000 };
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseleave", handleMouseLeave);

        animate(ctx, canvas.width, canvas.height);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseleave", handleMouseLeave);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [initStars, animate]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 0 }}
            aria-hidden="true"
        />
    );
}
