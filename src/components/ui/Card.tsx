/**
 * Card Component
 * Feature: 009-apple-hig-ui-redesign
 * Apple HIG-compliant card container with elevation and variants
 */

'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import { classNames } from '@/lib/design-system/classNames';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Card content */
  children: ReactNode;
  /** Visual variant following Apple HIG */
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  /** Whether card is interactive (clickable/hoverable) */
  interactive?: boolean;
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
}

/**
 * Card Component
 *
 * Apple HIG-compliant container for grouping related content.
 * Supports elevation, interactivity, and various padding options.
 *
 * @example
 * ```tsx
 * <Card variant="elevated" interactive>
 *   <h3>Card Title</h3>
 *   <p>Card content</p>
 * </Card>
 * ```
 *
 * @example
 * ```tsx
 * <Card variant="outlined" padding="lg">
 *   <div>Custom content</div>
 * </Card>
 * ```
 */
export function Card({
  children,
  variant = 'default',
  interactive = false,
  padding = 'md',
  className,
  ...props
}: CardProps) {
  // Base styles
  const baseStyles = classNames(
    'card-base',
    'rounded-lg',
    'transition-all duration-200 ease-out',
    'bg-white dark:bg-gray-800'
  );

  // Variant styles
  const variantStyles = {
    default: classNames('card-default', 'border border-gray-200 dark:border-gray-700', 'shadow-sm'),
    elevated: classNames('card-elevated', 'shadow-md hover:shadow-lg', 'border border-transparent'),
    outlined: classNames(
      'card-outlined',
      'border-2 border-gray-300 dark:border-gray-600',
      'shadow-none'
    ),
    filled: classNames(
      'card-filled',
      'bg-gray-50 dark:bg-gray-900',
      'border border-transparent',
      'shadow-none'
    ),
  };

  // Padding styles
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  };

  // Interactive styles
  const interactiveStyles = interactive
    ? classNames(
        'card-interactive',
        'cursor-pointer',
        'hover:scale-[1.02]',
        'active:scale-[0.98]',
        'focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2'
      )
    : '';

  const cardClassName = classNames(
    baseStyles,
    variantStyles[variant],
    paddingStyles[padding],
    interactiveStyles,
    className
  );

  return (
    <div className={cardClassName} {...props}>
      {children}
    </div>
  );
}
