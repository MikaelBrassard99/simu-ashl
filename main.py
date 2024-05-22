from flask import Flask, make_response, render_template, request, jsonify
# importing pandas as pd
import pandas as pd
import numpy as np
import sqlite3



app = Flask(__name__, template_folder='template', static_folder='static')

data = None
generalStatsColumns = ['FO', 'FG', 'CK', 'ST','EN', 'DU', 'SK', 'PH', 'PA', 'SC', 'DF', 'EX', 'LD', 'DI']

config_bd = {
    "MinimumGamePlayed" : 0
}


bd = 'ASHL14-STHS.db'
bd_draft = 'ashl2024_draft.db'

# @app.after_request
# def add_header(response):
#     """
#     Add headers to both force latest IE rendering engine or Chrome Frame,
#     and also to cache the rendered page for 10 minutes.
#     """
#     response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
#     response.headers['Cache-Control'] = 'public, max-age=300'
#     return response

@app.route("/")
def allStats():
  
    conn = sqlite3.connect(bd)

    #sql query to match PalyerInfo and PlayerStat who play Pro(status > 1) and have played a minimum of MinimumGamePlayed in config_bd variable
    queryGeneral = 'SELECT PlayerProStat.Name, PlayerInfo.TeamName, PlayerInfo.PosC, PlayerInfo.PosLW, PlayerInfo.PosRW, PlayerInfo.PosD, PlayerInfo.SalaryAverage, PlayerInfo.CK, PlayerInfo.FG, PlayerInfo.DI, PlayerInfo.SK, PlayerInfo.ST, PlayerInfo.EN, PlayerInfo.DU, PlayerInfo.PH, PlayerInfo.FO, PlayerInfo.PA, PlayerInfo.SC, PlayerInfo.DF, PlayerInfo.PS, PlayerInfo.EX, PlayerInfo.LD, PlayerInfo.PO, PlayerProStat.GP, PlayerProStat.Shots, PlayerProStat.G, PlayerProStat.A, PlayerProStat.P, PlayerProStat.PlusMinus, PlayerProStat.Pim, PlayerProStat.ShotsBlock, PlayerProStat.OwnShotsBlock, PlayerProStat.OwnShotsMissGoal, PlayerProStat.Hits, PlayerProStat.HitsTook, PlayerProStat.GW, PlayerProStat.GT, PlayerProStat.FaceOffWon, PlayerProStat.FaceOffTotal, PlayerProStat.PPG, PlayerProStat.PPA, PlayerProStat.PPP, PlayerProStat.PPShots, PlayerProStat.PKG, PlayerProStat.PKA, PlayerProStat.PKP, PlayerProStat.PKShots, PlayerProStat.GiveAway, PlayerProStat.TakeAway, PlayerProStat.PuckPossesionTime  FROM PlayerProStat LEFT JOIN PlayerInfo ON PlayerProStat.Number = PlayerInfo.Number where PlayerProStat.GP <> 0 and PlayerInfo.Status1 > 1 ORDER BY PlayerInfo.Name' 
    #queryGeneral = 'SELECT PlayerProStat.Name, PlayerInfo.TeamName, PlayerInfo.PosC, PlayerInfo.PosLW, PlayerInfo.PosRW, PlayerInfo.PosD, PlayerInfo.SalaryAverage, PlayerInfo.CK, PlayerInfo.FG, PlayerInfo.DI, PlayerInfo.SK, PlayerInfo.ST, PlayerInfo.EN, PlayerInfo.DU, PlayerInfo.PH, PlayerInfo.FO, PlayerInfo.PA, PlayerInfo.SC, PlayerInfo.DF, PlayerInfo.PS, PlayerInfo.EX, PlayerInfo.LD, PlayerInfo.PO, PlayerProStat.GP, PlayerProStat.Shots, PlayerProStat.G, PlayerProStat.A, PlayerProStat.P, PlayerProStat.PlusMinus, PlayerProStat.Pim, PlayerProStat.ShotsBlock, PlayerProStat.OwnShotsBlock, PlayerProStat.OwnShotsMissGoal, PlayerProStat.Hits, PlayerProStat.HitsTook, PlayerProStat.GW, PlayerProStat.GT, PlayerProStat.FaceOffWon, PlayerProStat.FaceOffTotal, PlayerProStat.PPG, PlayerProStat.PPA, PlayerProStat.PPP, PlayerProStat.PPShots, PlayerProStat.PKG, PlayerProStat.PKA, PlayerProStat.PKP, PlayerProStat.PKShots, PlayerProStat.GiveAway, PlayerProStat.TakeAway, PlayerProStat.PuckPossesionTime  FROM PlayerProStat LEFT JOIN PlayerInfo ON PlayerProStat.Number = PlayerInfo.Number where PlayerProStat.GP <> 0 and PlayerInfo.Status1 > 1 ORDER BY PlayerInfo.Name' 
    queryTeam = 'SELECT TeamProInfo.Number, TeamProInfo.Name from TeamProInfo' 

    df_gen = pd.read_sql(queryGeneral, conn)
    df_team = pd.read_sql(queryTeam, conn)

    #config_bd["MinimumGamePlayed"] = ((df_gen['GP'].max()/2))

    queryForward = f'SELECT PlayerProStat.Name, PlayerInfo.TeamName, PlayerInfo.PosC, PlayerInfo.PosLW, PlayerInfo.PosRW, PlayerInfo.PosD, PlayerInfo.SalaryAverage, PlayerInfo.CK, PlayerInfo.FG, PlayerInfo.DI, PlayerInfo.SK, PlayerInfo.ST, PlayerInfo.EN, PlayerInfo.DU, PlayerInfo.PH, PlayerInfo.FO, PlayerInfo.PA, PlayerInfo.SC, PlayerInfo.DF, PlayerInfo.PS, PlayerInfo.EX, PlayerInfo.LD, PlayerInfo.PO, PlayerProStat.GP, PlayerProStat.Shots, PlayerProStat.G, PlayerProStat.A, PlayerProStat.P, PlayerProStat.PlusMinus, PlayerProStat.Pim, PlayerProStat.ShotsBlock, PlayerProStat.OwnShotsBlock, PlayerProStat.OwnShotsMissGoal, PlayerProStat.Hits, PlayerProStat.HitsTook, PlayerProStat.GW, PlayerProStat.GT, PlayerProStat.FaceOffWon, PlayerProStat.FaceOffTotal, PlayerProStat.PPG, PlayerProStat.PPA, PlayerProStat.PPP, PlayerProStat.PPShots, PlayerProStat.PKG, PlayerProStat.PKA, PlayerProStat.PKP, PlayerProStat.PKShots, PlayerProStat.GiveAway, PlayerProStat.TakeAway, PlayerProStat.PuckPossesionTime  FROM PlayerProStat LEFT JOIN PlayerInfo ON PlayerProStat.Number = PlayerInfo.Number where  PlayerInfo.Status1 > 1 and PlayerInfo.PosD = "False" and PlayerProStat.GP >= "{config_bd["MinimumGamePlayed"]}"'
    queryDefence = f'SELECT PlayerProStat.Name, PlayerInfo.TeamName, PlayerInfo.PosC, PlayerInfo.PosLW, PlayerInfo.PosRW, PlayerInfo.PosD, PlayerInfo.SalaryAverage, PlayerInfo.CK, PlayerInfo.FG, PlayerInfo.DI, PlayerInfo.SK, PlayerInfo.ST, PlayerInfo.EN, PlayerInfo.DU, PlayerInfo.PH, PlayerInfo.FO, PlayerInfo.PA, PlayerInfo.SC, PlayerInfo.DF, PlayerInfo.PS, PlayerInfo.EX, PlayerInfo.LD, PlayerInfo.PO, PlayerProStat.GP, PlayerProStat.Shots, PlayerProStat.G, PlayerProStat.A, PlayerProStat.P, PlayerProStat.PlusMinus, PlayerProStat.Pim, PlayerProStat.ShotsBlock, PlayerProStat.OwnShotsBlock, PlayerProStat.OwnShotsMissGoal, PlayerProStat.Hits, PlayerProStat.HitsTook, PlayerProStat.GW, PlayerProStat.GT, PlayerProStat.FaceOffWon, PlayerProStat.FaceOffTotal, PlayerProStat.PPG, PlayerProStat.PPA, PlayerProStat.PPP, PlayerProStat.PPShots, PlayerProStat.PKG, PlayerProStat.PKA, PlayerProStat.PKP, PlayerProStat.PKShots, PlayerProStat.GiveAway, PlayerProStat.TakeAway, PlayerProStat.PuckPossesionTime  FROM PlayerProStat LEFT JOIN PlayerInfo ON PlayerProStat.Number = PlayerInfo.Number where  PlayerInfo.Status1 > 1 and PlayerInfo.PosD = "True" and PlayerProStat.GP >= "{config_bd["MinimumGamePlayed"]}"'
    df_Fwd = pd.read_sql(queryForward, conn)
    df_Def = pd.read_sql(queryDefence, conn)
        
    conn.close() 
    return render_template("allStats.html", league_data=df_gen, team_data=df_team, average_Def=generateOVStats(df_Def), average_Fwd=generateOVStats(df_Fwd), avg_league_stat_fwd=generateStats(df_Fwd, generalStatsColumns)[1], avg_league_stat_def=generateStats(df_Def, generalStatsColumns)[1], label_min_played_game = config_bd["MinimumGamePlayed"])
        # Handle other request methods
@app.route("/graphChart")
def graphChart():
    return render_template("billy_beane.html")

@app.route("/about")
def aboutPage():
    return render_template("about.html")

@app.route("/draft")
def draft():
    conn = sqlite3.connect(bd_draft)
    queryGeneral = 'SELECT player_infos.player, player_infos.team, player_infos.league, player_infos.born, player_infos.ht, player_infos.wt, player_infos.s, player_stats.gp, player_stats.g, player_stats.a, player_stats.tpts, player_stats.pim , CAST(player_stats.tpts/player_stats.gp as charrarar) as ppm FROM player_infos LEFT JOIN player_stats ON player_infos.id = player_stats.id ORDER BY player_infos.id' 
    
    pd.options.display.float_format = '{:,.0f}'.format
    df_gen = pd.read_sql(queryGeneral, conn)
    dataSerie = ([''] * (df_gen.shape[0]))
    df_gen.insert(2, 'isPicked', dataSerie, True)
    
    df_styled = df_gen.to_html(classes='sortable').replace('<td>', '<td align="middle">').replace('<th>', '<th align="middle">').replace('<tr>', '<tr class="tr_table">')
    return render_template('draft.html', data = df_styled)

#***********************REGARDER comment handle les joueurs intouvés**********************    
@app.route("/updateChart", methods=['GET', 'POST'])
def updateChart():
   
    try:
        set_global(request.json)
    except:
        print("An exception occurred")    
    conn = sqlite3.connect(bd)

    if data:
        querySelectedPlayer = f'SELECT PlayerProStat.Name, PlayerInfo.TeamName, PlayerInfo.PosC, PlayerInfo.PosLW, PlayerInfo.PosRW, PlayerInfo.PosD, PlayerInfo.SalaryAverage, PlayerInfo.CK, PlayerInfo.FG, PlayerInfo.DI, PlayerInfo.SK, PlayerInfo.ST, PlayerInfo.EN, PlayerInfo.DU, PlayerInfo.PH, PlayerInfo.FO, PlayerInfo.PA, PlayerInfo.SC, PlayerInfo.DF, PlayerInfo.PS, PlayerInfo.EX, PlayerInfo.LD, PlayerInfo.PO, PlayerProStat.GP, PlayerProStat.Shots, PlayerProStat.G, PlayerProStat.A, PlayerProStat.P, PlayerProStat.PlusMinus, PlayerProStat.Pim, PlayerProStat.ShotsBlock, PlayerProStat.OwnShotsBlock, PlayerProStat.OwnShotsMissGoal, PlayerProStat.Hits, PlayerProStat.HitsTook, PlayerProStat.GW, PlayerProStat.GT, PlayerProStat.FaceOffWon, PlayerProStat.FaceOffTotal, PlayerProStat.PPG, PlayerProStat.PPA, PlayerProStat.PPP, PlayerProStat.PPShots, PlayerProStat.PKG, PlayerProStat.PKA, PlayerProStat.PKP, PlayerProStat.PKShots, PlayerProStat.GiveAway, PlayerProStat.TakeAway, PlayerProStat.PuckPossesionTime  FROM PlayerProStat LEFT JOIN PlayerInfo ON PlayerProStat.Number = PlayerInfo.Number where PlayerInfo.Name = "{data}"'  

    else:
        querySelectedPlayer = 'SELECT PlayerProStat.Name, PlayerInfo.TeamName, PlayerInfo.PosC, PlayerInfo.PosLW, PlayerInfo.PosRW, PlayerInfo.PosD, PlayerInfo.SalaryAverage, PlayerInfo.CK, PlayerInfo.FG, PlayerInfo.DI, PlayerInfo.SK, PlayerInfo.ST, PlayerInfo.EN, PlayerInfo.DU, PlayerInfo.PH, PlayerInfo.FO, PlayerInfo.PA, PlayerInfo.SC, PlayerInfo.DF, PlayerInfo.PS, PlayerInfo.EX, PlayerInfo.LD, PlayerInfo.PO, PlayerProStat.GP, PlayerProStat.Shots, PlayerProStat.G, PlayerProStat.A, PlayerProStat.P, PlayerProStat.PlusMinus, PlayerProStat.Pim, PlayerProStat.ShotsBlock, PlayerProStat.OwnShotsBlock, PlayerProStat.OwnShotsMissGoal, PlayerProStat.Hits, PlayerProStat.HitsTook, PlayerProStat.GW, PlayerProStat.GT, PlayerProStat.FaceOffWon, PlayerProStat.FaceOffTotal, PlayerProStat.PPG, PlayerProStat.PPA, PlayerProStat.PPP, PlayerProStat.PPShots, PlayerProStat.PKG, PlayerProStat.PKA, PlayerProStat.PKP, PlayerProStat.PKShots, PlayerProStat.GiveAway, PlayerProStat.TakeAway, PlayerProStat.PuckPossesionTime  FROM PlayerProStat LEFT JOIN PlayerInfo ON PlayerProStat.Number = PlayerInfo.Number where PlayerInfo.Name = "Max Jones"' 

    df_PlayerSel = pd.read_sql(querySelectedPlayer, conn)
    
    teamNameFromPlayerSel = df_PlayerSel['TeamName'][0]
    querySelectedAllPlayerFromTeamId = f'SELECT PlayerProStat.Name, PlayerInfo.TeamName, PlayerInfo.PosC, PlayerInfo.PosLW, PlayerInfo.PosRW, PlayerInfo.PosD, PlayerInfo.SalaryAverage, PlayerInfo.CK, PlayerInfo.FG, PlayerInfo.DI, PlayerInfo.SK, PlayerInfo.ST, PlayerInfo.EN, PlayerInfo.DU, PlayerInfo.PH, PlayerInfo.FO, PlayerInfo.PA, PlayerInfo.SC, PlayerInfo.DF, PlayerInfo.PS, PlayerInfo.EX, PlayerInfo.LD, PlayerInfo.PO, PlayerProStat.GP, PlayerProStat.Shots, PlayerProStat.G, PlayerProStat.A, PlayerProStat.P, PlayerProStat.PlusMinus, PlayerProStat.Pim, PlayerProStat.ShotsBlock, PlayerProStat.OwnShotsBlock, PlayerProStat.OwnShotsMissGoal, PlayerProStat.Hits, PlayerProStat.HitsTook, PlayerProStat.GW, PlayerProStat.GT, PlayerProStat.FaceOffWon, PlayerProStat.FaceOffTotal, PlayerProStat.PPG, PlayerProStat.PPA, PlayerProStat.PPP, PlayerProStat.PPShots, PlayerProStat.PKG, PlayerProStat.PKA, PlayerProStat.PKP, PlayerProStat.PKShots, PlayerProStat.GiveAway, PlayerProStat.TakeAway, PlayerProStat.PuckPossesionTime  FROM PlayerProStat LEFT JOIN PlayerInfo ON PlayerProStat.Number = PlayerInfo.Number where PlayerInfo.TeamName = "{teamNameFromPlayerSel}"'
    df_AllPlayerFromTeamId = pd.read_sql(querySelectedAllPlayerFromTeamId, conn)
    #verify if player is D or Fwd
    conn.close() 
    #show all player of the team where the player is at
    response_data = {'values':df_PlayerSel.to_json(orient='records'), 'labels': generalStatsColumns, 'playerSelSorted': generateOVStats(df_PlayerSel).to_json(orient='records'), 'playersFromTeamSel' : generateOVStats(df_AllPlayerFromTeamId).to_json(orient='records')} 
    return jsonify(response_data)

@app.route("/getPlayersStatsFromTeam", methods=['GET', 'POST'])
def updateLine():
   
    teamName = request.json
    conn = sqlite3.connect(bd)

    querySelectedTeamLine = f'SELECT TeamProInfo.Number, TeamProInfo.Name, TeamProLines.Line15vs5ForwardCenter, TeamProLines.Line15vs5ForwardLeftWing, TeamProLines.Line15vs5ForwardRightWing, TeamProLines.Line15vs5DefenseDefense1, TeamProLines.Line15vs5DefenseDefense2, TeamProLines.Line25vs5ForwardCenter, TeamProLines.Line25vs5ForwardLeftWing, TeamProLines.Line25vs5ForwardRightWing, TeamProLines.Line25vs5DefenseDefense1, TeamProLines.Line25vs5DefenseDefense2, TeamProLines.Line35vs5ForwardCenter, TeamProLines.Line35vs5ForwardLeftWing, TeamProLines.Line35vs5ForwardRightWing, TeamProLines.Line35vs5DefenseDefense1, TeamProLines.Line35vs5DefenseDefense2, TeamProLines.Line45vs5ForwardCenter, TeamProLines.Line45vs5ForwardLeftWing, TeamProLines.Line45vs5ForwardRightWing FROM TeamProInfo LEFT JOIN TeamProLines ON TeamProInfo.Number = TeamProLines.TeamNumber WHERE TeamProLines.Day = 1 and TeamProInfo.Name = "{teamName}"' 

    df_PlayerStatsFromTeam = pd.read_sql(querySelectedTeamLine, conn)

    conn.close() 
    #show all player of the team where the player is at
    response_data = {'values':df_PlayerStatsFromTeam.to_json(orient='records')} 
    return jsonify(response_data)

@app.route("/updateDataOnDblClick", methods=['GET', 'POST'])
def updateChartDC():
    
    playerName = request.args.get('playerName')
    conn = sqlite3.connect(bd)
    querySelectedPlayer = f'SELECT PlayerProStat.Name, PlayerInfo.TeamName, PlayerInfo.PosC, PlayerInfo.PosLW, PlayerInfo.PosRW, PlayerInfo.PosD, PlayerInfo.SalaryAverage, PlayerInfo.CK, PlayerInfo.FG, PlayerInfo.DI, PlayerInfo.SK, PlayerInfo.ST, PlayerInfo.EN, PlayerInfo.DU, PlayerInfo.PH, PlayerInfo.FO, PlayerInfo.PA, PlayerInfo.SC, PlayerInfo.DF, PlayerInfo.PS, PlayerInfo.EX, PlayerInfo.LD, PlayerInfo.PO, PlayerProStat.GP, PlayerProStat.Shots, PlayerProStat.G, PlayerProStat.A, PlayerProStat.P, PlayerProStat.PlusMinus, PlayerProStat.Pim, PlayerProStat.ShotsBlock, PlayerProStat.OwnShotsBlock, PlayerProStat.OwnShotsMissGoal, PlayerProStat.Hits, PlayerProStat.HitsTook, PlayerProStat.GW, PlayerProStat.GT, PlayerProStat.FaceOffWon, PlayerProStat.FaceOffTotal, PlayerProStat.PPG, PlayerProStat.PPA, PlayerProStat.PPP, PlayerProStat.PPShots, PlayerProStat.PKG, PlayerProStat.PKA, PlayerProStat.PKP, PlayerProStat.PKShots, PlayerProStat.GiveAway, PlayerProStat.TakeAway, PlayerProStat.PuckPossesionTime  FROM PlayerProStat LEFT JOIN PlayerInfo ON PlayerProStat.Number = PlayerInfo.Number where PlayerInfo.Name = "{playerName}"'  
    df_PlayerSel = pd.read_sql(querySelectedPlayer, conn)
    teamNameFromPlayerSel = df_PlayerSel['TeamName'][0]
    querySelectedAllPlayerFromTeamId = f'SELECT PlayerProStat.Name, PlayerInfo.TeamName, PlayerInfo.PosC, PlayerInfo.PosLW, PlayerInfo.PosRW, PlayerInfo.PosD, PlayerInfo.SalaryAverage, PlayerInfo.CK, PlayerInfo.FG, PlayerInfo.DI, PlayerInfo.SK, PlayerInfo.ST, PlayerInfo.EN, PlayerInfo.DU, PlayerInfo.PH, PlayerInfo.FO, PlayerInfo.PA, PlayerInfo.SC, PlayerInfo.DF, PlayerInfo.PS, PlayerInfo.EX, PlayerInfo.LD, PlayerInfo.PO, PlayerProStat.GP, PlayerProStat.Shots, PlayerProStat.G, PlayerProStat.A, PlayerProStat.P, PlayerProStat.PlusMinus, PlayerProStat.Pim, PlayerProStat.ShotsBlock, PlayerProStat.OwnShotsBlock, PlayerProStat.OwnShotsMissGoal, PlayerProStat.Hits, PlayerProStat.HitsTook, PlayerProStat.GW, PlayerProStat.GT, PlayerProStat.FaceOffWon, PlayerProStat.FaceOffTotal, PlayerProStat.PPG, PlayerProStat.PPA, PlayerProStat.PPP, PlayerProStat.PPShots, PlayerProStat.PKG, PlayerProStat.PKA, PlayerProStat.PKP, PlayerProStat.PKShots, PlayerProStat.GiveAway, PlayerProStat.TakeAway, PlayerProStat.PuckPossesionTime  FROM PlayerProStat LEFT JOIN PlayerInfo ON PlayerProStat.Number = PlayerInfo.Number where PlayerInfo.TeamName = "{teamNameFromPlayerSel}"'
    df_AllPlayerFromTeamId = pd.read_sql(querySelectedAllPlayerFromTeamId, conn)
    #verify if player is D or Fwd
    conn.close() 
    #show all player of the team where the player is at
    response_data = {'values':df_PlayerSel.to_json(orient='records'), 'labels': generalStatsColumns, 'playerSelSorted': generateOVStats(df_PlayerSel).to_json(orient='records'), 'playersFromTeamSel' : generateOVStats(df_AllPlayerFromTeamId).to_json(orient='records')} 
    return jsonify(response_data)
#get one player on mouse over
@app.route("/getStatFromPlayerName", methods=['GET', 'POST'])
def getStat():
   
    playerName = request.args.get('playerName')
    conn = sqlite3.connect(bd)

    querySelectedPlayer = f'SELECT PlayerProStat.Name, PlayerInfo.TeamName, PlayerInfo.PosC, PlayerInfo.PosLW, PlayerInfo.PosRW, PlayerInfo.PosD, PlayerInfo.SalaryAverage, PlayerInfo.CK, PlayerInfo.FG, PlayerInfo.DI, PlayerInfo.SK, PlayerInfo.ST, PlayerInfo.EN, PlayerInfo.DU, PlayerInfo.PH, PlayerInfo.FO, PlayerInfo.PA, PlayerInfo.SC, PlayerInfo.DF, PlayerInfo.PS, PlayerInfo.EX, PlayerInfo.LD, PlayerInfo.PO, PlayerProStat.GP, PlayerProStat.Shots, PlayerProStat.G, PlayerProStat.A, PlayerProStat.P, PlayerProStat.PlusMinus, PlayerProStat.Pim, PlayerProStat.ShotsBlock, PlayerProStat.OwnShotsBlock, PlayerProStat.OwnShotsMissGoal, PlayerProStat.Hits, PlayerProStat.HitsTook, PlayerProStat.GW, PlayerProStat.GT, PlayerProStat.FaceOffWon, PlayerProStat.FaceOffTotal, PlayerProStat.PPG, PlayerProStat.PPA, PlayerProStat.PPP, PlayerProStat.PPShots, PlayerProStat.PKG, PlayerProStat.PKA, PlayerProStat.PKP, PlayerProStat.PKShots, PlayerProStat.GiveAway, PlayerProStat.TakeAway, PlayerProStat.PuckPossesionTime  FROM PlayerProStat LEFT JOIN PlayerInfo ON PlayerProStat.Number = PlayerInfo.Number where PlayerInfo.Name = "{playerName}"'  

    df_PlayerSel = pd.read_sql(querySelectedPlayer, conn)
    
    teamNameFromPlayerSel = df_PlayerSel['TeamName'][0]
    querySelectedAllPlayerFromTeamId = f'SELECT PlayerProStat.Name, PlayerInfo.TeamName, PlayerInfo.PosC, PlayerInfo.PosLW, PlayerInfo.PosRW, PlayerInfo.PosD, PlayerInfo.SalaryAverage, PlayerInfo.CK, PlayerInfo.FG, PlayerInfo.DI, PlayerInfo.SK, PlayerInfo.ST, PlayerInfo.EN, PlayerInfo.DU, PlayerInfo.PH, PlayerInfo.FO, PlayerInfo.PA, PlayerInfo.SC, PlayerInfo.DF, PlayerInfo.PS, PlayerInfo.EX, PlayerInfo.LD, PlayerInfo.PO, PlayerProStat.GP, PlayerProStat.Shots, PlayerProStat.G, PlayerProStat.A, PlayerProStat.P, PlayerProStat.PlusMinus, PlayerProStat.Pim, PlayerProStat.ShotsBlock, PlayerProStat.OwnShotsBlock, PlayerProStat.OwnShotsMissGoal, PlayerProStat.Hits, PlayerProStat.HitsTook, PlayerProStat.GW, PlayerProStat.GT, PlayerProStat.FaceOffWon, PlayerProStat.FaceOffTotal, PlayerProStat.PPG, PlayerProStat.PPA, PlayerProStat.PPP, PlayerProStat.PPShots, PlayerProStat.PKG, PlayerProStat.PKA, PlayerProStat.PKP, PlayerProStat.PKShots, PlayerProStat.GiveAway, PlayerProStat.TakeAway, PlayerProStat.PuckPossesionTime  FROM PlayerProStat LEFT JOIN PlayerInfo ON PlayerProStat.Number = PlayerInfo.Number where PlayerInfo.TeamName = "{teamNameFromPlayerSel}"'
    df_AllPlayerFromTeamId = pd.read_sql(querySelectedAllPlayerFromTeamId, conn)
    #verify if player is D or Fwd
    conn.close() 
    #show all player of the team where the player is at
    response_data = {'values':df_PlayerSel.to_json(orient='records'), 'labels': generalStatsColumns, 'playerSelSorted': generateOVStats(df_PlayerSel).to_json(orient='records'), 'playersFromTeamSel' : generateOVStats(df_AllPlayerFromTeamId).to_json(orient='records')} 
    return jsonify(response_data) 
 
#get stats from foward LW C RW
@app.route("/getStatFromPlayersName", methods=['GET', 'POST'])
def getStats():
    conn = sqlite3.connect(bd)
    playerName1 = request.args.get('playerName1')
    playerName2 = request.args.get('playerName2')
    playerName3 = request.args.get('playerName3')
    if playerName1 != '':
        querySelectedPlayer = f'SELECT PlayerProStat.Name, PlayerInfo.TeamName, PlayerInfo.PosC, PlayerInfo.PosLW, PlayerInfo.PosRW, PlayerInfo.PosD, PlayerInfo.SalaryAverage, PlayerInfo.CK, PlayerInfo.FG, PlayerInfo.DI, PlayerInfo.SK, PlayerInfo.ST, PlayerInfo.EN, PlayerInfo.DU, PlayerInfo.PH, PlayerInfo.FO, PlayerInfo.PA, PlayerInfo.SC, PlayerInfo.DF, PlayerInfo.PS, PlayerInfo.EX, PlayerInfo.LD, PlayerInfo.PO, PlayerProStat.GP, PlayerProStat.Shots, PlayerProStat.G, PlayerProStat.A, PlayerProStat.P, PlayerProStat.PlusMinus, PlayerProStat.Pim, PlayerProStat.ShotsBlock, PlayerProStat.OwnShotsBlock, PlayerProStat.OwnShotsMissGoal, PlayerProStat.Hits, PlayerProStat.HitsTook, PlayerProStat.GW, PlayerProStat.GT, PlayerProStat.FaceOffWon, PlayerProStat.FaceOffTotal, PlayerProStat.PPG, PlayerProStat.PPA, PlayerProStat.PPP, PlayerProStat.PPShots, PlayerProStat.PKG, PlayerProStat.PKA, PlayerProStat.PKP, PlayerProStat.PKShots, PlayerProStat.GiveAway, PlayerProStat.TakeAway, PlayerProStat.PuckPossesionTime  FROM PlayerProStat LEFT JOIN PlayerInfo ON PlayerProStat.Number = PlayerInfo.Number where PlayerInfo.Name = "{playerName1}"'
        df_Player1 = pd.read_sql(querySelectedPlayer, conn)
    if playerName2 != '':
        querySelectedPlayer = f'SELECT PlayerProStat.Name, PlayerInfo.TeamName, PlayerInfo.PosC, PlayerInfo.PosLW, PlayerInfo.PosRW, PlayerInfo.PosD, PlayerInfo.SalaryAverage, PlayerInfo.CK, PlayerInfo.FG, PlayerInfo.DI, PlayerInfo.SK, PlayerInfo.ST, PlayerInfo.EN, PlayerInfo.DU, PlayerInfo.PH, PlayerInfo.FO, PlayerInfo.PA, PlayerInfo.SC, PlayerInfo.DF, PlayerInfo.PS, PlayerInfo.EX, PlayerInfo.LD, PlayerInfo.PO, PlayerProStat.GP, PlayerProStat.Shots, PlayerProStat.G, PlayerProStat.A, PlayerProStat.P, PlayerProStat.PlusMinus, PlayerProStat.Pim, PlayerProStat.ShotsBlock, PlayerProStat.OwnShotsBlock, PlayerProStat.OwnShotsMissGoal, PlayerProStat.Hits, PlayerProStat.HitsTook, PlayerProStat.GW, PlayerProStat.GT, PlayerProStat.FaceOffWon, PlayerProStat.FaceOffTotal, PlayerProStat.PPG, PlayerProStat.PPA, PlayerProStat.PPP, PlayerProStat.PPShots, PlayerProStat.PKG, PlayerProStat.PKA, PlayerProStat.PKP, PlayerProStat.PKShots, PlayerProStat.GiveAway, PlayerProStat.TakeAway, PlayerProStat.PuckPossesionTime  FROM PlayerProStat LEFT JOIN PlayerInfo ON PlayerProStat.Number = PlayerInfo.Number where PlayerInfo.Name = "{playerName2}"'  
        df_Player2 = pd.read_sql(querySelectedPlayer, conn)
    if playerName3 != '':
        querySelectedPlayer = f'SELECT PlayerProStat.Name, PlayerInfo.TeamName, PlayerInfo.PosC, PlayerInfo.PosLW, PlayerInfo.PosRW, PlayerInfo.PosD, PlayerInfo.SalaryAverage, PlayerInfo.CK, PlayerInfo.FG, PlayerInfo.DI, PlayerInfo.SK, PlayerInfo.ST, PlayerInfo.EN, PlayerInfo.DU, PlayerInfo.PH, PlayerInfo.FO, PlayerInfo.PA, PlayerInfo.SC, PlayerInfo.DF, PlayerInfo.PS, PlayerInfo.EX, PlayerInfo.LD, PlayerInfo.PO, PlayerProStat.GP, PlayerProStat.Shots, PlayerProStat.G, PlayerProStat.A, PlayerProStat.P, PlayerProStat.PlusMinus, PlayerProStat.Pim, PlayerProStat.ShotsBlock, PlayerProStat.OwnShotsBlock, PlayerProStat.OwnShotsMissGoal, PlayerProStat.Hits, PlayerProStat.HitsTook, PlayerProStat.GW, PlayerProStat.GT, PlayerProStat.FaceOffWon, PlayerProStat.FaceOffTotal, PlayerProStat.PPG, PlayerProStat.PPA, PlayerProStat.PPP, PlayerProStat.PPShots, PlayerProStat.PKG, PlayerProStat.PKA, PlayerProStat.PKP, PlayerProStat.PKShots, PlayerProStat.GiveAway, PlayerProStat.TakeAway, PlayerProStat.PuckPossesionTime  FROM PlayerProStat LEFT JOIN PlayerInfo ON PlayerProStat.Number = PlayerInfo.Number where PlayerInfo.Name = "{playerName3}"'  
        df_Player3 = pd.read_sql(querySelectedPlayer, conn)
    conn.close() 

    #show all player of the team where the player is at
    response_data = {'valuesP1':df_Player1.to_json(orient='records'), 'valuesP2':df_Player2.to_json(orient='records'), 'valuesP3':df_Player3.to_json(orient='records'),'labels': generalStatsColumns} 
    return jsonify(response_data)  
#get stats from defensman DG DD
@app.route("/getStatFromDefsName", methods=['GET', 'POST'])
def getStatsD():
    conn = sqlite3.connect(bd)
    playerName1 = request.args.get('playerName1')
    playerName2 = request.args.get('playerName2')
    if playerName1 != '':
        querySelectedPlayer = f'SELECT PlayerProStat.Name, PlayerInfo.TeamName, PlayerInfo.PosC, PlayerInfo.PosLW, PlayerInfo.PosRW, PlayerInfo.PosD, PlayerInfo.SalaryAverage, PlayerInfo.CK, PlayerInfo.FG, PlayerInfo.DI, PlayerInfo.SK, PlayerInfo.ST, PlayerInfo.EN, PlayerInfo.DU, PlayerInfo.PH, PlayerInfo.FO, PlayerInfo.PA, PlayerInfo.SC, PlayerInfo.DF, PlayerInfo.PS, PlayerInfo.EX, PlayerInfo.LD, PlayerInfo.PO, PlayerProStat.GP, PlayerProStat.Shots, PlayerProStat.G, PlayerProStat.A, PlayerProStat.P, PlayerProStat.PlusMinus, PlayerProStat.Pim, PlayerProStat.ShotsBlock, PlayerProStat.OwnShotsBlock, PlayerProStat.OwnShotsMissGoal, PlayerProStat.Hits, PlayerProStat.HitsTook, PlayerProStat.GW, PlayerProStat.GT, PlayerProStat.FaceOffWon, PlayerProStat.FaceOffTotal, PlayerProStat.PPG, PlayerProStat.PPA, PlayerProStat.PPP, PlayerProStat.PPShots, PlayerProStat.PKG, PlayerProStat.PKA, PlayerProStat.PKP, PlayerProStat.PKShots, PlayerProStat.GiveAway, PlayerProStat.TakeAway, PlayerProStat.PuckPossesionTime  FROM PlayerProStat LEFT JOIN PlayerInfo ON PlayerProStat.Number = PlayerInfo.Number where PlayerInfo.Name = "{playerName1}"'
        df_Player1 = pd.read_sql(querySelectedPlayer, conn)
    if playerName2 != '':
        querySelectedPlayer = f'SELECT PlayerProStat.Name, PlayerInfo.TeamName, PlayerInfo.PosC, PlayerInfo.PosLW, PlayerInfo.PosRW, PlayerInfo.PosD, PlayerInfo.SalaryAverage, PlayerInfo.CK, PlayerInfo.FG, PlayerInfo.DI, PlayerInfo.SK, PlayerInfo.ST, PlayerInfo.EN, PlayerInfo.DU, PlayerInfo.PH, PlayerInfo.FO, PlayerInfo.PA, PlayerInfo.SC, PlayerInfo.DF, PlayerInfo.PS, PlayerInfo.EX, PlayerInfo.LD, PlayerInfo.PO, PlayerProStat.GP, PlayerProStat.Shots, PlayerProStat.G, PlayerProStat.A, PlayerProStat.P, PlayerProStat.PlusMinus, PlayerProStat.Pim, PlayerProStat.ShotsBlock, PlayerProStat.OwnShotsBlock, PlayerProStat.OwnShotsMissGoal, PlayerProStat.Hits, PlayerProStat.HitsTook, PlayerProStat.GW, PlayerProStat.GT, PlayerProStat.FaceOffWon, PlayerProStat.FaceOffTotal, PlayerProStat.PPG, PlayerProStat.PPA, PlayerProStat.PPP, PlayerProStat.PPShots, PlayerProStat.PKG, PlayerProStat.PKA, PlayerProStat.PKP, PlayerProStat.PKShots, PlayerProStat.GiveAway, PlayerProStat.TakeAway, PlayerProStat.PuckPossesionTime  FROM PlayerProStat LEFT JOIN PlayerInfo ON PlayerProStat.Number = PlayerInfo.Number where PlayerInfo.Name = "{playerName2}"'  
        df_Player2 = pd.read_sql(querySelectedPlayer, conn)
    conn.close() 

    #show all player of the team where the player is at
    response_data = {'valuesP1':df_Player1.to_json(orient='records'), 'valuesP2':df_Player2.to_json(orient='records'),'labels': generalStatsColumns} 
    return jsonify(response_data) 
       
@app.route("/openStats")
def openStats():
     # Read CSV file
    df = pd.read_csv('static/open_one_time_covid_education_impact.csv')  #exemple for data analytics
    
    # Convert DataFrame to HTML table
    html_table = df.to_html(index=False)

    # Render HTML template with the HTML table
    return render_template('openStats.html', table=html_table)
   
def set_global(data_in):
    global data
    data = data_in

#fonction generant les stats (average stats: prends les champs de la bd et realise la moyenne des données) et (tabledata: cree une table de donnée permettant de visualiser les stats moyenne)  
def generateStats(data, statsOrder):
    averageStat = data[statsOrder].mean()
    tableData = pd.DataFrame({'Cotes': statsOrder,
                        'Moyenne': averageStat})
    return tableData,averageStat.to_json(orient='records')

def generateOVStats(data):
    averageStat = getAvgFilteredStat(data)
    #return average stats .mean round about one digit floating point
    return round(averageStat, 1)

def getAvgFilteredStat(data):
    dataFiltered = data.drop(['Name', 'TeamName', 'PosC', 'PosLW', 'PosRW', 'PosD'], axis=1).mean()
    return dataFiltered


if __name__ == "__main__":
    app.run(debug=True)  # Enable debug mode
