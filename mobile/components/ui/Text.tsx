import { Text as RNText, TextProps, StyleSheet } from 'react-native';

type CustomTextProps = TextProps & {
  className?: string;
};

export default function Text({ className, style, ...props }: CustomTextProps) {
  return (
    <RNText
      style={[styles.text, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  text: {
    color: '#fffafa',
  },
});
