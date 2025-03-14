import { ApiProperty } from '@nestjs/swagger';

export class UpdateRessourceDto {
@ApiProperty({ description: 'Exemple de titre mis à jour', required: false })
readonly title?: string;

@ApiProperty({ description: 'Exemple texte mis à jour', required: false })
readonly content_text?: string;

@ApiProperty({ description: 'Exemple de contenu mis à jour', required: false })
readonly content?: string;

@ApiProperty({ description: 'Exemple de catégorie mise à jour', required: false })
readonly category?: string;

@ApiProperty({ description: 'Validation par un administrateur', required: false })
readonly adminValidation?: boolean;

@ApiProperty({ description: 'Est restreint', required: false })
readonly isRestricted?: boolean;

@ApiProperty({ description: 'Est suspendu', required: false })
readonly suspended?: boolean;

@ApiProperty({ description: 'Est supprimé', required: false })
readonly deleted?: boolean;
}
