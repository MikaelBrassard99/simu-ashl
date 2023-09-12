curl https://ashligue.com/leaguefiles/ASHL13-STHS.db -O

@echo off
call .\Scripts\activate.bat & python main.py
pause
