"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

export default function AdvancedVibeVisionLoading({ 
    onLoadComplete,
    customIcons = [],
    customColors = {},
    loadingTexts = [],
    particleCount = 150,
    animationIntensity = 'medium'
}: { 
    onLoadComplete?: () => void,
    customIcons?: string[],
    customColors?: {
        background?: string,
        text?: string,
        progressBar?: string,
        icons?: string,
        particles?: string
    },
    loadingTexts?: string[],
    particleCount?: number,
    animationIntensity?: 'low' | 'medium' | 'high'
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);
    const [iconsVisible, setIconsVisible] = useState(false);
    const [particleSystem, setParticleSystem] = useState<any[]>([]);
    const [currentLoadingText, setCurrentLoadingText] = useState('');

    // Enhanced default configurations
    const defaultColors = {
        background: 'bg-gradient-to-br from-[#1a0b2e] via-[#2c0f4a] to-[#4a154b]',
        text: 'text-[#e0e0ff]',
        progressBar: 'bg-[#bb86fc]',
        icons: 'text-[#03dac6]',
        particles: 'rgba(187, 134, 252, 0.5)'
    };

    const mergedColors = { ...defaultColors, ...customColors };

    // Enhanced dynamic loading texts
    const defaultLoadingTexts = [
        "Initializing Vibe Vision...",
        "Calibrating cosmic energies...",
        "Syncing quantum frequencies...",
        "Unlocking dimensional portals...",
        "Generating creative spark..."
    ];

    const letters = "VIBE VISION".split("");
    const defaultIcons = [
        "mdi:ghost-outline",
        "mdi:alien",
        "mdi:robot-confused", 
        "mdi:fire",
        "mdi:lightning-bolt-outline",
        "mdi:water-alert",
        "mdi:earth-box"
    ];

    const icons = customIcons.length > 0 ? customIcons : defaultIcons;
    const loadingTextOptions = loadingTexts.length > 0 ? loadingTexts : defaultLoadingTexts;

    // Advanced particle system with more dynamic behavior
    const createParticle = () => {
        const animationMultiplier = {
            low: 1,
            medium: 2,
            high: 3
        }[animationIntensity];

        return {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: Math.random() * 4 + 1,
            speedX: (Math.random() - 0.5) * 3 * animationMultiplier,
            speedY: (Math.random() - 0.5) * 3 * animationMultiplier,
            opacity: Math.random(),
            color: mergedColors.particles
        };
    };

    useEffect(() => {
        // Cycle through loading texts
        const textInterval = setInterval(() => {
            const randomText = loadingTextOptions[Math.floor(Math.random() * loadingTextOptions.length)];
            setCurrentLoadingText(randomText);
        }, 2000);

        // Initialize particle system with dynamic count
        const initialParticles = Array.from({ length: particleCount }, createParticle);
        setParticleSystem(initialParticles);

        const tl = gsap.timeline({
            onComplete: () => {
                if (onLoadComplete) {
                    onLoadComplete();
                }
            }
        });

        const container = containerRef.current;
        const progressBar = progressRef.current;

        if (!container || !progressBar) return;

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const letterElements = container.querySelectorAll(".letter");
        const iconElements = container.querySelectorAll(".vibe-icon");

        const updateProgress = (progress: number) => {
            const progressValue = Math.round(progress * 100);
            setProgress(progressValue);
        };

        // Enhanced particle animation with more complex movement
        const updateParticles = () => {
            setParticleSystem(prevParticles => 
                prevParticles.map(particle => {
                    let newX = particle.x + particle.speedX;
                    let newY = particle.y + particle.speedY;

                    // More dynamic screen wrapping with slight randomness
                    if (newX < 0) newX = windowWidth + Math.random() * 100;
                    if (newX > windowWidth) newX = -Math.random() * 100;
                    if (newY < 0) newY = windowHeight + Math.random() * 100;
                    if (newY > windowHeight) newY = -Math.random() * 100;

                    return { 
                        ...particle, 
                        x: newX, 
                        y: newY,
                        opacity: Math.min(1, Math.max(0.1, particle.opacity + (Math.random() - 0.5) * 0.1))
                    };
                })
            );
        };

        const particleInterval = setInterval(updateParticles, 50);

        // Enhanced letter animation with walking towards center effect
        tl.fromTo(letterElements, {
            opacity: 0,
            scale: 0.5,
            x: (index) => {
                // Distribute letters from different screen edges
                const screenSides = [
                    { x: -windowWidth, y: windowHeight/2 },
                    { x: windowWidth, y: windowHeight/2 },
                    { x: windowWidth/2, y: -windowHeight },
                    { x: windowWidth/2, y: windowHeight },
                    { x: -windowWidth/2, y: -windowHeight/2 },
                    { x: -windowWidth/2, y: windowHeight/2 }
                ];
                const side = screenSides[index % screenSides.length];
                return side.x;
            },
            y: (index) => {
                const screenSides = [
                    { x: -windowWidth, y: windowHeight/2 },
                    { x: windowWidth, y: windowHeight/2 },
                    { x: windowWidth/2, y: -windowHeight },
                    { x: windowWidth/2, y: windowHeight },
                    { x: -windowWidth/2, y: -windowHeight/2 },
                    { x: -windowWidth/2, y: windowHeight/2 }
                ];
                const side = screenSides[index % screenSides.length];
                return side.y;
            },
            rotation: (index) => (index % 2 === 0 ? -360 : 360),
            skew: 30,
            transformOrigin: "center center",
            onStart: () => {
                letterElements.forEach((el, index) => {
                    // Add subtle walking motion
                    gsap.to(el, {
                        rotation: `+=${index % 2 === 0 ? -5 : 5}`,
                        x: `+=${index % 2 === 0 ? -5 : 5}`,
                        duration: 0.1,
                        repeat: -1,
                        yoyo: true,
                        ease: "power1.inOut"
                    });
                });
            }
        }, {
            duration: 3, // Increased duration for more walking-like effect
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
            rotation: 0,
            skew: 0,
            stagger: {
                each: 0.15, // Slightly staggered to create walking sequence
                from: "random" // Random starting point for more organic movement
            },
            ease: "power2.inOut", // Smoother, more controlled easing
            onComplete: () => {
                letterElements.forEach(el => {
                    gsap.killTweensOf(el);
                    gsap.to(el, { rotation: 0, x: 0, duration: 0.3 });
                });
            }
        });

        // More dynamic progress bar
        tl.to(progressBar, {
            width: '100%',
            duration: 2,
            ease: "power1.inOut",
            onUpdate: function() {
                updateProgress(this.progress());
            }
        });

        // Enhanced icon emergence
        tl.add(() => {
            setIconsVisible(true);
        });

        tl.fromTo(iconElements, {
            opacity: 0,
            scale: 0,
            rotation: -540,
            x: (index) => (index % 2 === 0 ? -300 : 300),
            y: (index) => (index % 2 === 0 ? 300 : -300),
            filter: 'blur(20px)',
            transformOrigin: "center center"
        }, {
            opacity: 1,
            scale: 1,
            rotation: 0,
            x: 0,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.5,
            stagger: 0.3,
            ease: "back.out(2)"
        });

        return () => {
            tl.kill();
            clearInterval(particleInterval);
            clearInterval(textInterval);
        };
    }, [onLoadComplete, customIcons, particleCount, animationIntensity]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            ref={containerRef}
            className={`fixed inset-0 flex flex-col items-center justify-center ${mergedColors.background} ${mergedColors.text} z-50 overflow-hidden`}
        >
            {/* Advanced Particle Background */}
            <div className="absolute inset-0 pointer-events-none">
                {particleSystem.map((particle, index) => (
                    <div 
                        key={index}
                        style={{
                            position: 'absolute',
                            left: `${particle.x}px`,
                            top: `${particle.y}px`,
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                            backgroundColor: particle.color,
                            borderRadius: '50%',
                            opacity: particle.opacity,
                            boxShadow: '0 0 5px rgba(187, 134, 252, 0.3)'
                        }}
                    />
                ))}
            </div>

            <div className="flex absolute">
                {letters.map((letter, index) => (
                    <motion.div
                        key={index}
                        initial={{ 
                            opacity: 0, 
                            scale: 0.5,
                            x: index % 2 === 0 ? -100 : 100, // Offset for walking effect
                            rotate: index % 2 === 0 ? -15 : 15 // Slight initial rotation
                        }}
                        animate={{ 
                            opacity: 1, 
                            scale: 1,
                            x: 0,
                            rotate: 0
                        }}
                        transition={{ 
                            delay: index * 0.1, 
                            type: "spring", 
                            stiffness: 250,
                            damping: 10
                        }}
                        className={`letter text-7xl font-bold transform text-[#bb86fc] drop-shadow-[0_0_10px_rgba(187,134,252,0.7)]`}
                    >
                        {letter === " " ? "\u00A0" : letter}
                    </motion.div>
                ))}
            </div>

            <div className="icon-container flex space-x-6 mb-8">
                {icons.map((icon, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ 
                            opacity: iconsVisible ? 1 : 0, 
                            scale: iconsVisible ? 1 : 0 
                        }}
                        transition={{ 
                            delay: index * 0.3, 
                            type: "spring", 
                            stiffness: 300 
                        }}
                    >
                        <Icon
                            icon={icon}
                            className={`vibe-icon text-5xl ${mergedColors.icons} drop-shadow-[0_0_8px_rgba(3,218,198,0.7)]`}
                        />
                    </motion.div>
                ))}
            </div>

            <div className={`w-72 bg-[#4a4a4a] h-3 rounded-full overflow-hidden mt-16`}>
                <div
                    ref={progressRef}
                    className={`${mergedColors.progressBar} h-full w-0`}
                />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="mt-4 text-2xl text-center px-4"
            >
                {currentLoadingText || `Loading... ${progress}%`}
            </motion.div>
        </motion.div>
    );
}