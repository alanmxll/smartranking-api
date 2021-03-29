import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlayersService } from 'src/players/players.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './interfaces/category.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    private readonly playersService: PlayersService,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const { category } = createCategoryDto;

    const alreadyExists = await this.categoryModel.findOne({ category }).exec();

    if (alreadyExists) {
      throw new BadRequestException(`Category ${category} already exists.`);
    }

    const newCategory = new this.categoryModel(createCategoryDto);

    return await newCategory.save();
  }

  async findCategories(): Promise<Category[]> {
    return await this.categoryModel.find().populate('players').exec();
  }

  async findCategoryByName(category: string): Promise<Category> {
    const categoryFound = await this.categoryModel.findOne({ category }).exec();

    if (!categoryFound) {
      throw new NotFoundException(`Category '${category}' not found`);
    }

    return categoryFound;
  }

  async updateCategory(
    category: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<void> {
    const categoryExists = await this.categoryModel
      .findOne({ category })
      .exec();

    if (!categoryExists) {
      throw new NotFoundException(`Category '${category}' not found`);
    }

    await this.categoryModel
      .findOneAndUpdate({ category }, { $set: updateCategoryDto })
      .exec();
  }

  async assignPlayerToCategory(params: string[]): Promise<void> {
    const category = params['category'];
    const _idPlayer = params['_idPlayer'];

    const categoryFound = await this.categoryModel.findOne({ category }).exec();
    const playerAlreadyInCategory = await this.categoryModel
      .find({ category })
      .where('players')
      .in(_idPlayer)
      .exec();

    await this.playersService.findPlayerById(_idPlayer);

    if (!categoryFound) {
      throw new BadRequestException(`Category '${category}' not registered.`);
    }

    if (playerAlreadyInCategory.length > 0) {
      throw new BadRequestException(
        `Player '${_idPlayer}' already in the category '${category}'`,
      );
    }

    categoryFound.players.push(_idPlayer);

    await this.categoryModel
      .findOneAndUpdate({ category }, { $set: categoryFound })
      .exec();
  }
}
