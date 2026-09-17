// import { ButtonHTMLAttributes, forwardRef } from 'react';

// type Variant = 'primary' | 'secondary' | 'ghost';

// const variantClasses: Record<Variant, string> = {
//   primary: 'bg-ink text-white hover:bg-ink/90',
//   secondary: 'bg-white text-ink border border-hairline hover:bg-paper',
//   ghost: 'text-muted hover:text-ink',
// };

// interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
//   variant?: Variant;
// }

// export const Button = forwardRef<HTMLButtonElement, Props>(
//   ({ variant = 'primary', className = '', ...rest }, ref) => {
//     return (
//       <button
//         ref={ref}
//         className={`inline-flex items-center justify-center gap-2 rounded-sm px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
//         {...rest}
//       />
//     );
//   },
// );

// Button.displayName = 'Button'; 
import { ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

const variantClasses: Record<Variant, string> = {
  primary: 'bg-ink text-white hover:bg-ink/90',
  secondary: 'bg-white text-ink border border-hairline hover:bg-paper',
  ghost: 'text-muted hover:text-ink',
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ variant = 'primary', className = '', ...rest }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
        {...rest}
      />
    );
  },
);

Button.displayName = 'Button';