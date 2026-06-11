'use client';
import {
  MovesExpand ,
  PokemonGallery ,
  PokemonStats ,
  TPokemon ,
  TProgressionAttributes ,
  translatePokemonTypeName ,
} from '@/app/ui';
import { Badge ,Card ,Text ,useAlert } from '@/app/ds';
import { useAppTranslation } from '@/app/i18n';
import Link from 'next/link';
import { buildPathRelations ,formatLabel ,uniqueById } from '@/app/utils';
import PokemonFeatures from '../pokemon-features';
import PokemonEvolutions from '../pokemon-evolutions';
import EncountersBadge from '../../encounter/components/encounters-badge';
import { useEffect ,useMemo } from 'react';
import { TOwnedPokemonMove } from '@/app/ui';
import { useRouter } from 'next/navigation';

type PokemonDetailProps = {
  hide?: boolean;
  origin?: string;
  domain?: string;
  pokemon?: TPokemon;
  isLoading?: boolean;
  errorMessage?: string;
  errorHideMessage?: string;
  ownedPokemonMove?: Array<TOwnedPokemonMove>;
  progressionAttributes?: TProgressionAttributes;
};
export default function PokemonDetail({
  hide = false,
  domain='catalog',
  origin,
  pokemon,
  isLoading,
  errorMessage,
  errorHideMessage = 'auth.errors.accessDenied',
  ownedPokemonMove,
  progressionAttributes
}: PokemonDetailProps) {
  const router = useRouter();

  const { t } = useAppTranslation();
  const { showAlert } = useAlert();

  useEffect(() => {
    if (!pokemon || !hide) {
      return;
    }

    showAlert({
      type: 'error',
      message: t(errorHideMessage)
    });

    router.push(`/${origin}`);
  } ,[errorHideMessage, hide, origin, pokemon, router, showAlert, t]);

  const pokemonStats = useMemo(() => {
    if (progressionAttributes) {
      return progressionAttributes;
    }
    if (!pokemon) {
      return;
    }
    const attributes: TProgressionAttributes = {
      hp: pokemon.hp,
      level: 0,
      speed: pokemon.speed,
      max_hp: pokemon.hp,
      attack: pokemon.hp,
      defense: pokemon.defense,
      experience: pokemon.base_experience,
      special_attack: pokemon.special_attack,
      special_defense: pokemon.special_defense,
    };
    return attributes;
  }, [pokemon, progressionAttributes]);
  
  const pokemonMoves = useMemo(() => {
    if (ownedPokemonMove) {
      return ownedPokemonMove.map((item) => ({
        ...item.pokemon_move,
        max_pp: item.max_pp,
      }));
    }
    if (!pokemon) {
      return;
    }
    
    return pokemon.moves;
  }, [ownedPokemonMove, pokemon]);
  
  if (isLoading && !pokemon) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <Card rounded="lg" className="mx-auto max-w-5xl text-center">
          <Text className="text-slate-600">{ t(
            `${domain}.detail.loading`) }</Text>
        </Card>
      </main>
    );
  }

  if (!pokemon) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <Card rounded="lg" className="mx-auto max-w-5xl text-center">
          <Text className="text-slate-600">{ errorMessage ||
            t(`${domain}.detail.notFound`) }</Text>
          <Link className="mt-4 inline-flex text-sm font-semibold text-blue-700" href="/catalog">
            { t(`${domain}.detail.back`) }
          </Link>
        </Card>
      </main>
    );
  }

  const weaknesses = uniqueById(pokemon.types.flatMap((type) => type.weaknesses ?? []));
  const strengths = uniqueById(pokemon.types.flatMap((type) => type.strengths ?? []));
  
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#dbeafe_0%,#f8fafc_42%,#eef2ff_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <section className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <PokemonGallery
            images={ pokemon.images }
            pokemon_name={ pokemon.name }
            external_image={ pokemon.external_image }
            types={ pokemon.types?.map((type) => ({ 
              ...type,
              href: buildPathRelations({
                origin,
                param: pokemon.name,
                relation:'type',
                identifier: type.name,
              })
            })) }
          />
          <PokemonFeatures
            name={ pokemon.name }
            order={ pokemon.order }
            shape={ pokemon.shape }
            status={ pokemon.status }
            height={ pokemon.height }
            weight={ pokemon.weight }
            habitat={ pokemon.habitat }
            is_baby={ pokemon.is_baby }
            is_mythical={ pokemon.is_mythical }
            is_legendary={ pokemon.is_legendary }
            capture_rate={ pokemon.capture_rate }
            hatch_counter={ pokemon.hatch_counter }
            base_happiness={ pokemon.base_happiness }
            base_experience={ pokemon.base_experience }
            has_gender_differences={ pokemon.has_gender_differences }/>

        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          { pokemonStats && (
            <PokemonStats
              {...pokemonStats}
              title={ t('common.statistics') }
              withBorder
            />
          )}
          
          <Card variant="elevated" rounded="2xl" className="border border-white/80 bg-white/90">
            <div className="space-y-5">
              <Text as="h3">{ t('navigation.abilities') }</Text>
              <div className="flex flex-wrap gap-2">
                { pokemon.abilities.map((ability) => (
                  <Link
                    key={ ability.id }
                    href={ buildPathRelations({ origin, relation: 'ability', identifier: ability.name, param: pokemon.name }) }
                    className="block focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <Badge tone={ ability.is_hidden ? 'warning' : 'primary' }>
                      { formatLabel(ability.name) }
                    </Badge>
                  </Link>
                )) }
              </div>

              <div className="space-y-3 border-t border-slate-100 pt-4">
                <Text as="h4">{ t('navigation.growthRate') }</Text>
                { pokemon.growth_rate ? (
                  <Link
                    key={ pokemon.growth_rate.id }
                    href={ buildPathRelations({ origin, relation: 'growth-rate', identifier: pokemon.growth_rate.name, param: pokemon.name }) }
                    className="block focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <Text color="text-slate-700">
                      { formatLabel(pokemon.growth_rate.name) }
                    </Text>
                  </Link>
                ) : (
                  <Text color="text-slate-700">
                    { t('common.unknown') }
                  </Text>
                ) }

              </div>
            </div>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card rounded="lg" className="bg-white">
            <Text as="h2" className="text-xl font-semibold text-slate-950">{ t('pokemon.type.strengths') }</Text>
            <div className="mt-4 flex flex-wrap gap-2">
              { strengths.map((strength) => (
                <Link
                  key={ strength.id }
                  href={
                    buildPathRelations({
                      origin,
                      param: pokemon.name,
                      relation:'type',
                      identifier: strength.name,
                    })
                  }
                  className="block focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <Badge
                    style={ {
                      color: strength.text_color || undefined ,
                      backgroundColor: strength.background_color || undefined ,
                    } }
                  >
                    { translatePokemonTypeName(t ,strength.name) }
                  </Badge>
                </Link>
              )) }
            </div>
          </Card>

          <Card rounded="lg" className="bg-white">
            <Text as="h2" className="text-xl font-semibold text-slate-950">{ t('pokemon.type.weaknesses') }</Text>
            <div className="mt-4 flex flex-wrap gap-2">
              { weaknesses.map((weakness) => (
                <Link
                  key={ weakness.id }
                  href={
                    buildPathRelations({
                      origin,
                      param: pokemon.name,
                      relation:'type',
                      identifier: weakness.name,
                    })
                  }
                  className="block focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <Badge
                    style={ {
                      color: weakness.text_color || undefined ,
                      backgroundColor: weakness.background_color || undefined ,
                    } }
                  >
                    { translatePokemonTypeName(t ,weakness.name) }
                  </Badge>
                </Link>
              )) }
            </div>
          </Card>
        </section>

        <section className="flex flex-col gap-6">
          {
            pokemonMoves && pokemonMoves.length > 0 && (
              <MovesExpand moves={ pokemonMoves }/>
            )
          }

          <PokemonEvolutions
            name={ pokemon.name }
            origin={ origin }
            external_image={ pokemon.external_image }
            evolutions={ pokemon.evolutions }
          />
          <EncountersBadge encounters={ pokemon.encounters?.map((encounter) => ({ ...encounter, href: buildPathRelations({ origin, param: pokemon.name, relation:'encounter', identifier: encounter.name }) })) }/>
        </section>
      </div>
    </main>
  );
}