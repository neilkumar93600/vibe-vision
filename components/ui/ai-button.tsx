import React, { useEffect, useMemo, useState } from "react";
import { Music2, Sparkle } from "lucide-react";
import { Engine } from "@tsparticles/engine";
import { loadFull } from "tsparticles";
import { Particles } from "@tsparticles/react";

// Define the type for our particle options
interface ISourceOptions {
  key: string;
  name: string;
  particles: any;
  interactivity: any;
  smooth: boolean;
  fpsLimit: number;
  background: any;
  fullScreen: any;
  detectRetina: boolean;
  absorbers: any[];
  emitters: any[];
  autoPlay?: boolean;
}

const particleOptions: ISourceOptions = {
  key: "star",
  name: "Star",
  particles: {
    number: {
      value: 20,
      density: { enable: false }
    },
    color: {
      value: ["#7c3aed", "#bae6fd", "#a78bfa", "#93c5fd", "#0284c7", "#fafafa", "#38bdf8"]
    },
    shape: {
      type: "star",
      options: { star: { sides: 4 } }
    },
    opacity: { value: 0.8 },
    size: { value: { min: 1, max: 4 } },
    rotate: {
      value: { min: 0, max: 360 },
      enable: true,
      direction: "clockwise",
      animation: {
        enable: true,
        speed: 10,
        sync: false
      }
    },
    links: { enable: false },
    reduceDuplicates: true,
    move: {
      enable: true,
      center: { x: 120, y: 45 }
    }
  },
  interactivity: { events: {} },
  smooth: true,
  fpsLimit: 120,
  background: {
    color: "transparent",
    size: "cover"
  },
  fullScreen: { enable: false },
  detectRetina: true,
  absorbers: [{
    enable: true,
    opacity: 0,
    size: {
      value: 1,
      density: 1,
      limit: { radius: 5, mass: 5 }
    },
    position: { x: 110, y: 45 }
  }],
  emitters: [{
    autoPlay: true,
    fill: true,
    life: { wait: true },
    rate: {
      quantity: 5,
      delay: 0.5
    },
    position: { x: 110, y: 45 }
  }]
};

interface AnimatedGenerateButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export const AnimatedGenerateButton: React.FC<AnimatedGenerateButtonProps> = ({ onClick, isLoading }) => {
  const [particleState, setParticlesReady] = useState<"loaded" | "ready">();
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const initParticles = async () => {
      const engine = new Engine();
      await loadFull(engine);
      setParticlesReady("loaded");
    };

    initParticles();
  }, []);

  const modifiedOptions = useMemo(() => {
    return {
      ...particleOptions,
      autoPlay: isHovering || isLoading
    };
  }, [isHovering, isLoading]);

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="group relative my-8 w-full rounded-full bg-gradient-to-r from-blue-300/30 via-blue-500/30 via-40% to-purple-500/30 p-1 text-white transition-transform hover:scale-105 active:scale-100 disabled:cursor-not-allowed disabled:opacity-70"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-300 via-blue-500 via-40% to-purple-500 px-4 py-2 text-white">
        {isLoading ? (
          <>
            <div className="animate-spin">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            </div>
            <span className="font-semibold">Generating...</span>
          </>
        ) : (
          <>
            <Sparkle className="size-6 -translate-y-0.5 animate-sparkle fill-white" />
            <Sparkle
              style={{ animationDelay: "1s" }}
              className="absolute bottom-2.5 left-3.5 z-20 size-2 rotate-12 animate-sparkle fill-white"
            />
            <Sparkle
              style={{
                animationDelay: "1.5s",
                animationDuration: "2.5s"
              }}
              className="absolute left-5 top-2.5 size-1 -rotate-12 animate-sparkle fill-white"
            />
            <Sparkle
              style={{
                animationDelay: "0.5s",
                animationDuration: "2.5s"
              }}
              className="absolute left-3 top-3 size-1.5 animate-sparkle fill-white"
            />
            <Music2 className="mr-2" />
            <span className="font-semibold">Generate Song</span>
          </>
        )}
      </div>
      {!!particleState && (
        <Particles
          id="generate-button-particles"
          className={`pointer-events-none absolute -bottom-4 -left-4 -right-4 -top-4 z-0 opacity-0 transition-opacity ${
            particleState === "ready" ? "group-hover:opacity-100" : ""
          } ${isLoading ? "opacity-100" : ""}`}
          particlesLoaded={async () => {
            setParticlesReady("ready");
          }}
          options={modifiedOptions}
        />
      )}
    </button>
  );
};

export default AnimatedGenerateButton;