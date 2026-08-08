import { useState } from 'react';
import { Star } from 'lucide-react';

/**
 * Interactive or read-only star rating widget.
 *
 * @param {number}   value      Current rating value (0 = unrated)
 * @param {Function} onChange   Called with the new value; omit for read-only
 * @param {boolean}  readonly   Force read-only even if onChange is provided
 * @param {number}   size       Icon size in px
 */
export function StarRating({ value = 0, onChange, readonly = false, size = 20 }) {
  const [hovered, setHovered] = useState(0);
  const isReadonly = readonly || !onChange;

  return (
    <div className={`star-rating ${isReadonly ? 'readonly' : ''}`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled  = star <= (isReadonly ? value : (hovered || value));
        const hovering = !isReadonly && star <= hovered;

        return (
          <Star
            key={star}
            size={size}
            className={`star ${filled ? 'filled' : ''} ${hovering ? 'hovered' : ''}`}
            fill={filled ? 'currentColor' : 'none'}
            onMouseEnter={() => !isReadonly && setHovered(star)}
            onMouseLeave={() => !isReadonly && setHovered(0)}
            onClick={() => !isReadonly && onChange?.(star)}
          />
        );
      })}
      {value > 0 && (
        <span className="star-value">
          {typeof value === 'number' && !Number.isInteger(value) ? value.toFixed(1) : value}
        </span>
      )}
    </div>
  );
}
