import { forwardRef } from 'react';

export const Input = forwardRef(function Input({ label, error, icon, actionIcon, className = '', ...props }, ref) {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <div className="form-input-wrapper">
        {icon && <span className="form-input-icon">{icon}</span>}
        <input
          ref={ref}
          className={`form-input ${icon ? 'has-icon' : ''} ${error ? 'error' : ''} ${className}`.trim()}
          {...props}
        />
        {actionIcon}
      </div>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
});

export const Select = forwardRef(function Select({ label, error, children, className = '', ...props }, ref) {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <select
        ref={ref}
        className={`form-input ${error ? 'error' : ''} ${className}`.trim()}
        {...props}
      >
        {children}
      </select>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
});
