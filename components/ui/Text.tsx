import { Text as RNText, TextProps } from 'react-native';

type CustomTextProps = TextProps & {
  className?: string;
};

export default function Text({ className, style, ...props }: CustomTextProps) {
  return (
    <RNText 
      className={`text-foreground ${className || ''}`}
      style={style}
      {...props}
    />
  );
}
