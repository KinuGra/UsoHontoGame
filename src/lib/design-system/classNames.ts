/**
 * classNames Utility
 * Feature: 009-apple-hig-ui-redesign
 * Utility for combining CSS class names conditionally
 */

/** Type for class name values */
type ClassValue = string | number | boolean | undefined | null;

/**
 * Combines multiple class names into a single string
 *
 * Filters out falsy values (undefined, null, false, empty string)
 * and joins the remaining values with spaces.
 *
 * @param classes - Variable number of class name values
 * @returns Combined class name string
 *
 * @example
 * ```tsx
 * // Basic usage
 * classNames('button', 'primary')
 * // => 'button primary'
 *
 * // Conditional classes
 * classNames('button', isActive && 'active', isDisabled && 'disabled')
 * // => 'button active' (if isActive is true and isDisabled is false)
 *
 * // With ternary
 * classNames('button', variant === 'primary' ? 'btn-primary' : 'btn-secondary')
 * // => 'button btn-primary'
 *
 * // Real-world component example
 * function Button({ variant, size, disabled, className }) {
 *   return (
 *     <button
 *       className={classNames(
 *         'button',
 *         `button-${variant}`,
 *         `button-${size}`,
 *         disabled && 'button-disabled',
 *         className
 *       )}
 *     >
 *       Click me
 *     </button>
 *   );
 * }
 * ```
 */
export function classNames(...classes: ClassValue[]): string {
  return classes
    .filter((cls): cls is string | number => {
      // Filter out falsy values: undefined, null, false, empty string
      // Keep truthy values: strings, numbers (including 0 is filtered out)
      if (cls === undefined || cls === null || cls === false || cls === '') {
        return false;
      }
      // Filter out 0
      if (cls === 0) {
        return false;
      }
      return true;
    })
    .map((cls) => String(cls).trim())
    .filter((cls) => cls !== '')
    .join(' ');
}
