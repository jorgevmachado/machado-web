import { Image } from '@/app/ds';

type PokemonTypeVisualData = {
  badge_url?: string | null;
  background_color?: string | null;
  name: string;
  text_color?: string | null;
};

type PokemonTypeVisualProps = Readonly<{
  type: PokemonTypeVisualData;
}>;

export default function PokemonTypeVisual({ type }: PokemonTypeVisualProps) {
  if (type.badge_url) {
    return (
      <Image
        src={type.badge_url}
        alt={`${type.name} badge`}
        size="lg"
        fit="contain"
        className="max-h-20"
      />
    );
  }

  return (
    <span
      className="inline-flex min-h-16 min-w-32 items-center justify-center rounded-lg px-5 text-lg font-bold capitalize shadow-sm"
      style={{
        backgroundColor: type.background_color || '#E5E7EB',
        color: type.text_color || '#111827',
      }}
    >
      {type.name}
    </span>
  );
};
