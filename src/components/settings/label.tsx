import { useTheme } from '../ThemeContext';
import type { ComponentProps } from 'react';

interface LabelProps extends ComponentProps<"label"> {
  darkMode?: boolean;
}

export function Label(props: LabelProps) {
  const { className, darkMode: darkModeProp, children, ...rest } = props;
  const { darkMode: darkModeContext } = useTheme();
  
  const darkMode = darkModeProp ?? darkModeContext;
  
  const baseClass = `block text-sm font-medium mb-2 ${
    darkMode
      ? "text-gray-300"
      : "text-gray-700"
  }`;

  return (
    <label
      {...rest}
      className={[baseClass, className].filter(Boolean).join(' ')}
    >
      {children}
    </label>
  );
}
