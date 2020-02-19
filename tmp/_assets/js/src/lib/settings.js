import { urlRelative } from './util';

const yamlPath = '/_assets/yml/settings.yml';
const jsonPath = '/_assets/yml/json/settings.json';

export function settingsPath(base) {
  return settingsPathJson(base);
}

export function settingsPathYaml(base) {
  const basePath = base || '/';
  return urlRelative(basePath, yamlPath);
}

export function settingsPathJson(base) {
  const basePath = base || '/';
  return urlRelative(basePath, jsonPath);
}

export default {};
