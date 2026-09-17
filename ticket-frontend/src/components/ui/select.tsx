// import { SelectHTMLAttributes, forwardRef } from 'react';

// interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
//   label?: string;
// }

// export const Select = forwardRef<HTMLSelectElement, Props>(
//   ({ label, className = '', id, children, ...rest }, ref) => {
//     return (
//       <div className="flex flex-col gap-1.5">
//         {label && (
//           <label htmlFor={id} className="text-sm font-medium text-ink">
//             {label}
//           </label>
//         )}
//         <select
//           ref={ref}
//           id={id}
//           className={`rounded-sm border border-hairline bg-white px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent ${className}`}
//           {...rest}
//         >
//           {children}
//         </select>
//       </div>
//     );
//   },
// );
// Select.displayName = 'Select';

import { SelectHTMLAttributes, forwardRef } from 'react';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const Select = forwardRef<HTMLSelectElement, Props>(
  ({ label, className = '', id, children, ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-ink">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={`rounded-md border border-hairline bg-surface px-3 py-2 text-sm text-ink shadow-sm outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent ${className}`}
          {...rest}
        >
          {children}
        </select>
      </div>
    );
  },
);
Select.displayName = 'Select';