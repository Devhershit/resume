/**
 * macOS Genie Effect Mathematical Model
 *
 * Implements the fluid curved suction/expansion dynamics of Apple's macOS Genie Effect.
 * Reference: Harshil Shah (SpriteKit Warp Geometry) & Quartz Compositor window minimization.
 *
 * The animation features:
 * 1. Rapid bottom edge descent and horizontal pinch into the dock target spout.
 * 2. Top edge delayed descent, flowing down through the curved funnel.
 * 3. S-curve cubic smoothstep lateral warping connecting the wide window body to the narrow dock spout.
 * 4. Graceful waist flare towards the direction of lateral movement.
 */

function easeOutCubic(t) {
  const c = Math.max(0, Math.min(1, t))
  return 1 - Math.pow(1 - c, 3)
}

function easeInOutCubic(t) {
  const c = Math.max(0, Math.min(1, t))
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2
}

/**
 * Calculates the geometry slices for a single frame of the Genie effect.
 *
 * @param {Object} params
 * @param {DOMRect|Object} params.initialRect - Window bounds on desktop
 * @param {DOMRect|Object} params.finalRect - Dock icon bounds
 * @param {number} params.progress - Animation progress: 0.0 (open) to 1.0 (minimized)
 * @param {number} [params.rowCount=85] - Number of horizontal mesh slices
 * @returns {Array<Object>} Array of row slice geometries
 */
export function calculateGenieMesh({
  initialRect,
  finalRect,
  progress,
  rowCount = 85,
}) {
  const p = Math.max(0, Math.min(1, progress))

  // When fully minimized (p >= 0.999), no rows to render
  if (p >= 0.999) return []

  const winLeft = initialRect.left
  const winRight = initialRect.left + initialRect.width
  const winTop = initialRect.top
  const winBottom = initialRect.top + initialRect.height

  const dockLeft = finalRect.left
  const dockRight = finalRect.left + finalRect.width
  const dockCenterY = finalRect.top + finalRect.height * 0.45

  // 1. Vertical dynamics:
  // Bottom edge travels to dock early (by p = 0.55), pinching into the spout
  const pBottom = Math.min(1, p / 0.55)
  const eBottom = easeOutCubic(pBottom)
  const yBottom = winBottom + eBottom * (dockCenterY - winBottom)

  // Top edge starts descending later (after p = 0.22), reaching dock at p = 1.0
  const pTop = Math.max(0, Math.min(1, (p - 0.22) / 0.78))
  const eTop = easeInOutCubic(pTop)
  const yTop = winTop + eTop * (dockCenterY - winTop)

  const currentHeight = Math.max(0, yBottom - yTop)
  if (currentHeight <= 0.5) return []

  // 2. Horizontal shear anchors:
  // Top boundary shears as top descends
  const topLeft = winLeft + eTop * (dockLeft - winLeft)
  const topRight = winRight + eTop * (dockRight - winRight)

  // Bottom boundary shears as bottom descends
  const bottomLeft = winLeft + eBottom * (dockLeft - winLeft)
  const bottomRight = winRight + eBottom * (dockRight - winRight)

  // Lateral center offset for the graceful curved waist flare
  const winCenterX = (winLeft + winRight) / 2
  const dockCenterX = (dockLeft + dockRight) / 2
  const lateralDeltaX = dockCenterX - winCenterX

  const rows = []
  for (let i = 0; i < rowCount; i++) {
    const v = i / rowCount
    const nextV = (i + 1) / rowCount

    const y = yTop + v * currentHeight
    const nextY = yTop + nextV * currentHeight

    // Cubic smoothstep interpolation (3v^2 - 2v^3) between top and bottom bounds
    const s = v * v * (3 - 2 * v)
    const nextS = nextV * nextV * (3 - 2 * nextV)

    // Subtle lateral flare curve: 4 * v * (1 - v) peaks at v = 0.5
    // providing that classic organic genie lamp waist bowing
    const flareWeight = 4 * v * (1 - v) * Math.max(0, 1 - Math.abs(p - 0.5) * 1.5)
    const nextFlareWeight = 4 * nextV * (1 - nextV) * Math.max(0, 1 - Math.abs(p - 0.5) * 1.5)
    const flareOffset = flareWeight * lateralDeltaX * 0.12
    const nextFlareOffset = nextFlareWeight * lateralDeltaX * 0.12

    const xMin = topLeft + s * (bottomLeft - topLeft) + flareOffset
    const xMax = topRight + s * (bottomRight - topRight) + flareOffset

    const nextXMin = topLeft + nextS * (bottomLeft - topLeft) + nextFlareOffset
    const nextXMax = topRight + nextS * (bottomRight - topRight) + nextFlareOffset

    const sliceWidth = Math.max(1, xMax - xMin)
    const sliceHeight = Math.max(0.2, nextY - y)

    rows.push({
      index: i,
      v,
      nextV,
      y,
      nextY,
      xMin,
      xMax,
      nextXMin,
      nextXMax,
      width: sliceWidth,
      height: sliceHeight,
    })
  }

  return rows
}
