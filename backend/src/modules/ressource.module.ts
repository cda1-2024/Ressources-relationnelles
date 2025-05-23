import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RessourceService } from 'src/services/ressource/ressource.service';
import { Ressource } from 'src/models/ressource.model';
import { ConsultedRessource } from 'src/models/consultedRessource.model';
import { SavedRessource } from 'src/models/savedRessource.model';
import { CategoryModule } from './category.module';
import { RessourceController } from 'src/controller/ressource.controller';

@Module({
  controllers: [RessourceController],
  imports: [
    TypeOrmModule.forFeature([Ressource, ConsultedRessource, SavedRessource]),
    forwardRef(() => CategoryModule),
  ],
  providers: [RessourceService],
  exports: [RessourceService],
})
export class RessourceModule {}
