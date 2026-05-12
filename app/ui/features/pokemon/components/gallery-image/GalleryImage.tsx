import { Badge, Card, Image } from '@/app/ds';
import { useAppTranslation } from '@/app/i18n';
import Link from 'next/link';
import { TPokemonImage } from '@/app/ui/features/pokemon/image';
import { TPokemonType, translatePokemonTypeName } from '@/app/ui/features/pokemon/type';
import { useMemo } from 'react';

type GalleryImageProps = Readonly<{
  types?: Array<TPokemonType>;
  images?: TPokemonImage | null;
  pokemon_name: string;
  external_image?: string;
}>;
export default function GalleryImage({ types, images, pokemon_name, external_image }: GalleryImageProps) {
  const { t } = useAppTranslation();

  const galleryImages = useMemo(() => {
    const imageSet = new Set<string>();

    if (images?.front_image) {
      imageSet.add(images.front_image);
    }

    if (images?.back_image) {
      imageSet.add(images.back_image);
    }

    images?.images?.forEach((image) => {
      if (image) {
        imageSet.add(image);
      }
    });

    return Array.from(imageSet);
  }, [images]);
  const primaryImage = useMemo(() => {
    return external_image || images?.front_image || images?.back_image || images?.images?.[0] || '';
  }, [external_image, images]);

  return (
    <Card rounded="lg" className="flex flex-col gap-4 bg-white">
      <div className="flex min-h-80 items-center justify-center rounded-lg bg-slate-100">
        <Image src={primaryImage} alt={pokemon_name} size="xl" fit="contain" className="p-5"/>
      </div>
      {galleryImages.length > 1 ? (
        <div className="grid grid-cols-3 gap-2">
          {galleryImages.slice(0, 6).map((image) => (
            <div key={image}
              className="flex h-20 items-center justify-center rounded-lg border border-slate-200 bg-white">
              <Image src={image} alt={pokemon_name} size="sm" fit="contain" className="p-2"/>
            </div>
          ))}
        </div>
      ) : null}
      {types && types.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <Link key={type.id} href={`/pokemon/type/${type.name}`}
              className="block focus:outline-none focus:ring-2 focus:ring-blue-500">
              <Badge
                style={{
                  color: type.text_color || undefined,
                  backgroundColor: type.background_color || undefined,
                }}
              >
                {translatePokemonTypeName(t, type.name)}
              </Badge>
            </Link>
          ))}
        </div>
      )}

    </Card>
  );
}
