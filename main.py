from flask import Flask, render_template, request, jsonify

# importing pandas as pd
import pandas as pd
import sqlite3

app = Flask(__name__, template_folder='template', static_folder='static')

data = None

@app.route("/")
def main():
    return render_template("main.html", python_variable=data)
 
 
@app.route("/allStats")
def allStats():
  
    conn = sqlite3.connect('ASHL13-STHS.db')

    #sql query to match PalyerInfo and PlayerStat who play Pro(status > 1) and have played a minimum of 1 game
    queryGeneral = 'SELECT PLayerProStat.Name, PlayerInfo.TeamName, PlayerInfo.PosC, PlayerInfo.PosLW, PlayerInfo.PosRW, PlayerInfo.PosD, PlayerInfo.SalaryAverage, PlayerInfo.CK, PlayerInfo.FG, PlayerInfo.DI, PlayerInfo.SK, PlayerInfo.ST, PlayerInfo.EN, PlayerInfo.DU, PlayerInfo.PH, PlayerInfo.FO, PlayerInfo.PA, PlayerInfo.SC, PlayerInfo.DF, PlayerInfo.PS, PlayerInfo.EX, PlayerInfo.LD, PlayerInfo.PO, PLayerProStat.GP, PLayerProStat.Shots, PLayerProStat.G, PLayerProStat.A, PLayerProStat.P, PLayerProStat.PlusMinus, PLayerProStat.Pim, PLayerProStat.ShotsBlock, PLayerProStat.OwnShotsBlock, PLayerProStat.OwnShotsMissGoal, PLayerProStat.Hits, PLayerProStat.HitsTook, PLayerProStat.GW, PLayerProStat.GT, PLayerProStat.FaceOffWon, PLayerProStat.FaceOffTotal, PLayerProStat.PPG, PLayerProStat.PPA, PLayerProStat.PPP, PLayerProStat.PPShots, PLayerProStat.PKG, PLayerProStat.PKA, PLayerProStat.PKP, PLayerProStat.PKShots, PLayerProStat.GiveAway, PLayerProStat.TakeAway, PLayerProStat.PuckPossesionTime  FROM PlayerProStat LEFT JOIN PlayerInfo ON PlayerProStat.Number = PlayerInfo.Number where PlayerProStat.GP <> 0 and PlayerInfo.Status1 > 1 and PLayerProStat.GP > 50 ORDER BY PlayerInfo.Name'  # Change 'your_table_name' to the name of your table
    queryForward = 'SELECT PLayerProStat.Name, PlayerInfo.TeamName, PlayerInfo.PosC, PlayerInfo.PosLW, PlayerInfo.PosRW, PlayerInfo.PosD, PlayerInfo.SalaryAverage, PlayerInfo.CK, PlayerInfo.FG, PlayerInfo.DI, PlayerInfo.SK, PlayerInfo.ST, PlayerInfo.EN, PlayerInfo.DU, PlayerInfo.PH, PlayerInfo.FO, PlayerInfo.PA, PlayerInfo.SC, PlayerInfo.DF, PlayerInfo.PS, PlayerInfo.EX, PlayerInfo.LD, PlayerInfo.PO, PLayerProStat.GP, PLayerProStat.Shots, PLayerProStat.G, PLayerProStat.A, PLayerProStat.P, PLayerProStat.PlusMinus, PLayerProStat.Pim, PLayerProStat.ShotsBlock, PLayerProStat.OwnShotsBlock, PLayerProStat.OwnShotsMissGoal, PLayerProStat.Hits, PLayerProStat.HitsTook, PLayerProStat.GW, PLayerProStat.GT, PLayerProStat.FaceOffWon, PLayerProStat.FaceOffTotal, PLayerProStat.PPG, PLayerProStat.PPA, PLayerProStat.PPP, PLayerProStat.PPShots, PLayerProStat.PKG, PLayerProStat.PKA, PLayerProStat.PKP, PLayerProStat.PKShots, PLayerProStat.GiveAway, PLayerProStat.TakeAway, PLayerProStat.PuckPossesionTime  FROM PlayerProStat LEFT JOIN PlayerInfo ON PlayerProStat.Number = PlayerInfo.Number where PlayerProStat.GP <> 0 and PlayerInfo.Status1 > 1 and PlayerInfo.PosD = "False" and PLayerProStat.GP > 50'  # Change 'your_table_name' to the name of your table
    queryDefence = 'SELECT PLayerProStat.Name, PlayerInfo.TeamName, PlayerInfo.PosC, PlayerInfo.PosLW, PlayerInfo.PosRW, PlayerInfo.PosD, PlayerInfo.SalaryAverage, PlayerInfo.CK, PlayerInfo.FG, PlayerInfo.DI, PlayerInfo.SK, PlayerInfo.ST, PlayerInfo.EN, PlayerInfo.DU, PlayerInfo.PH, PlayerInfo.FO, PlayerInfo.PA, PlayerInfo.SC, PlayerInfo.DF, PlayerInfo.PS, PlayerInfo.EX, PlayerInfo.LD, PlayerInfo.PO, PLayerProStat.GP, PLayerProStat.Shots, PLayerProStat.G, PLayerProStat.A, PLayerProStat.P, PLayerProStat.PlusMinus, PLayerProStat.Pim, PLayerProStat.ShotsBlock, PLayerProStat.OwnShotsBlock, PLayerProStat.OwnShotsMissGoal, PLayerProStat.Hits, PLayerProStat.HitsTook, PLayerProStat.GW, PLayerProStat.GT, PLayerProStat.FaceOffWon, PLayerProStat.FaceOffTotal, PLayerProStat.PPG, PLayerProStat.PPA, PLayerProStat.PPP, PLayerProStat.PPShots, PLayerProStat.PKG, PLayerProStat.PKA, PLayerProStat.PKP, PLayerProStat.PKShots, PLayerProStat.GiveAway, PLayerProStat.TakeAway, PLayerProStat.PuckPossesionTime  FROM PlayerProStat LEFT JOIN PlayerInfo ON PlayerProStat.Number = PlayerInfo.Number where PlayerProStat.GP <> 0 and PlayerInfo.Status1 > 1 and PlayerInfo.PosD = "True" and PLayerProStat.GP > 50'  # Change 'your_table_name' to the name of your table

    df_gen = pd.read_sql(queryGeneral, conn)
    df_Fwd = pd.read_sql(queryForward, conn)
    df_Def = pd.read_sql(queryDefence, conn)
    
    # playerSelect = pd.read_sql(queryDefence, conn)
    # conn.close() 

    return render_template("allStats.html", league_data=df_gen, average_Def=generateStats(df_Def)[0], average_Fwd=generateStats(df_Fwd)[0], avg_league_stat_fwd=generateStats(df_Fwd)[1], avg_league_stat_def=generateStats(df_Def)[1])
        # Handle other request methods
        
@app.route("/updateChart", methods=['GET', 'POST'])
def updateChart():
   
    try:
        set_global(request.json)
    except:
        print("An exc   eption occurred")    
    conn = sqlite3.connect('ASHL13-STHS.db')

    if data:
        querySelectedPlayer = f'SELECT PLayerProStat.Name, PlayerInfo.TeamName, PlayerInfo.PosC, PlayerInfo.PosLW, PlayerInfo.PosRW, PlayerInfo.PosD, PlayerInfo.SalaryAverage, PlayerInfo.CK, PlayerInfo.FG, PlayerInfo.DI, PlayerInfo.SK, PlayerInfo.ST, PlayerInfo.EN, PlayerInfo.DU, PlayerInfo.PH, PlayerInfo.FO, PlayerInfo.PA, PlayerInfo.SC, PlayerInfo.DF, PlayerInfo.PS, PlayerInfo.EX, PlayerInfo.LD, PlayerInfo.PO, PLayerProStat.GP, PLayerProStat.Shots, PLayerProStat.G, PLayerProStat.A, PLayerProStat.P, PLayerProStat.PlusMinus, PLayerProStat.Pim, PLayerProStat.ShotsBlock, PLayerProStat.OwnShotsBlock, PLayerProStat.OwnShotsMissGoal, PLayerProStat.Hits, PLayerProStat.HitsTook, PLayerProStat.GW, PLayerProStat.GT, PLayerProStat.FaceOffWon, PLayerProStat.FaceOffTotal, PLayerProStat.PPG, PLayerProStat.PPA, PLayerProStat.PPP, PLayerProStat.PPShots, PLayerProStat.PKG, PLayerProStat.PKA, PLayerProStat.PKP, PLayerProStat.PKShots, PLayerProStat.GiveAway, PLayerProStat.TakeAway, PLayerProStat.PuckPossesionTime  FROM PlayerProStat LEFT JOIN PlayerInfo ON PlayerProStat.Number = PlayerInfo.Number where PlayerInfo.Name = "{data}"'  # Change 'your_table_name' to the name of your table
    else:
        querySelectedPlayer = 'SELECT PLayerProStat.Name, PlayerInfo.TeamName, PlayerInfo.PosC, PlayerInfo.PosLW, PlayerInfo.PosRW, PlayerInfo.PosD, PlayerInfo.SalaryAverage, PlayerInfo.CK, PlayerInfo.FG, PlayerInfo.DI, PlayerInfo.SK, PlayerInfo.ST, PlayerInfo.EN, PlayerInfo.DU, PlayerInfo.PH, PlayerInfo.FO, PlayerInfo.PA, PlayerInfo.SC, PlayerInfo.DF, PlayerInfo.PS, PlayerInfo.EX, PlayerInfo.LD, PlayerInfo.PO, PLayerProStat.GP, PLayerProStat.Shots, PLayerProStat.G, PLayerProStat.A, PLayerProStat.P, PLayerProStat.PlusMinus, PLayerProStat.Pim, PLayerProStat.ShotsBlock, PLayerProStat.OwnShotsBlock, PLayerProStat.OwnShotsMissGoal, PLayerProStat.Hits, PLayerProStat.HitsTook, PLayerProStat.GW, PLayerProStat.GT, PLayerProStat.FaceOffWon, PLayerProStat.FaceOffTotal, PLayerProStat.PPG, PLayerProStat.PPA, PLayerProStat.PPP, PLayerProStat.PPShots, PLayerProStat.PKG, PLayerProStat.PKA, PLayerProStat.PKP, PLayerProStat.PKShots, PLayerProStat.GiveAway, PLayerProStat.TakeAway, PLayerProStat.PuckPossesionTime  FROM PlayerProStat LEFT JOIN PlayerInfo ON PlayerProStat.Number = PlayerInfo.Number where PlayerInfo.Name = "Max Jones"'  # Change 'your_table_name' to the name of your table

    df_PlayerSel = pd.read_sql(querySelectedPlayer, conn)
    
    #verify if player is D or Fwd
    print(df_PlayerSel['PosD'].values[0])
    # playerSelect = pd.read_sql(queryDefence, conn)
    # conn.close() 
    response_data = {'values':generateStats(df_PlayerSel)[1], 'isDef':df_PlayerSel['PosD'].values[0], 'name':df_PlayerSel['Name'].values[0]} 
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
def generateStats(data):
    statsOrder = ['FO', 'FG', 'CK', 'ST','EN', 'DU', 'SK', 'PH', 'PA', 'SC', 'DF', 'EX', 'LD', 'DI']
    averageStat = data[statsOrder].mean()
    tableData = pd.DataFrame({'Cotes': statsOrder,
                        'Moyenne': averageStat})
    return tableData,averageStat.to_json(orient='records')

if __name__ == "__main__":
    app.run(debug=True)  # Enable debug mode
