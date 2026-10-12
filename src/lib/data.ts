// Loads the site's content: YAML data files and Markdown entries.
// Pages import from here instead of reading files themselves.
import fs from 'node:fs';
import path from 'node:path';
import { load as loadYamlText } from 'js-yaml';

const dataDir = path.join(process.cwd(), 'src', 'data');

function loadYaml<T>(file: string): T {
  return loadYamlText(fs.readFileSync(path.join(dataDir, file), 'utf8')) as T;
}

/** True when building the review preview (PUBLIC_REVIEW=1). Review notes and
 *  photo placeholders only render in that mode. */
export const reviewMode = import.meta.env.PUBLIC_REVIEW === '1';

export interface ReviewNote { id: string; note: string }

export interface Site {
  name: string;
  shortName: string;
  university: string;
  email: string;
  founded: number;
  currentProgram: { vehicle: string; status: string; update: string };
  applications: {
    term: string;
    opens?: string | Date | null;
    priorityDeadline?: string | Date | null;
    deadline: string | Date;
    formUrl: string;
  };
  forms: { contact: string; sponsorInterest: string };
  sponsorPacketUrl: string;
  socials: { name: string; url: string }[];
  supporters: string[];
  lab: { name: string; url: string };
}

export interface Member { name: string; role: string; subteam: string; photo?: string }
export interface Subteam { id: string; name: string; description: string }
export interface Sponsor { name: string; tier: string; url?: string; logo?: string }

export const site = loadYaml<Site>('site.yaml');
export const team = loadYaml<{ year: string; members: Member[] }>('team.yaml');
export const subteams = loadYaml<Subteam[]>('subteams.yaml');
export const sponsorData = loadYaml<{
  tiers: string[];
  sponsors: Sponsor[] | null;
  perks: { title: string; text: string }[];
}>('sponsors.yaml');
export const sponsors: Sponsor[] = sponsorData.sponsors ?? [];

/** YAML parses bare dates into Date objects; normalize to YYYY-MM-DD. */
export function isoDate(d: string | Date | null | undefined): string {
  if (!d) return '';
  if (d instanceof Date) return d.toISOString().slice(0, 10);
  return String(d).slice(0, 10);
}

export function formatDate(d: string | Date | null | undefined): string {
  const iso = isoDate(d);
  if (!iso) return '';
  const [y, m, day] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, day)).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  });
}

// ---------- Vehicles ----------

export interface VehicleData {
  name: string;
  order: number;
  status: 'flown' | 'active' | 'in-development';
  summary: string;
  firstYear: number | null;
  lastYear: number | string | null;
  flights: number;
  flightsNote?: string;
  apogeeFt: number;
  apogeeSimulated?: boolean;
  specs: { label: string; value: string }[];
  photo?: string;
  photoNeeded?: string;
  review?: ReviewNote[];
}

export interface Vehicle extends VehicleData {
  slug: string;
  Content: any;
}

const vehicleModules = import.meta.glob('../content/vehicles/*.md', { eager: true }) as Record<
  string,
  { frontmatter: VehicleData; Content: any }
>;

export const vehicles: Vehicle[] = Object.entries(vehicleModules)
  .map(([file, mod]) => ({
    ...mod.frontmatter,
    slug: path.basename(file, '.md'),
    Content: mod.Content,
  }))
  .sort((a, b) => a.order - b.order);

export function vehicleYears(v: VehicleData): string {
  if (!v.firstYear) return 'Not yet flown';
  if (!v.lastYear || v.lastYear === v.firstYear) return String(v.firstYear);
  if (v.lastYear === 'present') return `${v.firstYear}–present`;
  return `${v.firstYear}–${v.lastYear}`;
}

export const statusLabel: Record<VehicleData['status'], string> = {
  flown: 'Flown',
  active: 'Flying',
  'in-development': 'In development',
};

// ---------- News ----------

export interface PostData {
  title: string;
  date: string | Date;
  displayDate?: string;
  draft?: boolean;
  summary: string;
  review?: ReviewNote[];
}

export interface Post extends PostData {
  slug: string;
  Content: any;
}

const postModules = import.meta.glob('../content/news/*.md', { eager: true }) as Record<
  string,
  { frontmatter: PostData; Content: any }
>;

/** Drafts appear only in the review preview. */
export const posts: Post[] = Object.entries(postModules)
  .map(([file, mod]) => ({ ...mod.frontmatter, slug: path.basename(file, '.md'), Content: mod.Content }))
  .filter((p) => reviewMode || !p.draft)
  .sort((a, b) => isoDate(b.date).localeCompare(isoDate(a.date)));

export function postDate(p: PostData): string {
  return p.displayDate ?? formatDate(p.date);
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .filter((c) => /[A-Za-z]/.test(c))
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
