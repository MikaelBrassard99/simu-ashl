from flask import Flask, render_template, request, jsonify
# importing pandas as pd
import pandas as pd
import sqlite3

app = Flask(__name__, template_folder='template', static_folder='static')

data = None
generalStatsColumns = ['FO', 'FG', 'CK', 'ST','EN', 'DU', 'SK', 'PH', 'PA', 'SC', 'DF', 'EX', 'LD', 'DI']


@app.route("/")
def main():
    return render_template("main.html", python_variable=data)
 
 
@app.route("/allStats")
def allStats():
  
    conn = sqlite3.connect('ASHL13-STHS.db')

    #sql query to match PalyerInfo and PlayerStat who play Pro(status > 1) and have played a minimum of 1 game
    queryGeneral = 'SELECT PlayerProSeasonStat.Name, PlayerInfo.TeamName, PlayerInfo.PosC, PlayerInfo.PosLW, PlayerInfo.PosRW, PlayerInfo.PosD, PlayerInfo.SalaryAverage, PlayerInfo.CK, PlayerInfo.FG, PlayerInfo.DI, PlayerInfo.SK, PlayerInfo.ST, PlayerInfo.EN, PlayerInfo.DU, PlayerInfo.PH, PlayerInfo.FO, PlayerInfo.PA, PlayerInfo.SC, PlayerInfo.DF, PlayerInfo.PS, PlayerInfo.EX, PlayerInfo.LD, PlayerInfo.PO, PlayerProSeasonStat.GP, PlayerProSeasonStat.Shots, PlayerProSeasonStat.G, PlayerProSeasonStat.A, PlayerProSeasonStat.P, PlayerProSeasonStat.PlusMinus, PlayerProSeasonStat.Pim, PlayerProSeasonStat.ShotsBlock, PlayerProSeasonStat.OwnShotsBlock, PlayerProSeasonStat.OwnShotsMissGoal, PlayerProSeasonStat.Hits, PlayerProSeasonStat.HitsTook, PlayerProSeasonStat.GW, PlayerProSeasonStat.GT, PlayerProSeasonStat.FaceOffWon, PlayerProSeasonStat.FaceOffTotal, PlayerProSeasonStat.PPG, PlayerProSeasonStat.PPA, PlayerProSeasonStat.PPP, PlayerProSeasonStat.PPShots, PlayerProSeasonStat.PKG, PlayerProSeasonStat.PKA, PlayerProSeasonStat.PKP, PlayerProSeasonStat.PKShots, PlayerProSeasonStat.GiveAway, PlayerProSeasonStat.TakeAway, PlayerProSeasonStat.PuckPossesionTime  FROM PlayerProSeasonStat LEFT JOIN PlayerInfo ON PlayerProSeasonStat.Number = PlayerInfo.Number where PlayerProSeasonStat.GP <> 0 and PlayerInfo.Status1 > 1 and PlayerProSeasonStat.GP > 50 ORDER BY PlayerInfo.Name'  # Change 'your_table_name' to the name of your table
    queryForward = 'SELECT PlayerProSeasonStat.Name, PlayerInfo.TeamName, PlayerInfo.PosC, PlayerInfo.PosLW, PlayerInfo.PosRW, PlayerInfo.PosD, PlayerInfo.SalaryAverage, PlayerInfo.CK, PlayerInfo.FG, PlayerInfo.DI, PlayerInfo.SK, PlayerInfo.ST, PlayerInfo.EN, PlayerInfo.DU, PlayerInfo.PH, PlayerInfo.FO, PlayerInfo.PA, PlayerInfo.SC, PlayerInfo.DF, PlayerInfo.PS, PlayerInfo.EX, PlayerInfo.LD, PlayerInfo.PO, PlayerProSeasonStat.GP, PlayerProSeasonStat.Shots, PlayerProSeasonStat.G, PlayerProSeasonStat.A, PlayerProSeasonStat.P, PlayerProSeasonStat.PlusMinus, PlayerProSeasonStat.Pim, PlayerProSeasonStat.ShotsBlock, PlayerProSeasonStat.OwnShotsBlock, PlayerProSeasonStat.OwnShotsMissGoal, PlayerProSeasonStat.Hits, PlayerProSeasonStat.HitsTook, PlayerProSeasonStat.GW, PlayerProSeasonStat.GT, PlayerProSeasonStat.FaceOffWon, PlayerProSeasonStat.FaceOffTotal, PlayerProSeasonStat.PPG, PlayerProSeasonStat.PPA, PlayerProSeasonStat.PPP, PlayerProSeasonStat.PPShots, PlayerProSeasonStat.PKG, PlayerProSeasonStat.PKA, PlayerProSeasonStat.PKP, PlayerProSeasonStat.PKShots, PlayerProSeasonStat.GiveAway, PlayerProSeasonStat.TakeAway, PlayerProSeasonStat.PuckPossesionTime  FROM PlayerProSeasonStat LEFT JOIN PlayerInfo ON PlayerProSeasonStat.Number = PlayerInfo.Number where PlayerProSeasonStat.GP <> 0 and PlayerInfo.Status1 > 1 and PlayerInfo.PosD = "False" and PlayerProSeasonStat.GP > 50'  # Change 'your_table_name' to the name of your table
    queryDefence = 'SELECT PlayerProSeasonStat.Name, PlayerInfo.TeamName, PlayerInfo.PosC, PlayerInfo.PosLW, PlayerInfo.PosRW, PlayerInfo.PosD, PlayerInfo.SalaryAverage, PlayerInfo.CK, PlayerInfo.FG, PlayerInfo.DI, PlayerInfo.SK, PlayerInfo.ST, PlayerInfo.EN, PlayerInfo.DU, PlayerInfo.PH, PlayerInfo.FO, PlayerInfo.PA, PlayerInfo.SC, PlayerInfo.DF, PlayerInfo.PS, PlayerInfo.EX, PlayerInfo.LD, PlayerInfo.PO, PlayerProSeasonStat.GP, PlayerProSeasonStat.Shots, PlayerProSeasonStat.G, PlayerProSeasonStat.A, PlayerProSeasonStat.P, PlayerProSeasonStat.PlusMinus, PlayerProSeasonStat.Pim, PlayerProSeasonStat.ShotsBlock, PlayerProSeasonStat.OwnShotsBlock, PlayerProSeasonStat.OwnShotsMissGoal, PlayerProSeasonStat.Hits, PlayerProSeasonStat.HitsTook, PlayerProSeasonStat.GW, PlayerProSeasonStat.GT, PlayerProSeasonStat.FaceOffWon, PlayerProSeasonStat.FaceOffTotal, PlayerProSeasonStat.PPG, PlayerProSeasonStat.PPA, PlayerProSeasonStat.PPP, PlayerProSeasonStat.PPShots, PlayerProSeasonStat.PKG, PlayerProSeasonStat.PKA, PlayerProSeasonStat.PKP, PlayerProSeasonStat.PKShots, PlayerProSeasonStat.GiveAway, PlayerProSeasonStat.TakeAway, PlayerProSeasonStat.PuckPossesionTime  FROM PlayerProSeasonStat LEFT JOIN PlayerInfo ON PlayerProSeasonStat.Number = PlayerInfo.Number where PlayerProSeasonStat.GP <> 0 and PlayerInfo.Status1 > 1 and PlayerInfo.PosD = "True" and PlayerProSeasonStat.GP > 50'  # Change 'your_table_name' to the name of your table

    df_gen = pd.read_sql(queryGeneral, conn)
    df_Fwd = pd.read_sql(queryForward, conn)
    df_Def = pd.read_sql(queryDefence, conn)
    
    # playerSelect = pd.read_sql(queryDefence, conn)
    conn.close() 
    return render_template("allStats.html", league_data=df_gen, average_Def=generateOVStats(df_Def), average_Fwd=generateOVStats(df_Fwd), avg_league_stat_fwd=generateStats(df_Fwd, generalStatsColumns)[1], avg_league_stat_def=generateStats(df_Def, generalStatsColumns)[1])
        # Handle other request methods
        
@app.route("/updateChart", methods=['GET', 'POST'])
def updateChart():
   
    try:
        set_global(request.json)
    except:
        print("An exception occurred")    
    conn = sqlite3.connect('ASHL13-STHS.db')

    if data:
        querySelectedPlayer = f'SELECT PlayerProSeasonStat.Name, PlayerInfo.TeamName, PlayerInfo.PosC, PlayerInfo.PosLW, PlayerInfo.PosRW, PlayerInfo.PosD, PlayerInfo.SalaryAverage, PlayerInfo.CK, PlayerInfo.FG, PlayerInfo.DI, PlayerInfo.SK, PlayerInfo.ST, PlayerInfo.EN, PlayerInfo.DU, PlayerInfo.PH, PlayerInfo.FO, PlayerInfo.PA, PlayerInfo.SC, PlayerInfo.DF, PlayerInfo.PS, PlayerInfo.EX, PlayerInfo.LD, PlayerInfo.PO, PlayerProSeasonStat.GP, PlayerProSeasonStat.Shots, PlayerProSeasonStat.G, PlayerProSeasonStat.A, PlayerProSeasonStat.P, PlayerProSeasonStat.PlusMinus, PlayerProSeasonStat.Pim, PlayerProSeasonStat.ShotsBlock, PlayerProSeasonStat.OwnShotsBlock, PlayerProSeasonStat.OwnShotsMissGoal, PlayerProSeasonStat.Hits, PlayerProSeasonStat.HitsTook, PlayerProSeasonStat.GW, PlayerProSeasonStat.GT, PlayerProSeasonStat.FaceOffWon, PlayerProSeasonStat.FaceOffTotal, PlayerProSeasonStat.PPG, PlayerProSeasonStat.PPA, PlayerProSeasonStat.PPP, PlayerProSeasonStat.PPShots, PlayerProSeasonStat.PKG, PlayerProSeasonStat.PKA, PlayerProSeasonStat.PKP, PlayerProSeasonStat.PKShots, PlayerProSeasonStat.GiveAway, PlayerProSeasonStat.TakeAway, PlayerProSeasonStat.PuckPossesionTime  FROM PlayerProSeasonStat LEFT JOIN PlayerInfo ON PlayerProSeasonStat.Number = PlayerInfo.Number where PlayerInfo.Name = "{data}"'  # Change 'your_table_name' to the name of your table

    else:
        querySelectedPlayer = 'SELECT PlayerProSeasonStat.Name, PlayerInfo.TeamName, PlayerInfo.PosC, PlayerInfo.PosLW, PlayerInfo.PosRW, PlayerInfo.PosD, PlayerInfo.SalaryAverage, PlayerInfo.CK, PlayerInfo.FG, PlayerInfo.DI, PlayerInfo.SK, PlayerInfo.ST, PlayerInfo.EN, PlayerInfo.DU, PlayerInfo.PH, PlayerInfo.FO, PlayerInfo.PA, PlayerInfo.SC, PlayerInfo.DF, PlayerInfo.PS, PlayerInfo.EX, PlayerInfo.LD, PlayerInfo.PO, PlayerProSeasonStat.GP, PlayerProSeasonStat.Shots, PlayerProSeasonStat.G, PlayerProSeasonStat.A, PlayerProSeasonStat.P, PlayerProSeasonStat.PlusMinus, PlayerProSeasonStat.Pim, PlayerProSeasonStat.ShotsBlock, PlayerProSeasonStat.OwnShotsBlock, PlayerProSeasonStat.OwnShotsMissGoal, PlayerProSeasonStat.Hits, PlayerProSeasonStat.HitsTook, PlayerProSeasonStat.GW, PlayerProSeasonStat.GT, PlayerProSeasonStat.FaceOffWon, PlayerProSeasonStat.FaceOffTotal, PlayerProSeasonStat.PPG, PlayerProSeasonStat.PPA, PlayerProSeasonStat.PPP, PlayerProSeasonStat.PPShots, PlayerProSeasonStat.PKG, PlayerProSeasonStat.PKA, PlayerProSeasonStat.PKP, PlayerProSeasonStat.PKShots, PlayerProSeasonStat.GiveAway, PlayerProSeasonStat.TakeAway, PlayerProSeasonStat.PuckPossesionTime  FROM PlayerProSeasonStat LEFT JOIN PlayerInfo ON PlayerProSeasonStat.Number = PlayerInfo.Number where PlayerInfo.Name = "Max Jones"'  # Change 'your_table_name' to the name of your table

    df_PlayerSel = pd.read_sql(querySelectedPlayer, conn)
    
    teamNameFromPlayerSel = df_PlayerSel['TeamName'][0]
    querySelectedAllPlayerFromTeamId = f'SELECT PlayerProSeasonStat.Name, PlayerInfo.TeamName, PlayerInfo.PosC, PlayerInfo.PosLW, PlayerInfo.PosRW, PlayerInfo.PosD, PlayerInfo.SalaryAverage, PlayerInfo.CK, PlayerInfo.FG, PlayerInfo.DI, PlayerInfo.SK, PlayerInfo.ST, PlayerInfo.EN, PlayerInfo.DU, PlayerInfo.PH, PlayerInfo.FO, PlayerInfo.PA, PlayerInfo.SC, PlayerInfo.DF, PlayerInfo.PS, PlayerInfo.EX, PlayerInfo.LD, PlayerInfo.PO, PlayerProSeasonStat.GP, PlayerProSeasonStat.Shots, PlayerProSeasonStat.G, PlayerProSeasonStat.A, PlayerProSeasonStat.P, PlayerProSeasonStat.PlusMinus, PlayerProSeasonStat.Pim, PlayerProSeasonStat.ShotsBlock, PlayerProSeasonStat.OwnShotsBlock, PlayerProSeasonStat.OwnShotsMissGoal, PlayerProSeasonStat.Hits, PlayerProSeasonStat.HitsTook, PlayerProSeasonStat.GW, PlayerProSeasonStat.GT, PlayerProSeasonStat.FaceOffWon, PlayerProSeasonStat.FaceOffTotal, PlayerProSeasonStat.PPG, PlayerProSeasonStat.PPA, PlayerProSeasonStat.PPP, PlayerProSeasonStat.PPShots, PlayerProSeasonStat.PKG, PlayerProSeasonStat.PKA, PlayerProSeasonStat.PKP, PlayerProSeasonStat.PKShots, PlayerProSeasonStat.GiveAway, PlayerProSeasonStat.TakeAway, PlayerProSeasonStat.PuckPossesionTime  FROM PlayerProSeasonStat LEFT JOIN PlayerInfo ON PlayerProSeasonStat.Number = PlayerInfo.Number where PlayerInfo.TeamName = "{teamNameFromPlayerSel}"'  # Change 'your_table_name' to the name of your table
    df_AllPlayerFromTeamId = pd.read_sql(querySelectedAllPlayerFromTeamId, conn)

    #verify if player is D or Fwd
    # playerSelect = pd.read_sql(queryDefence, conn)
    conn.close() 
    #show all player of the team where the player is at
    print(getAvgFilteredStat(df_AllPlayerFromTeamId))
    response_data = {'values':df_PlayerSel.to_json(orient='records'), 'labels': generalStatsColumns, 'playerSelSorted': generateOVStats(df_PlayerSel).to_json(orient='records'), 'playersFromTeamSel' : generateOVStats(df_AllPlayerFromTeamId).to_json(orient='records')} 
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
    global data  # Use the global keyword to indicate that you're modifying the global variable
    data = data_in  # Set the value of the global variable

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
