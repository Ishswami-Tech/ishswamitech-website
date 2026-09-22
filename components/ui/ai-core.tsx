import { cn } from "@/lib/utils";

const CENTER = 200;

/** Ring radius, how many nodes sit on it, the angle it starts at, and seconds
 *  per revolution. Negative duration is handled by the reverse class. */
const RINGS = [
  { r: 78, nodes: 3, offset: 0, spin: 26, reverse: false },
  { r: 124, nodes: 4, offset: 38, spin: 38, reverse: true },
  { r: 170, nodes: 5, offset: 18, spin: 52, reverse: false },
] as const;

function polar(radius: number, degrees: number) {
  const rad = (degrees * Math.PI) / 180;
  return { x: CENTER + radius * Math.cos(rad), y: CENTER + radius * Math.sin(rad) };
}

/**
 * The animated mark in the hero's right-hand space.
 *
 * Drawn rather than photographed, for three reasons: it can use the brand ramp
 * exactly instead of whatever hue a stock render happened to be lit with, it
 * costs about 4KB against 50KB for the photograph, and it can actually move.
 *
 * Every animation here is a CSS keyframe on `transform`, `opacity` or
 * `stroke-dashoffset`, so the whole thing composites and needs no JavaScript —
 * which is why this stays a server component. The reduced-motion rules live
 * beside the keyframes in globals.css and stop the rotation without hiding the
 * artwork, so the composition still reads when it is still.
 *
 * `aria-hidden` throughout: it carries no information the headline beside it
 * doesn't already state.
 */
export function AiCore({ className }: { className?: string }) {
  return (
    <div className={cn("ai-core pointer-events-none select-none", className)} aria-hidden>
      <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="ai-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--indigo-400)" stopOpacity="0.5" />
            <stop offset="45%" stopColor="var(--violet-500)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="var(--violet-500)" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="ai-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--indigo-400)" stopOpacity="0.85" />
            <stop offset="55%" stopColor="var(--violet-400)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--cyan-400)" stopOpacity="0.1" />
          </linearGradient>

          <linearGradient id="ai-chip" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4f6bff" />
            <stop offset="55%" stopColor="var(--indigo-500)" />
            <stop offset="100%" stopColor="var(--violet-500)" />
          </linearGradient>

          {/* One blur, reused. Each additional filter region is a separate
              offscreen buffer, which is the expensive part of SVG filters. */}
          <filter id="ai-soft" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>

        {/* Ambient bloom behind everything. */}
        <circle cx={CENTER} cy={CENTER} r="190" fill="url(#ai-glow)" className="ai-breathe" />

        {RINGS.map((ring, ringIndex) => {
          const nodes = Array.from({ length: ring.nodes }, (_, i) => {
            const angle = ring.offset + (360 / ring.nodes) * i;
            return { angle, ...polar(ring.r, angle) };
          });

          return (
            <g
              key={ring.r}
              className={cn("ai-ring", ring.reverse && "ai-ring--reverse")}
              style={{
                transformOrigin: `${CENTER}px ${CENTER}px`,
                animationDuration: `${ring.spin}s`,
              }}
            >
              <circle
                cx={CENTER}
                cy={CENTER}
                r={ring.r}
                stroke="url(#ai-ring)"
                strokeWidth="1"
                strokeDasharray="3 9"
                opacity={0.7 - ringIndex * 0.12}
              />

              {nodes.map((node) => (
                <g key={node.angle}>
                  {/* Spoke back to the core, with a pulse running down it. The
                      dash pattern is longer than the spoke so only one pulse is
                      ever in flight per node. */}
                  <line
                    x1={CENTER}
                    y1={CENTER}
                    x2={node.x}
                    y2={node.y}
                    stroke="var(--indigo-400)"
                    strokeWidth="1"
                    strokeOpacity="0.1"
                  />
                  <line
                    x1={CENTER}
                    y1={CENTER}
                    x2={node.x}
                    y2={node.y}
                    stroke="var(--cyan-300)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className="ai-signal"
                    style={{
                      strokeDasharray: `14 ${ring.r}`,
                      animationDelay: `${(node.angle / 360) * 3 + ringIndex * 0.6}s`,
                    }}
                  />

                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={4.5 - ringIndex * 0.6}
                    fill="var(--indigo-400)"
                    className="ai-node"
                    style={{ animationDelay: `${(node.angle / 360) * 2.4}s` }}
                  />
                  {/* Counter-rotated halo: without this the glow inherits the
                      ring's spin and smears into an arc on slower GPUs. */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={9 - ringIndex}
                    fill="var(--violet-400)"
                    opacity="0.18"
                    filter="url(#ai-soft)"
                  />
                </g>
              ))}
            </g>
          );
        })}

        {/* Core. Sits outside the rotating groups so it stays square to the
            viewport while everything orbits it. */}
        <g className="ai-breathe" style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}>
          <rect
            x={CENTER - 34}
            y={CENTER - 34}
            width="68"
            height="68"
            rx="18"
            fill="url(#ai-chip)"
            opacity="0.92"
          />
          <rect
            x={CENTER - 34}
            y={CENTER - 34}
            width="68"
            height="68"
            rx="18"
            stroke="var(--cyan-300)"
            strokeOpacity="0.45"
            strokeWidth="1"
          />
          {/* Chip legs, four sides. */}
          {[0, 90, 180, 270].map((angle) => (
            <g key={angle} transform={`rotate(${angle} ${CENTER} ${CENTER})`}>
              {[-14, 0, 14].map((offset) => (
                <line
                  key={offset}
                  x1={CENTER + offset}
                  y1={CENTER - 34}
                  x2={CENTER + offset}
                  y2={CENTER - 46}
                  stroke="var(--indigo-400)"
                  strokeOpacity="0.55"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              ))}
            </g>
          ))}
          <text
            x={CENTER}
            y={CENTER + 7}
            textAnchor="middle"
            fill="#ffffff"
            fillOpacity="0.95"
            fontSize="21"
            fontWeight="600"
            letterSpacing="0.06em"
            fontFamily="var(--font-display-stack)"
          >
            AI
          </text>
        </g>
      </svg>
    </div>
  );
}
