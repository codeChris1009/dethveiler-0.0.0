import { Lightning } from "@phosphor-icons/react";

/**
 * Types
 */
type Props = {
  variant?: "default" | "icon";
  size?: number;
};

export const Logo = ({ variant = "default", size = 28 }: Props) => {
  if (variant === "default") {
    return (
      <div className="flex items-center gap-2">
        <Lightning size={size} weight="light" className="text-primary" />
        <span className="text-xl font-bold">Dethveiler</span>
      </div>
    );
  } else {
    return <Lightning size={size} weight="light" className="text-primary" />;
  }
};
