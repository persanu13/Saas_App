import { Separator } from "../ui/separator";

interface TextSeparatorProps {
  text: string;
}

export function TextSeparator({ text }: TextSeparatorProps) {
  return (
    <div className="flex items-center gap-4 ">
      <Separator className="flex-1 " />
      <span className="text-sm text-muted-foreground">{text}</span>
      <Separator className="flex-1" />
    </div>
  );
}
