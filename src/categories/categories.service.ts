import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './interfaces/category.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
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
}
