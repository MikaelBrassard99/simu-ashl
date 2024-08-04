@echo off

call C:/Users/mik/simu-ashl/Scripts/activate
curl https://www.ashligue.com/leaguefiles/ASHL14-STHS.db -O
python3 C:/Users/mik/simu-ashl/generateGraph.py
python3 C:/Users/mik/simu-ashl/main.py
code .

pause
