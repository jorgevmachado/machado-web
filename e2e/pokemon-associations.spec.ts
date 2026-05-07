import { expect, test, type Page } from '@playwright/test';

const authToken = (() => {
  const encode = (value: string) => Buffer.from(value).toString('base64url');
  const header = encode(JSON.stringify({ alg: 'none', typ: 'JWT' }));
  const payload = encode(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 86400 }));
  const signature = encode('mock-signature');

  return `${header}.${payload}.${signature}`;
})();

const meta = {
  total: 1,
  limit: 12,
  offset: 0,
  next_page: undefined,
  previous_page: undefined,
  total_pages: 1,
  current_page: 1,
};

const typeItem = {
  id: 'type-fire',
  name: 'fire',
  order: 10,
  url: 'https://pokeapi.co/api/v2/type/10/',
  text_color: '#ffffff',
  background_color: '#ef4444',
  badge_url: null,
  strengths: [{ id: 'type-grass', name: 'grass', background_color: '#bbf7d0', text_color: '#166534' }],
  weaknesses: [{ id: 'type-water', name: 'water', background_color: '#bfdbfe', text_color: '#1d4ed8' }],
  created_at: '2026-01-01T00:00:00Z',
};

const abilityItem = {
  id: 'ability-overgrow',
  name: 'overgrow',
  order: 65,
  url: 'https://pokeapi.co/api/v2/ability/65/',
  slot: 1,
  effect: 'Powers up Grass-type moves when HP is low.',
  short_effect: 'Boosts Grass moves in a pinch.',
  flavor_text: 'Boosts grass moves when the Pokemon is in trouble.',
  is_hidden: false,
  created_at: '2026-01-01T00:00:00Z',
};

const moveItem = {
  id: 'move-tackle',
  name: 'tackle',
  order: 33,
  url: 'https://pokeapi.co/api/v2/move/33/',
  pp: 35,
  type: 'normal',
  power: 40,
  target: 'selected-pokemon',
  effect: 'Inflicts regular damage with no additional effect.',
  accuracy: 100,
  short_effect: 'Inflicts regular damage.',
  damage_class: 'physical',
  effect_chance: null,
  created_at: '2026-01-01T00:00:00Z',
};

const setupAuth = async (page: Page) => {
  await page.context().addCookies([{
    name: 'auth-token',
    value: authToken,
    domain: '127.0.0.1',
    path: '/',
    httpOnly: true,
    sameSite: 'Lax',
  }]);
};

const setupAssociationRoutes = async (page: Page, state: 'success' | 'empty' | 'error' | 'loading') => {
  await page.route('**/api/pokemon/**', async (route) => {
    if (state === 'loading') {
      return;
    }

    const pathname = new URL(route.request().url()).pathname;

    if (pathname === '/api/pokemon/type/fire') {
      if (state === 'error') {
        await route.fulfill({ status: 500, json: { message: 'Could not load Pokemon types.' } });
        return;
      }

      if (state === 'empty') {
        await route.fulfill({ status: 404, json: { message: 'Pokemon type not found.' } });
        return;
      }

      await route.fulfill({ status: 200, json: typeItem });
      return;
    }

    if (pathname === '/api/pokemon/type') {
      if (state === 'error') {
        await route.fulfill({ status: 500, json: { message: 'Could not load Pokemon types.' } });
        return;
      }

      await route.fulfill({ status: 200, json: { items: state === 'empty' ? [] : [typeItem], meta: { ...meta, total: state === 'empty' ? 0 : 1, total_pages: state === 'empty' ? 0 : 1 } } });
      return;
    }

    if (pathname === '/api/pokemon/ability/overgrow') {
      if (state === 'error') {
        await route.fulfill({ status: 500, json: { message: 'Could not load Pokemon abilities.' } });
        return;
      }

      if (state === 'empty') {
        await route.fulfill({ status: 404, json: { message: 'Pokemon ability not found.' } });
        return;
      }

      await route.fulfill({ status: 200, json: abilityItem });
      return;
    }

    if (pathname === '/api/pokemon/ability') {
      if (state === 'error') {
        await route.fulfill({ status: 500, json: { message: 'Could not load Pokemon abilities.' } });
        return;
      }

      await route.fulfill({ status: 200, json: { items: state === 'empty' ? [] : [abilityItem], meta: { ...meta, total: state === 'empty' ? 0 : 1, total_pages: state === 'empty' ? 0 : 1 } } });
      return;
    }

    if (pathname === '/api/pokemon/move/tackle') {
      if (state === 'error') {
        await route.fulfill({ status: 500, json: { message: 'Could not load Pokemon moves.' } });
        return;
      }

      if (state === 'empty') {
        await route.fulfill({ status: 404, json: { message: 'Pokemon move not found.' } });
        return;
      }

      await route.fulfill({ status: 200, json: moveItem });
      return;
    }

    if (pathname === '/api/pokemon/move') {
      if (state === 'error') {
        await route.fulfill({ status: 500, json: { message: 'Could not load Pokemon moves.' } });
        return;
      }

      await route.fulfill({ status: 200, json: { items: state === 'empty' ? [] : [moveItem], meta: { ...meta, total: state === 'empty' ? 0 : 1, total_pages: state === 'empty' ? 0 : 1 } } });
      return;
    }

    await route.fallback();
  });
};

test.beforeEach(async ({ page }) => {
  await setupAuth(page);
});

const closeMobileSidebar = async (page: Page) => {
  const viewport = page.viewportSize();

  if (!viewport || viewport.width > 900) {
    return;
  }

  const collapseButton = page.getByRole('button', { name: 'Collapse sidebar' });

  if (await collapseButton.isVisible().catch(() => false)) {
    await collapseButton.click();
  }
};

const waitForSettledState = async (page: Page, state: 'success' | 'empty' | 'error' | 'loading', marker: string) => {
  if (state === 'loading') {
    await expect(page.getByRole('status', { name: 'loading' })).toBeVisible();
    return;
  }

  await expect(page.getByText(marker).first()).toBeVisible();
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole('status', { name: 'loading' })).toHaveCount(0);
};

const listScenarios = [
  { key: 'pokemon-type', path: '/pokemon/type', success: 'fire', empty: 'No Pokemon types found.', error: 'Could not load Pokemon types.' },
  { key: 'pokemon-ability', path: '/pokemon/ability', success: 'overgrow', empty: 'No Pokemon abilities found.', error: 'Could not load Pokemon abilities.' },
  { key: 'pokemon-move', path: '/pokemon/move', success: 'tackle', empty: 'No Pokemon moves found.', error: 'Could not load Pokemon moves.' },
] as const;

const detailScenarios = [
  { key: 'pokemon-type', path: '/pokemon/type/fire', success: 'fire', empty: 'Pokemon type not found.', error: 'Could not load Pokemon types.' },
  { key: 'pokemon-ability', path: '/pokemon/ability/overgrow', success: 'overgrow', empty: 'Pokemon ability not found.', error: 'Could not load Pokemon abilities.' },
  { key: 'pokemon-move', path: '/pokemon/move/tackle', success: 'tackle', empty: 'Pokemon move not found.', error: 'Could not load Pokemon moves.' },
] as const;

for (const scenario of listScenarios) {
  for (const state of ['success', 'empty', 'error', 'loading'] as const) {
    test(`${scenario.key} list ${state} screenshot`, async ({ page }) => {
      await setupAssociationRoutes(page, state);
      await page.goto(scenario.path);
      await closeMobileSidebar(page);
      await waitForSettledState(page, state, scenario[state === 'loading' ? 'success' : state]);

      await expect(page).toHaveScreenshot(`${scenario.key}-list-${state}.png`, { fullPage: true });
    });
  }
}

for (const scenario of detailScenarios) {
  for (const state of ['success', 'empty', 'error', 'loading'] as const) {
    test(`${scenario.key} detail ${state} screenshot`, async ({ page }) => {
      await setupAssociationRoutes(page, state);
      await page.goto(scenario.path);
      await closeMobileSidebar(page);
      await waitForSettledState(page, state, scenario[state === 'loading' ? 'success' : state]);

      await expect(page).toHaveScreenshot(`${scenario.key}-detail-${state}.png`, { fullPage: true });
    });
  }
}

test('pokemon association list to detail navigation', async ({ page }) => {
  await setupAssociationRoutes(page, 'success');

  await page.goto('/pokemon/type');
  await closeMobileSidebar(page);
  await expect(page.getByLabel('Open fire type')).toBeVisible();
  await page.getByLabel('Open fire type').click();
  await expect(page).toHaveURL(/\/pokemon\/type\/fire$/);

  await page.goto('/pokemon/ability');
  await closeMobileSidebar(page);
  await expect(page.getByLabel('Open overgrow ability')).toBeVisible();
  await page.getByLabel('Open overgrow ability').click();
  await expect(page).toHaveURL(/\/pokemon\/ability\/overgrow$/);

  await page.goto('/pokemon/move');
  await closeMobileSidebar(page);
  await expect(page.getByLabel('Open tackle move')).toBeVisible();
  await page.getByLabel('Open tackle move').click();
  await expect(page).toHaveURL(/\/pokemon\/move\/tackle$/);
});
