import {FromResponseFactory, GameType, AchievementFactory, AchievementTypes, Achievement, GameTitle} from "../main";
import {isNullOrUndefined} from "util";

export class PlayerGameInfo {
    constructor(readonly type: GameType, readonly points: number) {}

    // returns the current title or nothing
    async currentTitle(maxCacheAge: number = 24*60*60*1000): Promise<GameTitle>{
      const titles = await this.type.titles(maxCacheAge);

      if(Object.keys(this).indexOf("title") != -1){
        const mayContainsTitle = titles.filter(title => title.name === (this as any).title);

        if(mayContainsTitle.length > 0){
            return mayContainsTitle[0];
        }else{
            return new GameTitle(this.type, (this as any).title, -1, (this as any).title, (this as any).title)
        }
      }else{
        const mayContainsTitle = titles.filter(title => title.requiredPoints <= this.points && !title.topRank);

        if (mayContainsTitle.length > 0) {
            return mayContainsTitle[mayContainsTitle.length - 1];
        } else {
            return;
        }
      }
    }
}

export class RawPlayerGameInfo extends PlayerGameInfo {
    constructor(type: GameType, readonly data) {
        super(type, data["total_points"] || data["points"] || 0);
    }
}

export abstract class PlayerGameInfoAchievements{
    achievements: Achievement[];
}

export interface PlayerGameInfoFactoryAchievements{
    achievements(achievements: Achievement[]): this;
}

export abstract class PlayerGameInfoFactory<T> implements FromResponseFactory<T> {
    protected _points: number = 0;

    points(points: number){
        this._points = points;
        return this;
    }

    create(): T {
        return null;
    }

    fromResponse(res: any): FromResponseFactory<T> {
        return this;
    }
}

export class RawPlayerGameInfoFactory extends PlayerGameInfoFactory<RawPlayerGameInfo> {
    private _data;
    private _type: GameType;

    create(): RawPlayerGameInfo {
        return new RawPlayerGameInfo(this._type, this._data);
    }

    fromResponse(res: any): FromResponseFactory<RawPlayerGameInfo> {
        return this.data(res);
    }

    data(data){
        this._data = data;
        return this;
    }

    type(type: GameType){
        this._type = type;
        return this;
    }
}

export function createAchievementsFromAchievementResponse(type: GameType, data): Achievement[]{
    if(isNullOrUndefined(data)) return [];

    return Object.entries(data)
        .filter(([id, data]) => id !== "version")
        .map(([id, data]) =>
            new AchievementFactory()
                .type(AchievementTypes.GAME)
                .game(type)
                .id(id)
                .fromResponse(data)
                .create()
        )
}

export function createDateFromResponse(num: number): Date{
    if(num > 10000000000){
        return new Date(num)
    }else{
        return new Date(num * 1000)
    }
}