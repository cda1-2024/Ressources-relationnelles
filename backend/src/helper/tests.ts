import { ValidationError } from 'class-validator';

/**
 * Recherche une erreur spécifique pour un champ donné dans la liste des erreurs de validation.
 *
 * @param errors - Liste des erreurs de validation.
 * @param field - Nom du champ à rechercher.
 * @returns L'erreur correspondante pour le champ ou `undefined` si aucune erreur n'est trouvée.
 */
export function findErrorByField(errors: ValidationError[], field: string): ValidationError | undefined {
  return errors.find((error) => error.property === field);
}
