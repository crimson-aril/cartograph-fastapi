"use client";

import {
  Canvas,
  extend,
  type ThreeElement,
  useThree,
} from "@react-three/fiber";
import { Component, useEffect, useMemo, useState, type ReactNode } from "react";
import * as THREE from "three/webgpu";
import { color, mix, positionLocal, smoothstep } from "three/tsl";

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshBasicNodeMaterial: ThreeElement<typeof THREE.MeshBasicNodeMaterial>;
  }
}

extend({ MeshBasicNodeMaterial: THREE.MeshBasicNodeMaterial });

type Palette = {
  line: string;
  muted: string;
  raised: string;
  accent: string;
};

const paletteProperties: Record<keyof Palette, string> = {
  line: "--line",
  muted: "--fg-muted",
  raised: "--raised",
  accent: "--accent",
};

const initialPalette: Palette = {
  line: "#2a2a2e",
  muted: "#8d8d96",
  raised: "#1d1d20",
  accent: "#4f8bff",
};

const panels = [
  { x: -4.25, y: 2.5, active: false, widths: [1.35, 2.02, 1.15] },
  { x: -4.25, y: 0, active: true, widths: [1.74, 1.3, 1.72] },
  { x: -4.25, y: -2.5, active: false, widths: [2.02, 1.48, 1.62] },
] as const;

const graphNodes = [
  [0.9, 2.4],
  [3, 2.75],
  [2.1, 0.35],
  [4.75, 0.7],
  [4, -1.8],
  [0.8, -2.5],
  [2.65, -2.55],
] as const;

const graphEdges = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
  [2, 4],
  [2, 5],
  [5, 6],
  [6, 4],
  [4, 3],
] as const;

const incomingRoutes = [
  {
    points: [[-2.9, 2.5], [-2, 2.5], [-2, 2.4], [0.57, 2.4]],
    active: false,
  },
  {
    points: [[-2.9, 0], [-2, 0], [-2, 0.35], [1.77, 0.35]],
    active: true,
  },
  {
    points: [[-2.9, -2.5], [-2, -2.5], [-2, -2.2], [-0.8, -2.2], [-0.8, -2.5], [0.47, -2.5]],
    active: false,
  },
] as const;

export function DependencyIllustration() {
  const [palette, setPalette] = useState(initialPalette);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    const refreshPalette = () => {
      const styles = getComputedStyle(document.documentElement);
      setPalette({
        line: styles.getPropertyValue(paletteProperties.line).trim(),
        muted: styles.getPropertyValue(paletteProperties.muted).trim(),
        raised: styles.getPropertyValue(paletteProperties.raised).trim(),
        accent: styles.getPropertyValue(paletteProperties.accent).trim(),
      });
    };

    refreshPalette();
    const themeObserver = new MutationObserver(refreshPalette);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
    systemTheme.addEventListener("change", refreshPalette);
    return () => {
      themeObserver.disconnect();
      systemTheme.removeEventListener("change", refreshPalette);
    };
  }, []);

  return (
    <div className="relative h-full min-h-72 w-full overflow-hidden">
      <FallbackIllustration className={rendered ? "hidden" : ""} />
      <StaticCanvasBoundary onError={() => setRendered(false)}>
        <Canvas
          className="pointer-events-none absolute inset-0 h-full w-full"
          gl={createRenderer}
          frameloop="demand"
          dpr={[1, 1.5]}
          orthographic
          camera={{
            position: [0, 0, 20],
            left: -6.4,
            right: 6.4,
            top: 4.45,
            bottom: -4.45,
          }}
          flat
          fallback={null}
          onCreated={() => setRendered(true)}
        >
          <CameraFit />
          <DependencyGraph palette={palette} />
        </Canvas>
      </StaticCanvasBoundary>
    </div>
  );
}

async function createRenderer(props: object) {
  const options = {
    ...(props as NonNullable<ConstructorParameters<typeof THREE.WebGPURenderer>[0]>),
    alpha: true,
    antialias: true,
  } as ConstructorParameters<typeof THREE.WebGPURenderer>[0];
  let webgpu: THREE.WebGPURenderer | null = null;

  try {
    webgpu = new THREE.WebGPURenderer(options);
    await webgpu.init();
    return webgpu;
  } catch (webgpuError) {
    await webgpu?.dispose().catch(() => undefined);

    const webgl2 = new THREE.WebGPURenderer({ ...options, forceWebGL: true });
    try {
      await webgl2.init();
      return webgl2;
    } catch (webgl2Error) {
      await webgl2.dispose().catch(() => undefined);
      console.warn("The landing illustration is using its static fallback.", {
        webgpuError,
        webgl2Error,
      });
      throw webgl2Error;
    }
  }
}

class StaticCanvasBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    this.props.onError();
    console.warn("The landing illustration is using its static fallback.", error);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function CameraFit() {
  const { camera, size } = useThree();

  useEffect(() => {
    if (!(camera instanceof THREE.OrthographicCamera)) return;
    const aspect = size.width / Math.max(size.height, 1);
    const height = Math.max(8.9, 11.4 / aspect);
    camera.left = -(height * aspect) / 2;
    camera.right = (height * aspect) / 2;
    camera.top = height / 2;
    camera.bottom = -height / 2;
    camera.updateProjectionMatrix();
  }, [camera, size.height, size.width]);

  return null;
}

function DependencyGraph({ palette }: { palette: Palette }) {
  return (
    <group>
      {incomingRoutes.map((route, index) => (
        <OrthogonalRoute
          key={`incoming-${index}`}
          points={route.points}
          color={route.active ? palette.accent : palette.line}
          opacity={route.active ? 0.88 : 0.78}
        />
      ))}

      {graphEdges.map(([from, to]) => {
        const [ax, ay] = graphNodes[from];
        const [bx, by] = graphNodes[to];
        const middleX = (ax + bx) / 2;
        const active = from === 0 && to === 2;
        return (
          <OrthogonalRoute
            key={`${from}-${to}`}
            points={[[ax + 0.32, ay], [middleX, ay], [middleX, by], [bx - 0.32, by]]}
            color={active ? palette.accent : palette.line}
            opacity={active ? 0.9 : 0.72}
          />
        );
      })}

      {panels.map((panel, index) => (
        <SourcePanel key={index} panel={panel} palette={palette} />
      ))}
      {graphNodes.map(([x, y], index) => (
        <GraphNode key={index} x={x} y={y} active={index === 2} palette={palette} />
      ))}
    </group>
  );
}

type RoutePoint = readonly [number, number];

function OrthogonalRoute({
  points,
  color: routeColor,
  opacity,
}: {
  points: readonly RoutePoint[];
  color: string;
  opacity: number;
}) {
  const segments = points.slice(1).map((point, index) => {
    const previous = points[index];
    const dx = point[0] - previous[0];
    const dy = point[1] - previous[1];
    const vertical = Math.abs(dy) > Math.abs(dx);
    return {
      x: (point[0] + previous[0]) / 2,
      y: (point[1] + previous[1]) / 2,
      length: Math.hypot(dx, dy),
      vertical,
    };
  });

  return (
    <group>
      {segments.map(({ x, y, length, vertical }, index) => (
        <mesh
          key={index}
          position={[x, y, -0.12]}
          rotation={[0, 0, vertical ? Math.PI / 2 : 0]}
          scale={[length, 1, 1]}
        >
          <boxGeometry args={[1, 0.022, 0.016]} />
          <meshBasicMaterial color={routeColor} transparent opacity={opacity} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function SourcePanel({
  panel,
  palette,
}: {
  panel: (typeof panels)[number];
  palette: Palette;
}) {
  return (
    <group position={[panel.x, panel.y, 0]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.76, 1.17, 0.14]} />
        <meshBasicMaterial color={palette.line} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, 0.075]}>
        <boxGeometry args={[2.66, 1.07, 0.07]} />
        <NodeSurface color={palette.raised} />
      </mesh>
      {panel.widths.map((width, index) => (
        <mesh
          key={index}
          position={[-0.94 + width / 2, 0.25 - index * 0.22, 0.12]}
        >
          <boxGeometry args={[width, 0.035, 0.012]} />
          <meshBasicMaterial
            color={panel.active && index === 2 ? palette.accent : palette.muted}
            transparent
            opacity={index === 1 ? 0.68 : 0.9}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function GraphNode({
  x,
  y,
  active,
  palette,
}: {
  x: number;
  y: number;
  active: boolean;
  palette: Palette;
}) {
  return (
    <group position={[x, y, 0]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.68, 0.68, 0.16]} />
        <meshBasicMaterial color={active ? palette.accent : palette.line} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, 0.09]}>
        <boxGeometry args={[0.56, 0.56, 0.08]} />
        <NodeSurface color={active ? palette.accent : palette.raised} />
      </mesh>
      <mesh position={[-0.08, 0.04, 0.14]}>
        <boxGeometry args={[0.2, 0.025, 0.012]} />
        <meshBasicMaterial
          color={active ? palette.accent : palette.muted}
          transparent
          opacity={active ? 0.95 : 0.8}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function NodeSurface({ color: surfaceColor }: { color: string }) {
  const colorNode = useMemo(
    () =>
      mix(
        color(surfaceColor).mul(0.88),
        color(surfaceColor),
        smoothstep(-0.48, 0.48, positionLocal.y),
      ),
    [surfaceColor],
  );

  return <meshBasicNodeMaterial colorNode={colorNode} toneMapped={false} />;
}

function FallbackIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={`absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 520 360"
      preserveAspectRatio="xMidYMid meet"
    >
      <g fill="none" stroke="var(--line)" strokeWidth="1">
        <rect x="34" y="54" width="134" height="48" />
        <rect x="34" y="156" width="134" height="48" />
        <rect x="34" y="258" width="134" height="48" />
        <path d="M168 78h54l40 52h54M168 180h94M168 282h54l40-52h54" />
        <path d="M316 130h46l40-46h64M316 130h84l42 50h24M262 180h112l48 74h44M316 230h46l42-50h24" />
        <rect x="432" y="68" width="24" height="24" />
        <rect x="466" y="118" width="24" height="24" />
        <rect x="466" y="168" width="24" height="24" />
        <rect x="466" y="242" width="24" height="24" />
        <rect x="432" y="242" width="24" height="24" />
        <rect x="398" y="242" width="24" height="24" />
      </g>
      <g fill="var(--raised)" stroke="var(--line)" strokeWidth="1">
        <rect x="34" y="54" width="134" height="48" />
        <rect x="34" y="156" width="134" height="48" />
        <rect x="34" y="258" width="134" height="48" />
        <rect x="432" y="68" width="24" height="24" />
        <rect x="466" y="118" width="24" height="24" />
        <rect x="466" y="168" width="24" height="24" />
        <rect x="466" y="242" width="24" height="24" />
        <rect x="432" y="242" width="24" height="24" />
        <rect x="398" y="242" width="24" height="24" />
      </g>
      <g stroke="var(--fg-muted)" strokeWidth="2">
        <path d="M50 72h58M50 82h86M50 174h74M50 184h52M50 276h86M50 286h64" />
      </g>
      <circle cx="316" cy="130" r="7" fill="var(--accent)" />
      <circle cx="262" cy="180" r="5" fill="var(--accent)" />
    </svg>
  );
}
