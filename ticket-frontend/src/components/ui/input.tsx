// import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';

// interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
//   label?: string;
//   error?: string;
// }

// export const Input = forwardRef<HTMLInputElement, InputProps>(
//   ({ label, error, className = '', id, ...rest }, ref) => {
//     return (
//       <div className="flex flex-col gap-1.5">
//         {label && (
//           <label htmlFor={id} className="text-sm font-medium text-ink">
//             {label}
//           </label>
//         )}
//         <input
//           ref={ref}
//           id={id}
//           className={`rounded-sm border px-3 py-2 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-accent focus:ring-1 focus:ring-accent ${
//             error ? 'border-danger' : 'border-hairline'
//           } ${className}`}
//           {...rest}
//         />
//         {error && <p className="text-sm text-danger">{error}</p>}
//       </div>
//     );
//   },
// );
// Input.displayName = 'Input';

// interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
//   label?: string;
//   error?: string;
// }

// export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
//   ({ label, error, className = '', id, ...rest }, ref) => {
//     return (
//       <div className="flex flex-col gap-1.5">
//         {label && (
//           <label htmlFor={id} className="text-sm font-medium text-ink">
//             {label}
//           </label>
//         )}
//         <textarea
//           ref={ref}
//           id={id}
//           className={`rounded-sm border px-3 py-2 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-accent focus:ring-1 focus:ring-accent ${
//             error ? 'border-danger' : 'border-hairline'
//           } ${className}`}
//           {...rest}
//         />
//         {error && <p className="text-sm text-danger">{error}</p>}
//       </div>
//     );
//   },
// );
// Textarea.displayName = 'Textarea'; 

import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-ink">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`rounded-md border bg-surface px-3 py-2 text-sm text-ink shadow-sm outline-none transition-colors placeholder:text-muted focus:border-accent focus:ring-1 focus:ring-accent ${
            error ? 'border-danger' : 'border-hairline'
          } ${className}`}
          {...rest}
        />
        {error && <p className="text-sm text-danger">{error}</p>}
      </div>
    );
  },
);
Input.displayName = 'Input';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', id, ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-ink">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={`rounded-md border bg-surface px-3 py-2 text-sm text-ink shadow-sm outline-none transition-colors placeholder:text-muted focus:border-accent focus:ring-1 focus:ring-accent ${
            error ? 'border-danger' : 'border-hairline'
          } ${className}`}
          {...rest}
        />
        {error && <p className="text-sm text-danger">{error}</p>}
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';