export const ROLE_OPTIONS: { value: number; label: string }[] = [
  { value: 0, label: 'Super Administrateur' },
  { value: 1, label: 'Administrateur' },
  { value: 2, label: 'Modérateur' },
  { value: 3, label: 'Utilisateur' },
  { value: 4, label: 'Visiteur' },
];

export const REPORT_REASON_OPTIONS: { value: number; label: string }[] = [
  { value: 0, label: 'Spam' },
  { value: 1, label: 'Harcèlement' },
  { value: 2, label: 'Contenu inapproprié' },
  { value: 3, label: 'Profil factice' },
  { value: 4, label: 'Violation des conditions d’utilisation' },
  { value: 5, label: 'Discours de haine' },
  { value: 6, label: 'Arnaque' },
  { value: 7, label: 'Autre' },
];
