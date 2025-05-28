import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterRessourceRequestDto } from 'src/dto/ressource/request/filter-ressource.dto';
import { UpdateRessourceRequestDto } from 'src/dto/ressource/request/update-ressource.dto';
import { Ressource, Status, Visibility } from 'src/models/ressource.model';
import { User, UserRole } from 'src/models/user.model';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateRessourceRequestDto } from 'src/dto/ressource/request/create-ressource.dto';
import { CategoryService } from '../category/category.service';
import { RessourceStatusFromInt, RessourceTypeFromInt, RessourceVisibilityFromInt } from 'src/helper/enum-mapper';
import { SavedRessource } from 'src/models/savedRessource.model';
import { ConsultedRessource } from 'src/models/consultedRessource.model';
import { BusinessException } from 'src/helper/exceptions/business.exception';
import { getErrorStatusCode } from 'src/helper/exception-utils';
import { createLoggedRepository } from 'src/helper/safe-repository';
import { RessourceListResponseDto } from 'src/dto/ressource/response/list-ressource-response.dto';

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
    this.ressourcesRepository = createLoggedRepository(ressourcesRepository);
    this.savedRessourceRepository = createLoggedRepository(savedRessourceRepository);
    this.consultedRessourceRepository = createLoggedRepository(consultedRessourceRepository);
  }

  async findRessourceAll(): Promise<Ressource[]> {
    try {
      const ressources = await this.ressourcesRepository.find({
        relations: {
          category: true,
          comments: true,
          creator: true,
          validator: true,
        },
      });
      return ressources;
    } catch (error) {
      throw new BusinessException('La recherche des ressources a échoué', getErrorStatusCode(error), { cause: error });
    }
  }

  async findRessourcesBySearch(
    user: User | null,
    filters: FilterRessourceRequestDto,
    isRestricted: boolean,
  ): Promise<{ ressources: Ressource[]; total: number }> {
    try {
      if (filters.page < 1 || filters.pageSize < 1) {
        throw new BadRequestException('Les paramètres de pagination doivent être supérieurs à 0');
      }

      const query = this.ressourcesRepository
        .createQueryBuilder('ressource')
        .leftJoinAndSelect('ressource.category', 'category')
        .leftJoinAndSelect('ressource.creator', 'creator')
        .leftJoin('ressource.validator', 'validator')
        .leftJoinAndSelect('ressource.comments', 'comments');

      this.applyCommonFilters(query, filters);

      query.andWhere('ressource.visibility IN (:...visibility)', {
        visibility: isRestricted ? [Visibility.PUBLIC, Visibility.RESTRICTED] : [Visibility.PUBLIC],
      });

      if (user?.role && [UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPERADMIN].includes(user.role)) {
        if (filters.status) {
          query.andWhere('ressource.status = :status', { status: filters.status });
        }
      } else {
        query.andWhere('ressource.status = :status', { status: Status.PUBLISHED });
      }

      const total = await query.getCount();

      query.skip((filters.page - 1) * filters.pageSize).take(filters.pageSize);

      const ressources = await query.getMany();
      return { ressources, total };
    } catch (error) {
      throw new BusinessException('La recherche des ressources a échoué', getErrorStatusCode(error), { cause: error });
    }
  }

  async findRessourceById(id: string): Promise<Ressource> {
    try {
      const ressource = await this.ressourcesRepository.findOne({
        where: { id },
        relations: {
          category: true,
          creator: true,
          validator: true,
        },
      });

      if (!ressource) {
        throw new NotFoundException("La ressource n'a pas été trouvée");
      }
      return ressource;
    } catch (error) {
      throw new BusinessException('La recherche de la ressource a échoué', getErrorStatusCode(error), { cause: error });
    }
  }

  async createRessource(user: User, ressource: CreateRessourceRequestDto): Promise<Ressource> {
    try {
      const newRessource = new Ressource();
      if (ressource.category) {
        const category = await this.categoryService.findCategoryById(ressource.category);
        if (!category) {
          throw new NotFoundException("La catégorie n'existe pas");
        }
        newRessource.category = category;
      }
      newRessource.title = ressource.title;
      newRessource.contentText = ressource.content_text;
      if (ressource.content_link) {
        newRessource.contentLink = ressource.content_link;
      }
      newRessource.ressourceType = RessourceTypeFromInt[ressource.type];
      newRessource.visibility = RessourceVisibilityFromInt[ressource.visibilty];
      newRessource.creator = user;

      const saveRessource = this.ressourcesRepository.save(newRessource);

      return saveRessource;
    } catch (error) {
      throw new BusinessException('La création de la ressource a échoué', getErrorStatusCode(error), { cause: error });
    }
  }

  async updateRessource(id: string, ressourceDto: UpdateRessourceRequestDto): Promise<Ressource> {
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
      return ressource;
    } catch (error) {
      throw new BusinessException('La mise à jour de la ressource a échoué', getErrorStatusCode(error), {
        cause: error,
      });
    }
  }

  async saveBookmark(user: User, ressourceId: string, type: string): Promise<void> {
    try {
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
      } else if (type === 'favorite') {
        entity.isFavorite = isNew ? true : !entity.isFavorite;
      } else if (type === 'like') {
        entity.like = isNew ? true : !entity.like;
        ressource.like = entity.like ? ressource.like + 1 : ressource.like - 1;
        await this.ressourcesRepository.save(ressource);
      } else {
        throw new BadRequestException('Type de ressource non valide');
      }

      await this.savedRessourceRepository.save(entity);
    } catch (error) {
      throw new BusinessException('La sauvegarde de la ressource a échoué', getErrorStatusCode(error), {
        cause: error,
      });
    }
  }

  async validateRessource(validator: User, ressourceId: string, validate: boolean): Promise<Ressource> {
    try {
      const ressource = await this.ressourcesRepository.findOne({
        where: { id: ressourceId },
        relations: {
          category: true,
          creator: true,
        },
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
      return await this.ressourcesRepository.save(ressource);
    } catch (error) {
      throw new BusinessException('La validation de la ressource a échoué', getErrorStatusCode(error), {
        cause: error,
      });
    }
  }

  async consulteRessource(user: User, ressourceId: string): Promise<void> {
    try {
      const ressource = await this.ressourcesRepository.findOne({
        where: { id: ressourceId },
        relations: {
          category: true,
          creator: true,
        },
      });
      if (!ressource) {
        throw new NotFoundException("La ressource n'existe pas");
      }
      const consultedRessource = new ConsultedRessource();
      consultedRessource.user = user;
      consultedRessource.ressource = ressource;
      consultedRessource.dateTimeConsult = new Date();
      await this.consultedRessourceRepository.save(consultedRessource);
    } catch (error) {
      throw new BusinessException('La consultation de la ressource a échoué', getErrorStatusCode(error), {
        cause: error,
      });
    }
  }

  async deleteRessource(id: string): Promise<Ressource> {
    try {
      const ressource = await this.ressourcesRepository.findOne({
        where: { id },
        relations: {
          category: true,
          creator: true,
        },
      });
      if (!ressource) {
        throw new NotFoundException("La ressource n'existe pas");
      }
      ressource.status = Status.DELETED;
      await this.ressourcesRepository.save(ressource);
      return ressource;
    } catch (error) {
      throw new BusinessException('La suppression de la ressource a échoué', getErrorStatusCode(error), {
        cause: error,
      });
    }
  }

  private applyCommonFilters(
    query: SelectQueryBuilder<Ressource>,
    filters: FilterRessourceRequestDto,
  ): SelectQueryBuilder<Ressource> {
    if (filters.query) {
      query = query.andWhere('ressource.title LIKE :title', {
        title: `%${filters.query}%`,
      });
    }
    if (filters.categoryId) {
      query = query.andWhere('category.id = :categoryId', {
        categoryId: filters.categoryId,
      });
    }
    if (filters.type) {
      query = query.andWhere('ressource.ressourceType = :ressourceType', {
        ressourceType: filters.type,
      });
    }
    if (filters.creatorId) {
      query = query.andWhere('creator.id = :creatorId', {
        creatorId: filters.creatorId,
      });
    }
    if (filters.validatorId) {
      query = query.andWhere('validator.id = :validatorId', {
        validatorId: filters.validatorId,
      });
    }
    return query;
  }

  async deleteCategory(id: string): Promise<boolean> {
    try {
      const ressource = await this.ressourcesRepository.find({ where: { category: { id: id } } });
      if (!ressource) {
        throw new NotFoundException("La ressource n'existe pas");
      }
      for (const ressourceItem of ressource) {
        ressourceItem.category = null;
        await this.ressourcesRepository.save(ressourceItem);
      }
      return true;
    } catch (error) {
      throw new BusinessException('La suppression de la catégorie a échoué', getErrorStatusCode(error), {
        cause: error,
      });
    }
  }

  async isRessourceLikedByUser(
    listRessourceDto: RessourceListResponseDto,
    userId?: string,
  ): Promise<RessourceListResponseDto> {
    try {
      for (const ressource of listRessourceDto.ressources) {
        if (userId) {
          const savedRessource = await this.savedRessourceRepository.findOne({
            where: { user: { id: userId }, ressource: { id: ressource.id } },
          });
          ressource.isLiked = savedRessource ? savedRessource.like : false;
        } else {
          ressource.isLiked = false;
        }
      }
      return listRessourceDto;
    } catch (error) {
      throw new BusinessException('La recherche des ressources aimées a échoué', getErrorStatusCode(error), {
        cause: error,
      });
    }
  }
}
