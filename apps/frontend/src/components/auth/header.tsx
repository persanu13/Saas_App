interface HeaderProps {
  title: string;
  description: string;
}

export function Header({ title, description }: HeaderProps) {
  return (
    <header>
      <h1 className="text-center text-2xl font-semibold mb-4 tracking-tighter ">
        {title}
      </h1>
      <p className="text-muted-foreground text-sm text-center">{description}</p>
    </header>
  );
}
