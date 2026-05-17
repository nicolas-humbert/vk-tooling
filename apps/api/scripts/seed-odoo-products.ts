import 'dotenv/config';

const ODOO_URL = process.env.ODOO_URL!;
const ODOO_DB = process.env.ODOO_DB!;
const ODOO_LOGIN = process.env.ODOO_LOGIN!;
const ODOO_PASSWORD = process.env.ODOO_PASSWORD!;

let sessionCookie = '';

async function rpc(model: string, method: string, args: unknown[], kwargs: Record<string, unknown> = {}) {
  const res = await fetch(`${ODOO_URL}/web/dataset/call_kw`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: sessionCookie },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'call', params: { model, method, args, kwargs } }),
  });
  const json = await res.json() as { result: unknown; error?: { message: string } };
  if (json.error) throw new Error(`Odoo RPC error: ${json.error.message}`);
  return json.result;
}

async function authenticate() {
  const res = await fetch(`${ODOO_URL}/web/session/authenticate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'call', params: { db: ODOO_DB, login: ODOO_LOGIN, password: ODOO_PASSWORD } }),
  });
  const cookie = res.headers.get('set-cookie');
  if (!cookie) throw new Error('Auth failed: no session cookie returned');
  sessionCookie = cookie.split(';')[0];
  const json = await res.json() as { result: { uid: number } };
  if (!json.result?.uid) throw new Error('Auth failed: invalid credentials');
  console.log(`✓ Authentifié (uid=${json.result.uid})`);
}

async function findOrCreate(model: string, searchDomain: unknown[], createVals: Record<string, unknown>): Promise<number> {
  const existing = await rpc(model, 'search_read', [searchDomain], { fields: ['id'], limit: 1 }) as { id: number }[];
  if (existing.length > 0) return existing[0].id;
  const id = await rpc(model, 'create', [createVals]) as number;
  return id;
}

async function ensureTax(): Promise<number> {
  const id = await findOrCreate(
    'account.tax',
    [['name', '=', 'TVA 18%'], ['type_tax_use', '=', 'sale']],
    { name: 'TVA 18%', amount: 18, type_tax_use: 'sale', amount_type: 'percent' },
  );
  console.log(`✓ Taxe TVA 18% (id=${id})`);
  return id;
}

async function ensureCategory(name: string, parentId?: number): Promise<number> {
  const domain: unknown[] = [['name', '=', name]];
  if (parentId) domain.push(['parent_id', '=', parentId]);
  const id = await findOrCreate('product.category', domain, { name, parent_id: parentId ?? false });
  return id;
}

type Product = { name: string; price: number; categ_id: number; taxId: number };

async function ensureProduct({ name, price, categ_id, taxId }: Product) {
  const existing = await rpc('product.template', 'search_read', [[['name', '=', name]]], { fields: ['id'], limit: 1 }) as { id: number }[];
  if (existing.length > 0) {
    process.stdout.write('.');
    return;
  }
  await rpc('product.template', 'create', [{
    name,
    type: 'service',
    list_price: price,
    categ_id,
    taxes_id: [[6, 0, [taxId]]],
    invoice_policy: 'order',
  }]);
  process.stdout.write('+');
}

async function main() {
  await authenticate();
  const taxId = await ensureTax();

  // Catégories
  const catVideo = await ensureCategory('Production Vidéo');
  const catReseaux = await ensureCategory('Réseaux sociaux', catVideo);
  const catLongue = await ensureCategory('Vidéo longue', catVideo);
  const catCampagnes = await ensureCategory('Campagnes marketing', catVideo);
  const catCM = await ensureCategory('Community Management');
  const catWeb = await ensureCategory('Sites web');
  const catEcom = await ensureCategory('E-commerce');
  const catApp = await ensureCategory('Applications web');
  const catOptions = await ensureCategory('Options & modules web');
  const catDesign = await ensureCategory('Design & Branding');
  const catMaintenance = await ensureCategory('Maintenance & Abonnements');
  console.log('✓ Catégories créées');

  const products: Product[] = [
    // Réseaux sociaux
    { name: 'Reel / TikTok simple', price: 15000, categ_id: catReseaux, taxId },
    { name: 'Reel dynamique premium', price: 40000, categ_id: catReseaux, taxId },
    { name: 'Pack 5 vidéos courtes', price: 70000, categ_id: catReseaux, taxId },
    { name: 'Pack 10 vidéos courtes', price: 130000, categ_id: catReseaux, taxId },
    { name: 'Sous-titrage', price: 5000, categ_id: catReseaux, taxId },
    { name: 'Adaptation multi-format', price: 5000, categ_id: catReseaux, taxId },

    // Vidéo longue
    { name: 'Montage interview simple', price: 40000, categ_id: catLongue, taxId },
    { name: 'Vidéo YouTube dynamique', price: 80000, categ_id: catLongue, taxId },
    { name: 'Vidéo corporate', price: 120000, categ_id: catLongue, taxId },
    { name: 'Vidéo promotionnelle premium', price: 150000, categ_id: catLongue, taxId },
    { name: 'Publicité réseaux sociaux', price: 80000, categ_id: catLongue, taxId },
    { name: 'Mini-documentaire', price: 250000, categ_id: catLongue, taxId },

    // Campagnes
    { name: 'Campagne Starter', price: 150000, categ_id: catCampagnes, taxId },
    { name: 'Campagne PME', price: 300000, categ_id: catCampagnes, taxId },
    { name: 'Campagne Premium', price: 700000, categ_id: catCampagnes, taxId },
    { name: 'Gestion pub Meta/TikTok', price: 80000, categ_id: catCampagnes, taxId },
    { name: 'Shooting journée complète', price: 180000, categ_id: catCampagnes, taxId },

    // Community Management
    { name: 'Community Management Basic', price: 80000, categ_id: catCM, taxId },
    { name: 'Community Management Standard', price: 180000, categ_id: catCM, taxId },
    { name: 'Community Management Premium', price: 500000, categ_id: catCM, taxId },

    // Sites web
    { name: 'Landing page / One page', price: 120000, categ_id: catWeb, taxId },
    { name: 'Site vitrine simple (3-5 pages)', price: 200000, categ_id: catWeb, taxId },
    { name: 'Site vitrine premium', price: 450000, categ_id: catWeb, taxId },
    { name: 'Site corporate avancé', price: 800000, categ_id: catWeb, taxId },

    // E-commerce
    { name: 'Boutique e-commerce petite', price: 400000, categ_id: catEcom, taxId },
    { name: 'Boutique e-commerce standard', price: 800000, categ_id: catEcom, taxId },
    { name: 'E-commerce premium', price: 2000000, categ_id: catEcom, taxId },
    { name: 'Marketplace', price: 4000000, categ_id: catEcom, taxId },

    // Applications
    { name: 'Dashboard interne simple', price: 500000, categ_id: catApp, taxId },
    { name: 'CRM / ERP léger', price: 1500000, categ_id: catApp, taxId },
    { name: 'SaaS métier', price: 3000000, categ_id: catApp, taxId },

    // Options web
    { name: 'Formulaire de contact avancé', price: 20000, categ_id: catOptions, taxId },
    { name: 'Intégration Google Maps', price: 15000, categ_id: catOptions, taxId },
    { name: 'Chat WhatsApp', price: 10000, categ_id: catOptions, taxId },
    { name: 'Blog', price: 50000, categ_id: catOptions, taxId },
    { name: 'SEO avancé', price: 100000, categ_id: catOptions, taxId },
    { name: 'Authentification utilisateurs', price: 100000, categ_id: catOptions, taxId },
    { name: 'Paiement en ligne', price: 80000, categ_id: catOptions, taxId },
    { name: 'Dashboard admin custom', price: 150000, categ_id: catOptions, taxId },
    { name: 'Intégration API externe', price: 100000, categ_id: catOptions, taxId },
    { name: 'Système de réservation', price: 200000, categ_id: catOptions, taxId },
    { name: 'Emailing automatisé', price: 80000, categ_id: catOptions, taxId },

    // Design
    { name: 'Logo simple', price: 40000, categ_id: catDesign, taxId },
    { name: 'Identité visuelle complète', price: 150000, categ_id: catDesign, taxId },
    { name: 'UI/UX design complet', price: 200000, categ_id: catDesign, taxId },

    // Maintenance
    { name: 'Hébergement + maintenance basique', price: 25000, categ_id: catMaintenance, taxId },
    { name: 'Maintenance standard', price: 50000, categ_id: catMaintenance, taxId },
    { name: 'Maintenance premium', price: 200000, categ_id: catMaintenance, taxId },
    { name: 'Support prioritaire', price: 50000, categ_id: catMaintenance, taxId },
  ];

  process.stdout.write('Produits (+ créé, . existant) : ');
  for (const p of products) await ensureProduct(p);
  console.log(`\n✓ ${products.length} produits traités`);
}

main().catch((e) => { console.error(e); process.exit(1); });
