import { Injectable, InternalServerErrorException, NotFoundException, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterRessourceDto } from 'src/dto/ressource/filter-ressource.dto';
import { FullRessourceResponseDto } from 'src/dto/ressource/full-ressource-response.dto';
import {
  RessourceListResponseDto,
  RessourceResponseDto,
} from 'src/dto/ressource/ressource-response.dto';
import { UpdateRessourceDto } from 'src/dto/ressource/update-ressource.dto';
import { Ressource, Status, Visibility } from 'src/models/ressource.model';
import { User, UserRole } from 'src/models/user.model';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { RessourceMapper } from './ressource.mapper';
import { CreateRessourceDto } from 'src/dto/ressource/create-ressource.dto';
import { CategoryService } from '../category.service';
import {
  RessourceTypeFromInt,
  RessourceVisibilityFromInt,
} from 'src/helper/enumMapper';
import { SavedRessource } from 'src/models/savedRessource.model';
import { ConsultedRessource } from 'src/models/consultedRessource.model';

@Injectable()
export class RessourceService {
  private readonly ressourcesRepository: Repository<Ressource>;
  private readonly savedRessourceRepository: Repository<SavedRessource>;
  private readonly consultedRessourceRepository: Repository<ConsultedRessource>;

  constructor(
    @InjectRepository(Ressource) ressourcesRepository: Repository<Ressource>,
    @InjectRepository(SavedRessource) savedRessourceRepository: Repository<SavedRessource>,
    @InjectRepository(ConsultedRessource) consultedRessourceRepository: Repository<ConsultedRessource>,
    private readonly categoryService: CategoryService,
  ) {
    this.ressourcesRepository = ressourcesRepository;
    this.savedRessourceRepository = savedRessourceRepository;
    this.consultedRessourceRepository = consultedRessourceRepository;
  }

  async findRessourceAll(): Promise<RessourceListResponseDto> {
    const ressources = await this.ressourcesRepository.find({
      relations: {
        category: true,
        creator: true,
        validator: true,
      },
    });
    return RessourceMapper.toResponseListDto(ressources);
  }

  async findRessourcesBySearch(
    user: User | null,
    filters: FilterRessourceDto,
  ): Promise<RessourceListResponseDto> {
    let query = this.ressourcesRepository
      .createQueryBuilder('ressource')
      .leftJoinAndSelect('ressource.category', 'category')
      .leftJoinAndSelect('ressource.creator', 'creator')
      .leftJoin('ressource.validator', 'validator');

    query = this.applyCommonFilters(query, filters);

    console.log('filters', query.getSql());

    if (user) {
      query = query.andWhere('ressource.visibility IN (:...visibility)', {
        visibility: [Visibility.PUBLIC, Visibility.RESTRICTED],
      });
    } else {
      query = query.andWhere('ressource.visibility = :visibility', {
        visibility: Visibility.PUBLIC,
      });
    }

    if (
      user &&
      (user.role === UserRole.MODERATOR ||
        user.role === UserRole.ADMIN ||
        user.role === UserRole.SUPERADMIN)
    ) {
      if (filters.status) {
        query = query.andWhere('ressource.state = :status', {
          status: filters.status,
        });
      }
    }

    query
      .skip((filters.page_number - 1) * filters.result_size)
      .take(filters.result_size);

    const ressources = await query.getMany();
    console.log('ressources', ressources);
    return RessourceMapper.toResponseListDto(ressources);
  }

  async findRessourceById(
    id: string,
  ): Promise<FullRessourceResponseDto | null> {
    const ressource = await this.ressourcesRepository.findOne({
      where: { id: id },
      relations: {
        category: true,
        creator: true,
        validator: true,
      },
    });
    if (!ressource) {
      return null;
    }
    return RessourceMapper.toFullResponseDto(ressource);
  }

  async createRessource(
    user: User,
    ressource: CreateRessourceDto,
  ): Promise<RessourceResponseDto> {
    let newRessource = new Ressource();
    if (ressource.category) {
      const category = await this.categoryService.findCategoryById(
        ressource.category,
      );    
      if (!category) {
        throw new InternalServerErrorException("La catégorie n'existe pas");
      }
      newRessource.category = category;
    }
    newRessource.title = ressource.title;
    newRessource.contentText = ressource.content_text;
    if (ressource.content_link) {
      newRessource.contentLink = ressource.content_link;
    }    
    newRessource.ressourceType = RessourceTypeFromInt[ressource.type],
    newRessource.visibility = RessourceVisibilityFromInt[ressource.visibilty];
    newRessource.creator = user;

    await this.ressourcesRepository.save(newRessource);
    return RessourceMapper.toResponseDto(newRessource);
  }

  async updateRessource(
    id: string,
    ressource: UpdateRessourceDto,
  ): Promise<RessourceResponseDto | null> {
    try {
      const existingRessource = await this.ressourcesRepository.findOneBy({
        id: id,
      });

      if (!existingRessource) {
        return null;
      }

      Object.assign(existingRessource, {
        title: ressource.title ?? existingRessource.title,
        contentText: ressource.content_text ?? existingRessource.contentText,
        contentLink: ressource.content_link ?? existingRessource.contentLink,
        category: ressource.category ?? existingRessource.category,
        visibility: ressource.visibility ?? existingRessource.visibility,
        status: ressource.status ?? existingRessource.status,
      });

      await this.ressourcesRepository.update(id, existingRessource);
      return RessourceMapper.toResponseDto(existingRessource);
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur serveur lors de la mise à jour de la ressource.',
      );
    }
  }

  async saveBookmark(
    user: User,
    ressourceId: string,
    type: string,
  ): Promise<void> {
    const ressource = await this.ressourcesRepository.findOneBy({
      id: ressourceId,
    });
  
    if (!ressource) {
      throw new InternalServerErrorException("La ressource n'existe pas");
    }
  
    const savedRessource = await this.savedRessourceRepository.findOneBy({
      user: { id: user.id },
      ressource: { id: ressourceId },
    });
    
    const isNew = !savedRessource;
    const entity = savedRessource ?? this.savedRessourceRepository.create({ user, ressource });
    
    if (type === 'bookmark') {
      entity.isToLater = isNew ? true : !entity.isToLater;
    }
    
    if (type === 'favorite') {
      entity.isFavorite = isNew ? true : !entity.isFavorite;
    }
    
    await this.savedRessourceRepository.save(entity);
  }

  async validateRessource(
    ressourceId: string,
    validator: User,
    validate: boolean,
  ): Promise<void> {
    const ressource = await this.ressourcesRepository.findOneBy({
      id: ressourceId,
    });
    if (!ressource) {
      throw new NotFoundException("La ressource n'existe pas");
    }
    ressource.validator = validator;
    ressource.dateTimeValidation = new Date();
    if (validate) {
      ressource.status = Status.PUBLISHED;
      ressource.adminValidation = true;
    }
    else {
      ressource.status = Status.TOVALIDATE;
      ressource.adminValidation = false;
    }
    await this.ressourcesRepository.save(ressource);
  }

  async consulteRessource(
    user: User,
    ressourceId: string,
  ): Promise<void> {
    const ressource = await this.ressourcesRepository.findOneBy({
      id: ressourceId,
    });
    if (!ressource) {
      throw new NotFoundException("La ressource n'existe pas");
    }
    let consultedRessource = new ConsultedRessource();
    consultedRessource.user = user;
    consultedRessource.ressource = ressource;
    consultedRessource.dateTimeConsult = new Date();
    await this.consultedRessourceRepository.save(consultedRessource);  
  }  

  async deleteRessource(
    id: string,
  ): Promise<RessourceResponseDto | null> {
    try {
      const ressource = await this.ressourcesRepository.findOneBy({
        id: id,
      });
      if (!ressource) {
        return null;
      }
      ressource.status = Status.DELETED;
      await this.ressourcesRepository.save(ressource);
      return RessourceMapper.toResponseDto(ressource);
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur serveur lors de la suppression de la ressource.',
      );
    }
  }
  
  private applyCommonFilters(
    query: SelectQueryBuilder<Ressource>,
    filters: FilterRessourceDto,
  ): SelectQueryBuilder<Ressource> {
    if (filters.query_string) {
      query = query.andWhere('ressource.title LIKE :title', {
        title: `%${filters.query_string}%`,
      });
    }
    if (filters.category) {
      query = query.andWhere('category.id = :categoryId', {
        category: filters.category,
      });
    }
    if (filters.type) {
      query = query.andWhere('ressource.ressourceType = :type', {
        ressourceType: filters.type,
      });
    }
    if (filters.creator_id) {
      query = query.andWhere('creator.id = :creatorId', {
        creatorId: filters.creator_id,
      });
    }
    if (filters.validator_id) {
      query = query.andWhere('validator.id = :validatorId', {
        validatorId: filters.validator_id,
      });
    }
    return query;
  }
}
