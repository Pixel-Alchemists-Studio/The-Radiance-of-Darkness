import { CSSProperties, useState } from 'react';

interface BookModel3DProps {
  frontSrc: string;
  backSrc: string;
  spineSrc: string;
  width?: number;
  height?: number;
  depth?: number;
  className?: string;
}

/**
 * BookModel3D — pure CSS 3D book mockup with realistic lighting.
 *
 * The cuboid is built with 6 absolutely-centered faces. Each face starts at
 * the parent's center (top:50%, left:50%, translate(-50%,-50%)) so the
 * rotations and translateZ values are relative to the cuboid's center.
 *
 * Realism touches:
 *  - Light gradient on top of every face (top-left highlight, bottom-right shadow)
 *    to simulate a single overhead light source.
 *  - Spine-side shadow band on front + back covers (where the cover meets the
 *    binding — always a darker crease on real hardbacks).
 *  - Page edges use a layered gradient (sub-pixel cream/sepia stripes) plus
 *    a vertical inner shadow for depth.
 *  - Subtle bookmark ribbon hanging from the top edge.
 *  - Ground shadow ellipse below the book that follows the rotation.
 *
 * The book auto-rotates continuously around the Y axis showing front → spine
 * → back → right edge in a slow loop. Hovering pauses the rotation.
 */
export function BookModel3D({
  frontSrc,
  backSrc,
  spineSrc,
  width = 140,
  height = 195,
  depth = 28,
  className = '',
}: BookModel3DProps) {
  const [paused, setPaused] = useState(false);

  const w = width;
  const h = height;
  const d = depth;

  const centered: CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
  };

  const imgStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    userSelect: 'none',
  };

  // Soft directional light overlay used on every face (top-left bright,
  // bottom-right dark). Kept very subtle so the cover art still reads.
  const lightOverlay: CSSProperties = {
    position: 'absolute',
    inset: 0,
    background:
      'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.05) 25%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.25) 100%)',
    pointerEvents: 'none',
    mixBlendMode: 'overlay',
  };

  // Dark crease near the spine on the front cover (left edge) and back cover
  // (right edge in mirrored space → same .left side after rotateY(180)).
  const spineCreaseLeft: CSSProperties = {
    position: 'absolute',
    inset: 0,
    background:
      'linear-gradient(to right, rgba(0,0,0,0.45) 0px, rgba(0,0,0,0.15) 6px, rgba(0,0,0,0) 14px)',
    pointerEvents: 'none',
  };

  // Page edge texture: many fine cream/sepia stripes + inset vignette.
  const verticalPageEdge: CSSProperties = {
    background:
      'repeating-linear-gradient(to right, #f4ecd2 0 1px, #d6c693 1px 2px, #b89e63 2px 3px)',
    boxShadow:
      'inset 0 6px 8px rgba(0,0,0,0.35), inset 0 -6px 8px rgba(0,0,0,0.4), inset 2px 0 4px rgba(0,0,0,0.25), inset -2px 0 4px rgba(0,0,0,0.25)',
  };
  const horizontalPageEdge: CSSProperties = {
    background:
      'repeating-linear-gradient(to bottom, #f4ecd2 0 1px, #d6c693 1px 2px, #b89e63 2px 3px)',
    boxShadow:
      'inset 6px 0 8px rgba(0,0,0,0.35), inset -6px 0 8px rgba(0,0,0,0.4), inset 0 2px 4px rgba(0,0,0,0.25), inset 0 -2px 4px rgba(0,0,0,0.25)',
  };

  // Hardback cover-edge bevel (thin dark frame around each cover face) →
  // gives the impression of board thickness vs. paper.
  const coverBevel: CSSProperties = {
    position: 'absolute',
    inset: 0,
    boxShadow:
      'inset 0 0 0 1px rgba(255,255,255,0.08), inset 0 -2px 3px rgba(0,0,0,0.45), inset 0 2px 1px rgba(255,255,255,0.05)',
    pointerEvents: 'none',
  };

  return (
    <div
      className={`book-model-3d ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        width: w,
        height: h + 24, // extra room for ground shadow below
        perspective: 1300,
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      {/* Ground shadow (under the book, always horizontal) */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 2,
          transform: 'translateX(-50%)',
          width: w * 0.95,
          height: 14,
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0) 75%)',
          filter: 'blur(2px)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          width: '100%',
          height: h,
          transformStyle: 'preserve-3d',
          transform: 'rotateX(-12deg)',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            animation: paused
              ? 'book3d-spin 18s linear infinite paused'
              : 'book3d-spin 18s linear infinite',
          }}
        >
          {/* FRONT cover (z = +d/2) */}
          <div
            style={{
              ...centered,
              width: w,
              height: h,
              transform: `translate(-50%, -50%) translateZ(${d / 2}px)`,
              boxShadow: '0 10px 24px rgba(0,0,0,0.6)',
              backgroundColor: '#0b0b14',
            }}
          >
            <img src={frontSrc} alt="Front cover" draggable={false} style={imgStyle} />
            <div style={spineCreaseLeft} />
            <div style={lightOverlay} />
            <div style={coverBevel} />
            {/* Bookmark ribbon poking out the top */}
            <div
              style={{
                position: 'absolute',
                top: -10,
                right: 12,
                width: 6,
                height: 28,
                background:
                  'linear-gradient(to bottom, #6a0d0d 0%, #8a1414 60%, #4a0808 100%)',
                boxShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)',
              }}
            />
          </div>

          {/* BACK cover (z = -d/2, mirrored) */}
          <div
            style={{
              ...centered,
              width: w,
              height: h,
              transform: `translate(-50%, -50%) translateZ(-${d / 2}px) rotateY(180deg)`,
              backgroundColor: '#0b0b14',
            }}
          >
            <img src={backSrc} alt="Back cover" draggable={false} style={imgStyle} />
            <div style={spineCreaseLeft} />
            <div style={lightOverlay} />
            <div style={coverBevel} />
          </div>

          {/* SPINE — left side of book (x = -w/2) */}
          <div
            style={{
              ...centered,
              width: d,
              height: h,
              transform: `translate(-50%, -50%) rotateY(-90deg) translateZ(${w / 2}px)`,
              backgroundColor: '#0b0b14',
              overflow: 'hidden',
            }}
          >
            {/* The spine art is stretched (objectFit: fill) so the title sits
               flush across the entire spine width, no matter the source ratio. */}
            <img
              src={spineSrc}
              alt="Spine"
              draggable={false}
              style={{ ...imgStyle, objectFit: 'fill' }}
            />
            {/* Curved-spine specular highlight (vertical) — gives the spine the
               look of a rounded hardback catching room light down its centre. */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to right, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.05) 28%, rgba(255,255,255,0.18) 50%, rgba(0,0,0,0.05) 72%, rgba(0,0,0,0.35) 100%)',
                mixBlendMode: 'overlay',
                pointerEvents: 'none',
              }}
            />
            {/* Hairline darkening at the two outer edges where the spine meets
               the front and back boards — sells the joint convincingly. */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                width: 1.5,
                background: 'rgba(0,0,0,0.85)',
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                width: 1.5,
                background: 'rgba(0,0,0,0.85)',
                pointerEvents: 'none',
              }}
            />
            {/* Inner board bevel */}
            <div style={coverBevel} />
            {/* Spine head & tail caps (subtle dark bands at top/bottom of spine) */}
            <div
              style={{
                position: 'absolute',
                inset: '0 0 auto 0',
                height: 4,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)',
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 'auto 0 0 0',
                height: 4,
                background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                pointerEvents: 'none',
              }}
            />
            {/* Decorative gold hairline bands at top and bottom of spine,
               classic for hardback book design */}
            <div
              style={{
                position: 'absolute',
                left: 2,
                right: 2,
                top: 10,
                height: 1,
                background: 'rgba(201,168,92,0.45)',
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 2,
                right: 2,
                bottom: 10,
                height: 1,
                background: 'rgba(201,168,92,0.45)',
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* RIGHT page edge (x = +w/2) */}
          <div
            style={{
              ...centered,
              width: d,
              height: h,
              transform: `translate(-50%, -50%) rotateY(90deg) translateZ(${w / 2}px)`,
              ...verticalPageEdge,
            }}
          >
            <div style={lightOverlay} />
          </div>

          {/* TOP page edge (y = -h/2) */}
          <div
            style={{
              ...centered,
              width: w,
              height: d,
              transform: `translate(-50%, -50%) rotateX(90deg) translateZ(${h / 2}px)`,
              ...horizontalPageEdge,
            }}
          >
            <div style={lightOverlay} />
          </div>

          {/* BOTTOM page edge (y = +h/2) */}
          <div
            style={{
              ...centered,
              width: w,
              height: d,
              transform: `translate(-50%, -50%) rotateX(-90deg) translateZ(${h / 2}px)`,
              ...horizontalPageEdge,
            }}
          >
            <div style={lightOverlay} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes book3d-spin {
          0%   { transform: rotateY(-25deg); }
          25%  { transform: rotateY(-115deg); }
          50%  { transform: rotateY(-205deg); }
          75%  { transform: rotateY(-295deg); }
          100% { transform: rotateY(-385deg); }
        }
      `}</style>
    </div>
  );
}
