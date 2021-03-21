import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayersModule } from './players/players.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://alanmxll:Surtur2011@smartrankingcluster-shard-00-00.h77dw.mongodb.net:27017,smartrankingcluster-shard-00-01.h77dw.mongodb.net:27017,smartrankingcluster-shard-00-02.h77dw.mongodb.net:27017/smartranking?ssl=true&replicaSet=atlas-11oodl-shard-0&authSource=admin&retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      },
    ),
    PlayersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
