import {PlayerGameInfo, PlayerGameInfoFactory, GameTypes, Achievement, AchievementFactory, AchievementTypes} from "../main";

export class BedPlayerGameInfo extends PlayerGameInfo{
    constructor(points: number, readonly firstLogin: Date, readonly lastLogin: Date, readonly victories: number,
                readonly gamesPlayed: number, readonly kills: number, readonly deaths: number,
                readonly bedsDestroyed: number, readonly teamsEliminated, readonly achievements: Achievement[]) {
        super(points);
    }
}

export class BedPlayerGameInfoFactory extends PlayerGameInfoFactory<BedPlayerGameInfo> {
    private _firstLogin : Date;
    private _lastLogin : Date;
    private _victories : number;
    private _gamesPlayed : number;
    private _kills : number;
    private _deaths : number;
    private _bedsDestroyed : number;
    private _teamsEliminated : number;
    private _achievements: Achievement[];

    create(): BedPlayerGameInfo {
        return new BedPlayerGameInfo(this._points, this._firstLogin, this._lastLogin, this._victories,
            this._gamesPlayed, this._kills, this._deaths, this._bedsDestroyed,
            this._teamsEliminated, this._achievements);
    }

    fromResponse(res){
        return this.points(res.total_points)
            .victories(res.victories)
            .gamesPlayed(res.games_played)
            .kills(res.kills)
            .deaths(res.deaths)
            .bedsDestroyed(res.beds_destroyed)
            .teamsEliminated(res.teams_eliminated)
            .firstLogin(new Date(res.firstLogin * 1000))
            .lastLogin(new Date(res.lastlogin*1000))
            .achievements(res.achievements.map(achievement =>
                new AchievementFactory()
                    .type(AchievementTypes.GAME)
                    .game(GameTypes.BED)
                    .fromResponse(achievement)
                    .create()
            ));
    }

    firstLogin(firstLogin : Date){
        this._firstLogin = firstLogin;
        return this;
    }

    lastLogin(lastLogin : Date){
        this._lastLogin = lastLogin;
        return this;
    }

    victories(victories : number){
        this._victories = victories;
        return this;
    }

    gamesPlayed(gamesPlayed : number){
        this._gamesPlayed = gamesPlayed;
        return this;
    }

    kills(kills : number){
        this._kills = kills;
        return this;
    }

    deaths(deaths : number){
        this._deaths = deaths;
        return this;
    }

    bedsDestroyed(bedsDestroyed : number){
        this._bedsDestroyed = bedsDestroyed;
        return this;
    }

    teamsEliminated(teamsEliminated : number){
        this._teamsEliminated = teamsEliminated;
        return this;
    }

    achievements(achievements){
        this._achievements = achievements;
        return this;
    }
}