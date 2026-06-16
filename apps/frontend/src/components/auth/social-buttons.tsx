"use client";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "../ui/button";
import { IconSvgElement } from "@hugeicons/react";
import { UserType } from "@/lib/schemas/auth";

export type SocialButton = {
  provider: string;
  icon: IconSvgElement;
};

interface SocialButtonsProps {
  buttons: SocialButton[];
  userType: UserType;
}

export function SocialButtons({ buttons, userType }: SocialButtonsProps) {
  const handleSocialLogin = (provider: string) => {
    window.location.href = `http://localhost:8080/auth/${provider}?type=${userType}`;
  };
  return (
    <div className="flex flex-col items-center gap-3">
      {buttons.map((button) => (
        <Button
          key={button.provider}
          variant="outline"
          size="lg"
          className="relative w-full p-5"
          onClick={() => {
            handleSocialLogin(button.provider);
          }}
        >
          <span className="text-base">
            Continue with{" "}
            {button.provider.charAt(0).toUpperCase() + button.provider.slice(1)}
          </span>
          <HugeiconsIcon
            icon={button.icon}
            className="size-5 absolute right-4"
          />
        </Button>
      ))}
    </div>
  );
}
