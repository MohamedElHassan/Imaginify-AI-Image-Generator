import '../../styles/gradient-text.css';

type GradientStyle = 'blue' | 'sunset' | 'nature' | 'rainbow' | 'neon';

interface HeaderProps {
  title: string;
  subtitle?: string;
  gradientStyle?: GradientStyle;
}

const Header = ({ title, subtitle, gradientStyle = 'neon' }: HeaderProps) => {
  return (
    <>
      <h2 className={`gradient-text gradient-${gradientStyle}`}>{title}</h2>
      {subtitle && <p className="p-16-regular mt-4">{subtitle}</p>}
    </>
  );
};

export default Header;
