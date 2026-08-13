type Dash = { x: number; y: number; w: number; r: number; lime?: boolean }

export function DashRects({
  dashes,
  height,
  opacity,
}: {
  dashes: Dash[]
  height: number
  opacity?: number
}) {
  return (
    <>
      {dashes.map((dash) => (
        <rect
          key={`${dash.x}-${dash.y}`}
          x={dash.x}
          y={dash.y}
          width={dash.w}
          height={height}
          rx={height / 2}
          fill={dash.lime ? '#B6BF00' : '#FFFFFF'}
          opacity={opacity}
          transform={
            dash.r ? `rotate(${dash.r} ${dash.x + dash.w / 2} ${dash.y + height / 2})` : undefined
          }
        />
      ))}
    </>
  )
}

const DASHES = [
  { x: 60, y: 40, w: 96, r: 24 },
  { x: 230, y: 20, w: 60, r: 0, lime: true },
  { x: 360, y: 60, w: 96, r: -24 },
  { x: 510, y: 30, w: 60, r: 90, lime: true },
  { x: 30, y: 200, w: 60, r: 90, lime: true },
  { x: 170, y: 190, w: 96, r: 0 },
  { x: 340, y: 210, w: 96, r: 24, lime: true },
  { x: 500, y: 200, w: 60, r: -24 },
  { x: 80, y: 380, w: 96, r: -24 },
  { x: 250, y: 400, w: 60, r: 90, lime: true },
  { x: 390, y: 380, w: 96, r: 0 },
  { x: 540, y: 370, w: 60, r: 24, lime: true },
  { x: 150, y: 510, w: 60, r: -24, lime: true },
  { x: 320, y: 520, w: 96, r: 24 },
]

export function DashPattern({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={className}>
      <svg focusable="false" className="h-full w-full">
        <defs>
          <pattern id="orchard-dashes" patternUnits="userSpaceOnUse" width="620" height="560">
            <DashRects dashes={DASHES} height={20} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#orchard-dashes)" />
      </svg>
    </div>
  )
}

const RULE_TONES = {
  'brand-deep': '#00655C',
  lime: '#B6BF00',
}

export function DashRule({
  className,
  flip = false,
  tone = 'brand-deep',
}: {
  className?: string
  flip?: boolean
  tone?: keyof typeof RULE_TONES
}) {
  return (
    <svg
      aria-hidden="true"
      width="64"
      height="18"
      viewBox="0 0 64 18"
      focusable="false"
      className={className}
    >
      <rect
        x={flip ? 28 : 0}
        y="4"
        width="34"
        height="10"
        rx="5"
        fill="#00877C"
        transform={flip ? undefined : 'rotate(0 17 9)'}
      />
      <rect
        x={flip ? 0 : 42}
        y="4"
        width="20"
        height="10"
        rx="5"
        fill={RULE_TONES[tone]}
        transform={`rotate(${flip ? -24 : 24} ${flip ? 10 : 52} 9)`}
      />
    </svg>
  )
}
