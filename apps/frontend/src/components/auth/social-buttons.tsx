import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "../ui/button";
import { IconSvgElement } from "@hugeicons/react";

export type SocialButton = {
  text: string;
  icon: IconSvgElement;
};

interface SocialButtonsProps {
  buttons: SocialButton[];
}

export function SocialButtons({ buttons }: SocialButtonsProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      {buttons.map((button) => (
        <Button
          key={button.text}
          variant="outline"
          size="lg"
          className="relative w-full p-5"
        >
          <span className="text-base">{button.text}</span>
          <HugeiconsIcon
            icon={button.icon}
            className="size-5 absolute right-4"
          />
        </Button>
      ))}
    </div>
  );
}
