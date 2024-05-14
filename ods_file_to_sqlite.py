import sqlite3
import pandas as pd
from pandas_ods_reader import read_ods

conn = sqlite3.connect('ashl2024_draft.db')

db_df = pd.read_sql_query("SELECT * from player_stats", conn)

df = read_ods("list.ods", 1, headers=False)

df.to_sql("player_stats", conn, if_exists="append", index=False)


print(df)