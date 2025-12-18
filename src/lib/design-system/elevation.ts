/**
 * Elevation Utilities
 * Feature: 009-apple-hig-ui-redesign
 * Depth and visual hierarchy through proper elevation management
 */

import { classNames } from './classNames';

/**
 * Elevation levels following Apple HIG depth guidelines
 */
export type ElevationLevel = 'flat' | 'raised' | 'floating' | 'elevated' | 'lifted';

/**
 * Z-index levels for consistent layering
 */
export type ZIndexLevel =
  | 'base'
  | 'raised'
  | 'dropdown'
  | 'sticky'
  | 'overlay'
  | 'modal'
  | 'popover'
  | 'tooltip';

/**
 * Z-index value map for layering hierarchy
 */
const zIndexMap: Record<ZIndexLevel, number> = {
  base: 0,
  raised: 10,
  dropdown: 100,
  sticky: 200,
  overlay: 300,
  modal: 400,
  popover: 500,
  tooltip: 600,
};

/**
 * Elevation to shadow class mapping
 */
const elevationShadowMap: Record<ElevationLevel, string> = {
  flat: 'shadow-none',
  raised: 'shadow-sm',
  floating: 'shadow-md',
  elevated: 'shadow-lg',
  lifted: 'shadow-xl',
};

/**
 * Hover elevation map (one level up from base)
 */
const hoverElevationMap: Record<ElevationLevel, string> = {
  flat: 'hover:shadow-sm',
  raised: 'hover:shadow-md',
  floating: 'hover:shadow-lg',
  elevated: 'hover:shadow-xl',
  lifted: 'hover:shadow-2xl',
};

/**
 * Get numeric z-index value for a given level
 *
 * @param level - The z-index level
 * @returns The numeric z-index value
 *
 * @example
 * ```tsx
 * getZIndex('modal') // 400
 * getZIndex('tooltip') // 600
 * ```
 */
export function getZIndex(level: ZIndexLevel): number {
  return zIndexMap[level];
}

/**
 * Options for elevation class generation
 */
export interface ElevationOptions {
  /** Elevation level for shadow depth */
  level?: ElevationLevel;
  /** Z-index level for layering */
  zIndex?: ZIndexLevel;
  /** Enable interactive hover elevation */
  interactive?: boolean;
}

/**
 * Generate elevation class names for shadows and z-index
 *
 * @param options - Elevation configuration options
 * @returns Combined class name string
 *
 * @example
 * ```tsx
 * getElevationClassName({ level: 'raised', interactive: true })
 * // 'elevation-raised shadow-sm hover:shadow-md transition-shadow duration-200'
 * ```
 *
 * @example
 * ```tsx
 * getElevationClassName({ level: 'elevated', zIndex: 'modal' })
 * // 'elevation-elevated shadow-lg z-[400]'
 * ```
 *
 * @example
 * ```tsx
 * getElevationClassName({ level: 'floating', zIndex: 'dropdown', interactive: true })
 * // 'elevation-floating shadow-md z-[100] hover:shadow-lg transition-shadow duration-200'
 * ```
 */
export function getElevationClassName(options: ElevationOptions): string {
  const { level, zIndex, interactive = false } = options;
  const classes: string[] = [];

  // Add elevation level classes
  if (level) {
    classes.push(`elevation-${level}`);
    classes.push(elevationShadowMap[level]);

    // Add hover elevation for interactive elements
    if (interactive) {
      classes.push(hoverElevationMap[level]);
    }
  }

  // Add z-index classes
  if (zIndex !== undefined) {
    const zValue = zIndexMap[zIndex];
    if (zValue === 0) {
      classes.push('z-0');
    } else if (zValue === 10) {
      classes.push('z-10');
    } else {
      classes.push(`z-[${zValue}]`);
    }
  }

  // Add transition for interactive elements
  if (interactive) {
    classes.push('transition-shadow');
    classes.push('duration-200');
  }

  return classNames(...classes);
}
