// usernames.ts
const usernames: string[] = [
  'SilentShade',
  'GhostlyEcho',
  'VeilSpecter',
  'HiddenVoyage',
  'ShadowCipher',
  'IncogNebula',
  'PhantomLoom',
  'MaskedWander',
  'ObscureMist',
  'CloakedRogue',
  'NullEnigma',
  'QuietWhisper',
  'MysterVeil',
  'ShroudEcho',
  'HiddenPhantom',
  'VeiledMystic',
  'NamelessVibe',
  'SilentRealm',
  'GhostedPath',
  'ShadowedX',
  'IncognitoLoom',
  'EnigmaHush',
  'ObscuraShade',
  'HushedSpecter',
  'PhantomEcho',
  'VeilEnigma',
  'MaskedMystic',
  'CloakWander',
  'VagueWhisper',
  'SilentGhost',
];

export function getRandomUsername(): string {
  const randomIndex = Math.floor(Math.random() * usernames.length);
  return usernames[randomIndex];
}
