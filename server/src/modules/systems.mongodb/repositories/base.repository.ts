import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { Document, FilterQuery, Model, QueryOptions, UpdateQuery, UpdateWithAggregationPipeline } from 'mongoose'
import { DeleteResult, UpdateOptions, UpdateResult } from 'mongodb'

@Injectable()
export abstract class BaseRepository<T extends Document> implements OnApplicationBootstrap {
  protected constructor(protected readonly model: Model<T>) {}

  async onApplicationBootstrap() {
    await this.createCollection()
    await this.seed()
  }

  protected async isCollectionExists(): Promise<boolean> {
    const result = await this.model.db.db.listCollections({ name: this.model.collection.collectionName }).next()

    return !!result
  }

  protected async seed(): Promise<void> {
    return
  }

  async createCollection() {
    if (!(await this.isCollectionExists())) {
      await this.model.createCollection()
    }
  }

  async dropCollection() {
    if (await this.isCollectionExists()) {
      await this.model.collection.drop()
    }
  }

  async create(doc: any): Promise<T> {
    const data = await this.model.create(doc)
    return data ? data.toObject() : data
  }

  async createMany(docs: any[]): Promise<T[]> {
    return await this.model.insertMany(docs)
  }

  async find(filter?: FilterQuery<T>, options?: QueryOptions<T>): Promise<T[]> {
    return await this.model.find(filter, {}, options).exec()
  }

  async count(filter?: FilterQuery<T>): Promise<number> {
    return await this.model.countDocuments(filter).exec()
  }

  async findOne(filter?: FilterQuery<T>, options?: QueryOptions<T>): Promise<T> {
    const data = await this.model.findOne(filter, {}, options).exec()
    return data ? data.toObject() : data
  }

  async findOneById(id: string, options?: QueryOptions<T>): Promise<T> {
    const data = await this.model.findOne({ _id: id }, {}, options).exec()
    return data ? data.toObject() : data
  }

  async findOneAndUpdate(
    filter: FilterQuery<T>,
    update?: UpdateWithAggregationPipeline | UpdateQuery<T>,
    options?: QueryOptions<T>
  ): Promise<T> {
    return await this.model.findOneAndUpdate(filter, update, options).exec()
  }

  async updateOne(filter: FilterQuery<T>, update?: UpdateWithAggregationPipeline | UpdateQuery<T>): Promise<T> {
    return await this.model
      .findOneAndUpdate(filter, update, {
        new: true,
        upsert: true,
        returnOriginal: false,
      })
      .exec()
  }

  async updateById(id: string, update?: UpdateWithAggregationPipeline | UpdateQuery<T>): Promise<T> {
    return await this.model
      .findOneAndUpdate({ _id: id }, update, {
        new: true,
        upsert: true,
        returnOriginal: false,
      })
      .exec()
  }

  async updateMany(
    filter?: FilterQuery<T>,
    update?: UpdateWithAggregationPipeline | UpdateQuery<T>,
    options?: UpdateOptions
  ): Promise<UpdateResult> {
    return await this.model.updateMany(filter, update, options).exec()
  }

  async updateManyByIds(
    ids: string[],
    update?: UpdateWithAggregationPipeline | UpdateQuery<T>,
    options?: UpdateOptions
  ): Promise<UpdateResult> {
    return await this.model.updateMany({ _id: { $in: ids } }, update, options).exec()
  }

  async deleteOne(filter: FilterQuery<T>): Promise<DeleteResult> {
    return await this.model.deleteOne(filter).exec()
  }

  async deleteOneById(id: string): Promise<DeleteResult> {
    return await this.model.deleteOne({ _id: id }).exec()
  }

  async deleteMany(filter: FilterQuery<T>): Promise<DeleteResult> {
    return await this.model.deleteMany(filter).exec()
  }

  async deleteManyByIds(ids: string[]): Promise<DeleteResult> {
    return await this.model.deleteMany({ _id: { $in: ids } }).exec()
  }

  async distinct(field: string, filter?: FilterQuery<T>): Promise<any[]> {
    return await this.model.distinct(field, filter).exec()
  }
}
