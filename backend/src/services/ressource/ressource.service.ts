import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterRessourceRequestDto } from 'src/dto/ressource/request/filter-ressource.dto';
import { FullRessourceResponseDto } from 'src/dto/ressource/response/full-ressource-response.dto';
import { RessourceListResponseDto, RessourceResponseDto } from 'src/dto/ressource/response/ressource-response.dto';
import { UpdateRessourceRequestDto } from 'src/dto/ressource/request/update-ressource.dto';
import { Ressource, Status, Visibility } from 'src/models/ressource.model';
import { User, UserRole } from 'src/models/user.model';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { RessourceMapper } from './ressource.mapper';
import { CreateRessourceRequestDto } from 'src/dto/ressource/request/create-ressource.dto';
import { CategoryService } from '../category.service';
import { RessourceStatusFromInt, RessourceTypeFromInt, RessourceVisibilityFromInt } from 'src/helper/enumMapper';
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
    return RessourceMapper.toResponseListDto(ressources, 0, 10000, ressources.length);
  }

  async findRessourcesBySearch(
    user: User | null,
    filters: FilterRessourceRequestDto,
    isRestricted: boolean,
  ): Promise<RessourceListResponseDto> {
    let query = this.ressourcesRepository
      .createQueryBuilder('ressource')
      .leftJoinAndSelect('ressource.category', 'category')
      .leftJoinAndSelect('ressource.creator', 'creator')
      .leftJoin('ressource.validator', 'validator');

    query = this.applyCommonFilters(query, filters);

    if (isRestricted) {
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
      (user.role === UserRole.MODERATOR || user.role === UserRole.ADMIN || user.role === UserRole.SUPERADMIN)
    ) {
      if (filters.status) {
        query = query.andWhere('ressource.state = :status', {
          status: filters.status,
        });
      }
    }

    query.skip((filters.page_number - 1) * filters.result_size).take(filters.result_size);

    const ressources = await query.getMany();
    return RessourceMapper.toResponseListDto(ressources, filters.page_number, filters.result_size, ressources.length);
  }

  async findRessourceById(id: string): Promise<FullRessourceResponseDto> {
    const ressource = await this.ressourcesRepository.findOne({
      where: { id: id },
      relations: {
        category: true,
        creator: true,
        validator: true,
      },
    });
    if (!ressource) {
      throw new NotFoundException("La ressource n'a pas été trouvée");
    }
    return RessourceMapper.toFullResponseDto(ressource);
  }

  async createRessource(user: User, ressource: CreateRessourceRequestDto): Promise<RessourceResponseDto> {
    let newRessource = new Ressource();
    if (ressource.category) {
      const category = await this.categoryService.findCategoryById(ressource.category);
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
    (newRessource.ressourceType = RessourceTypeFromInt[ressource.type]),
      (newRessource.visibility = RessourceVisibilityFromInt[ressource.visibilty]);
    newRessource.creator = user;

    await this.ressourcesRepository.save(newRessource);
    return RessourceMapper.toResponseDto(newRessource);
  }

  async updateRessource(id: string, ressourceDto: UpdateRessourceRequestDto): Promise<RessourceResponseDto> {
    try {
      if (!ressourceDto || Object.values(ressourceDto).every((value) => value === undefined)) {
        throw new BadRequestException('Aucune donnée à mettre à jour');
      }

      const ressourceToUpdate = await this.ressourcesRepository.findOneBy({ id: id });
      if (!ressourceToUpdate) {
        throw new NotFoundException("La ressource n'a pas été trouvée");
      }

      Object.assign(ressourceToUpdate, ressourceDto);

      if (ressourceDto.category) {
        const category = await this.categoryService.findCategoryById(ressourceDto.category);
        if (!category) {
          throw new InternalServerErrorException("La catégorie n'existe pas");
        }
        ressourceToUpdate.category = category;
      }

      if (ressourceDto.visibility) {
        ressourceToUpdate.visibility = RessourceVisibilityFromInt[ressourceDto.visibility];
      }
      if (ressourceDto.status) {
        ressourceToUpdate.status = RessourceStatusFromInt[ressourceDto.status];
      }

      await this.ressourcesRepository.save(ressourceToUpdate);
      const ressource = await this.ressourcesRepository.findOneOrFail({
        where: { id },
        relations: {
          category: true,
          creator: true,
        },
      });
      return RessourceMapper.toResponseDto(ressource);
    } catch (error) {
      throw error;
    }
  }

  async saveBookmark(user: User, ressourceId: string, type: string): Promise<void> {
    const ressource = await this.ressourcesRepository.findOneBy({
      id: ressourceId,
    });

    if (!ressource) {
      throw new NotFoundException("La ressource n'existe pas");
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
    else if (type === 'favorite') {
      entity.isFavorite = isNew ? true : !entity.isFavorite;
    }
    else if (type !== 'like') {
      entity.like = isNew ? true : !entity.like;
      ressource.like = entity.like ? ressource.like + 1 : ressource.like - 1;
      await this.ressourcesRepository.save(ressource);
    }
    else {
      throw new BadRequestException('Type de ressource non valide');
    }

    await this.savedRessourceRepository.save(entity);
    
  }

  async validateRessource(validator: User, ressourceId: string, validate: boolean): Promise<void> {
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
    } else {
      ressource.status = Status.DRAFT;
      ressource.adminValidation = false;
    }
    await this.ressourcesRepository.save(ressource);
  }

  async consulteRessource(user: User, ressourceId: string): Promise<void> {
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

  async deleteRessource(id: string): Promise<RessourceResponseDto> {
    try {
      const ressource = await this.ressourcesRepository.findOneBy({
        id: id,
      });
      if (!ressource) {
        throw new NotFoundException("La ressource n'existe pas");
      }
      ressource.status = Status.DELETED;
      await this.ressourcesRepository.save(ressource);
      return RessourceMapper.toResponseDto(ressource);
    } catch (error) {
      throw error;
    }
  }

  private applyCommonFilters(
    query: SelectQueryBuilder<Ressource>,
    filters: FilterRessourceRequestDto,
  ): SelectQueryBuilder<Ressource> {
    if (filters.query_string) {
      query = query.andWhere('ressource.title LIKE :title', {
        title: `%${filters.query_string}%`,
      });
    }
    if (filters.category) {
      query = query.andWhere('category.id = :categoryId', {
        categoryId: filters.category,
      });
    }
    if (filters.type) {
      query = query.andWhere('ressource.ressourceType = :ressourceType', {
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
