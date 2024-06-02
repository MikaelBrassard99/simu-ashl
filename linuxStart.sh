#!/bin/bash

source /home/ubuntu-mik/simu-ashl/bin/activate
curl https://www.ashligue.com/leaguefiles/ASHL14-STHS.db -O
code .
xdg-open http://localhost:5000
python3 generateGraph.py
python3 main.py