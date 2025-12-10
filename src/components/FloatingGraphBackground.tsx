// src/components/FloatingGraphBackground.tsx

export function FloatingGraphBackground() {
  // same nodes as before
  const nodes = [
    // main spine
    { cx: 80,  cy: 120, r: 4 },
    { cx: 260, cy: 80,  r: 5 },
    { cx: 460, cy: 140, r: 4.5 },
    { cx: 680, cy: 110, r: 5.5 },
    { cx: 900, cy: 180, r: 6 },

    // mid cluster
    { cx: 320, cy: 220, r: 4.5 },
    { cx: 520, cy: 260, r: 4.8 },
    { cx: 720, cy: 220, r: 4.3 },
    { cx: 220, cy: 260, r: 3.8 },
    { cx: 1040, cy: 90, r: 3.5 },
    { cx: 1040, cy: 260, r: 3.8 },

    // lower cloud
    { cx: 120, cy: 360, r: 4 },
    { cx: 260, cy: 320, r: 4.5 },
    { cx: 420, cy: 360, r: 4.2 },
    { cx: 620, cy: 340, r: 5 },
    { cx: 820, cy: 380, r: 4.4 },
    { cx: 340, cy: 420, r: 3.7 },
    { cx: 520, cy: 440, r: 4.1 },
    { cx: 720, cy: 420, r: 3.9 },

    // upper sprinkle
    { cx: 220, cy: 30,  r: 3.2 },
    { cx: 380, cy: 60,  r: 3.6 },
    { cx: 560, cy: 40,  r: 3.4 },
    { cx: 760, cy: 80,  r: 3.5 },
    { cx: 980, cy: 60,  r: 3.2 },

    // extra random nodes
    { cx: 160, cy: 180, r: 3 },
    { cx: 360, cy: 160, r: 3 },
    { cx: 600, cy: 200, r: 3 },
    { cx: 840, cy: 130, r: 3 },
    { cx: 960, cy: 230, r: 3 },
  ];

  const edges = [
    // main spine connections
    { x1: 80,  y1: 120, x2: 260, y2: 80  },
    { x1: 260, y1: 80,  x2: 460, y2: 140 },
    { x1: 460, y1: 140, x2: 680, y2: 110 },
    { x1: 680, y1: 110, x2: 900, y2: 180 },

    // extra reinforcement on spine (multi-links)
    { x1: 80,  y1: 120, x2: 460, y2: 140 },
    { x1: 260, y1: 80,  x2: 680, y2: 110 },
    { x1: 460, y1: 140, x2: 900, y2: 180 },

    // mid cluster ties to spine
    { x1: 260, y1: 80,  x2: 320, y2: 220 },
    { x1: 460, y1: 140, x2: 320, y2: 220 },
    { x1: 460, y1: 140, x2: 520, y2: 260 },
    { x1: 680, y1: 110, x2: 520, y2: 260 },
    { x1: 680, y1: 110, x2: 720, y2: 220 },
    { x1: 900, y1: 180, x2: 720, y2: 220 },

    // cross links mid
    { x1: 80,  y1: 120, x2: 320, y2: 220 },
    { x1: 80,  y1: 120, x2: 220, y2: 260 },
    { x1: 220, y1: 260, x2: 460, y2: 140 },
    { x1: 320, y1: 220, x2: 720, y2: 220 },
    { x1: 520, y1: 260, x2: 900, y2: 180 },

    // hook into far-right mid nodes
    { x1: 680,  y1: 110, x2: 1040, y2: 90  },
    { x1: 720,  y1: 220, x2: 1040, y2: 260 },
    { x1: 900,  y1: 180, x2: 1040, y2: 90  },
    { x1: 900,  y1: 180, x2: 1040, y2: 260 },

    // lower cloud backbone
    { x1: 120, y1: 360, x2: 260, y2: 320 },
    { x1: 260, y1: 320, x2: 420, y2: 360 },
    { x1: 420, y1: 360, x2: 620, y2: 340 },
    { x1: 620, y1: 340, x2: 820, y2: 380 },

    // lower cloud cross links
    { x1: 260, y1: 320, x2: 340, y2: 420 },
    { x1: 340, y1: 420, x2: 520, y2: 440 },
    { x1: 520, y1: 440, x2: 720, y2: 420 },
    { x1: 120, y1: 360, x2: 420, y2: 360 },
    { x1: 260, y1: 320, x2: 620, y2: 340 },
    { x1: 420, y1: 360, x2: 820, y2: 380 },
    { x1: 620, y1: 340, x2: 720, y2: 420 },

    // link mid cluster to lower cloud
    { x1: 320, y1: 220, x2: 260, y2: 320 },
    { x1: 520, y1: 260, x2: 420, y2: 360 },
    { x1: 720, y1: 220, x2: 620, y2: 340 },
    { x1: 220, y1: 260, x2: 120, y2: 360 },

    // upper sprinkle backbone
    { x1: 220, y1: 30,  x2: 380, y2: 60  },
    { x1: 380, y1: 60,  x2: 560, y2: 40  },
    { x1: 560, y1: 40,  x2: 760, y2: 80  },
    { x1: 760, y1: 80,  x2: 980, y2: 60  },

    // upper sprinkle cross links
    { x1: 220, y1: 30,  x2: 460, y2: 140 },
    { x1: 380, y1: 60,  x2: 680, y2: 110 },
    { x1: 560, y1: 40,  x2: 900, y2: 180 },
    { x1: 760, y1: 80,  x2: 900, y2: 180 },
    { x1: 980, y1: 60,  x2: 1040, y2: 90  },

    // extra random nodes connections (to increase degree)
    { x1: 160, y1: 180, x2: 80,  y2: 120 },
    { x1: 160, y1: 180, x2: 260, y2: 80  },
    { x1: 360, y1: 160, x2: 260, y2: 80  },
    { x1: 360, y1: 160, x2: 460, y2: 140 },
    { x1: 600, y1: 200, x2: 460, y2: 140 },
    { x1: 600, y1: 200, x2: 680, y2: 110 },
    { x1: 840, y1: 130, x2: 680, y2: 110 },
    { x1: 840, y1: 130, x2: 900, y2: 180 },
    { x1: 960, y1: 230, x2: 900, y2: 180 },
    { x1: 960, y1: 230, x2: 1040, y2: 260 },

    // tie upper sprinkle down to lower cloud to close shapes
    { x1: 380, y1: 60,  x2: 260, y2: 320 },
    { x1: 560, y1: 40,  x2: 420, y2: 360 },
    { x1: 760, y1: 80,  x2: 620, y2: 340 },
    { x1: 980, y1: 60,  x2: 820, y2: 380 },
  ];

  // path the tracer will follow (goes through a bunch of key nodes)
  const tracerPathD =
    "M 80 120 " +   // left spine node
    "L 260 80 " +
    "L 460 140 " +
    "L 680 110 " +
    "L 900 180 " +
    "L 720 220 " +
    "L 520 260 " +
    "L 320 220 " +
    "L 220 260 " +
    "L 120 360 " +
    "L 260 320 " +
    "L 420 360 " +
    "L 620 340 " +
    "L 820 380 " +
    "L 1040 260";

  return (
    <div className="pointer-events-none absolute inset-0 select-none">
      <svg
        className="w-full h-full opacity-60"
        viewBox="0 0 1200 500"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g className="graph-layer-main">
          {/* Tracer path base (very subtle line) */}
          <path d={tracerPathD} className="graph-trace-path" />

          {/* Glowing moving segment */}
          <path d={tracerPathD} className="graph-trace-segment" />

          {/* Edges */}
          {edges.map((e, i) => (
            <line
              key={`edge-${i}`}
              x1={e.x1}
              y1={e.y1}
              x2={e.x2}
              y2={e.y2}
              className={`graph-edge ${i < 12 ? "graph-edge-strong" : ""}`}
            />
          ))}

          {/* Nodes */}
          {nodes.map((n, i) => (
            <circle
              key={`node-${i}`}
              cx={n.cx}
              cy={n.cy}
              r={n.r}
              className={`graph-node ${i < 10 ? "graph-node-strong" : ""}`}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
