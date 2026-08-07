import { buildLuxuryTemplate, NICHE_CONFIGS } from './luxuryTemplate.js';

export function buildTraiteurTemplate(lead, content = {}, niche = 'traiteur') {
  return buildLuxuryTemplate(lead, content, niche);
}

export { NICHE_CONFIGS };
