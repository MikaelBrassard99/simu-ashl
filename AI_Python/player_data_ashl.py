import sqlite3
import pandas as pd
from bokeh.plotting import figure,show
from  bokeh.models import HoverTool,BoxZoomTool, ResetTool
import numpy as np
from bokeh.io import curdoc
from bokeh.layouts import column
from bokeh.models import ColorBar, ColumnDataSource
from bokeh.palettes import Spectral6
from bokeh.plotting import figure, output_file, show, save
from bokeh.transform import linear_cmap
from bokeh.models import CheckboxButtonGroup, CustomJS



con = sqlite3.connect('ASHL13-STHS.db')
data_frame_forward = pd.read_sql_query('Select * from PlayerInfo where Retire == "False" and (PosC == "True" or PosLW == "True" or PosRW == "True")', con)
data_frame_defence = pd.read_sql_query('Select * from PlayerInfo where Retire == "False" and PosD == "True"', con)

# *****for forward******
df1 = pd.DataFrame(data_frame_forward, columns=["CK", "ST", "DI", "SK", "DF", "PH", "PA", "SC",'Name', 'ProTeamName', 'Age', 'SalaryCap', 'PosC', 'PosLW',	'PosRW', 'PosD', 'St_Mik_off','St_Mik_def'])
# df1['St_Mik_off'] = (df1['CK']+df1['ST']+df1['DI']+df1['SK']+df1['DF']+df1['PH']+df1['PA']+df1['SC'])
# df1.sort_values('St_Mik_off', ascending=False)

df_ColumnIndexFormat = {}
index = 0
for columnName in df1.columns:
    df_ColumnIndexFormat.update({index:columnName})
    index = index+1
# print(df_ColumnIndexFormat)

# source.data['St_Mik_off'] = source.data[labels[cb_obj.origin.active[column]]];                               

curdoc().theme = 'dark_minimal'
source = ColumnDataSource(data=df1)
LABELS = ["CK", "ST", "DI", "SK", "DF", "PH", "PA", "SC"]
checkbox_button_group = CheckboxButtonGroup(labels=LABELS, active=[])
checkbox_button_group.js_on_event("button_click", CustomJS(args=dict(source=source), code="""
    const result = [];
    const labels = ["CK", "ST", "DI", "SK", "DF", "PH", "PA", "SC"];
    source.data['St_Mik_off'] = [];
    for(var column in cb_obj.origin.active){
        for(var index in source.data[labels[cb_obj.origin.active[column]]]){
            if(isNaN(source.data['St_Mik_off'][index])){
                source.data['St_Mik_off'][index] = source.data[labels[cb_obj.origin.active[column]]][index];
            }else{
                source.data['St_Mik_off'][index] = source.data['St_Mik_off'][index]+source.data[labels[cb_obj.origin.active[column]]][index];
            }
        };
    }
    
    console.log(source.data['St_Mik_off'][index]);
    source.change.emit();
"""))

color = linear_cmap(field_name='St_Mik_off', palette=Spectral6 ,low=np.min(source.data['St_Mik_off'][np.nonzero(source.data['St_Mik_off'])]) ,high=np.max(source.data['St_Mik_off']))
color_bar = ColorBar(color_mapper=color['transform'], width=8)
plot = figure(width=1500, height=1000, tools=[HoverTool(tooltips=[("Name", "@Name"),("Age","@Age"),("St_Mik", "@St_Mik_off"),("SalaryCap","@SalaryCap"),("Team","@ProTeamName")]),BoxZoomTool(),ResetTool()],title="Graphique des Attaquants", toolbar_location="below")
plot.xaxis.axis_label = 'Salary'
plot.yaxis.axis_label = 'Somme des statistiques selectionnées'
plot.circle(x='SalaryCap', y='St_Mik_off',line_color=color, size=5, source=source)
plot.add_layout(color_bar, 'right')





df2 = pd.DataFrame(data_frame_defence, columns=["CK", "ST", "DI", "SK", "DF", "PH", "PA", "SC",'Name', 'ProTeamName', 'Age', 'SalaryCap', 'PosC', 'PosLW',	'PosRW', 'PosD', 'St_Mik_off','St_Mik_def'])
# df2['St_Mik_def'] = (df2['CK']+df2['ST']+df2['DI']+df2['SK']+df2['DF']+df2['PH']+df2['PA']+df2['SC'])
# df2.sort_values('St_Mik_def', ascending=False)

df_ColumnIndexFormat = {}
index = 0
for columnName in df2.columns:
    df_ColumnIndexFormat.update({index:columnName})
    index = index+1
# print(df_ColumnIndexFormat)

curdoc().theme = 'dark_minimal'
source_def = ColumnDataSource(data=df2)
LABELS_def = ["CK", "ST", "DI", "SK", "DF", "PH", "PA", "SC"]
checkbox_button_group_def = CheckboxButtonGroup(labels=LABELS_def, active=[])
checkbox_button_group_def.js_on_event("button_click", CustomJS(args=dict(source=source_def), code="""
    const result = [];
    const labels = ["CK", "ST", "DI", "SK", "DF", "PH", "PA", "SC"];
    source.data['St_Mik_def'] = [];
    for(var column in cb_obj.origin.active){
        for(var index in source.data[labels[cb_obj.origin.active[column]]]){
            if(isNaN(source.data['St_Mik_def'][index])){
                source.data['St_Mik_def'][index] = source.data[labels[cb_obj.origin.active[column]]][index];
            }else{
                source.data['St_Mik_def'][index] = source.data['St_Mik_def'][index]+source.data[labels[cb_obj.origin.active[column]]][index];
            }
        };
    }
    
    console.log(source.data['St_Mik_def'][index]);
    source.change.emit();
"""))
color_def = linear_cmap(field_name='St_Mik_def', palette=Spectral6 ,low=np.min(source_def.data['St_Mik_def'][np.nonzero(source_def.data['St_Mik_def'])]) ,high=np.max(source_def.data['St_Mik_def']))
color_bar_def = ColorBar(color_mapper=color_def['transform'], width=8)
plot_def = figure(width=1500, height=1000, tools=[HoverTool(tooltips=[("Name", "@Name"),("Age","@Age"),("St_Mik", "@St_Mik_def"),("SalaryCap","@SalaryCap"),("Team","@ProTeamName")]),BoxZoomTool(),ResetTool()], title="Graphique des défenseurs", toolbar_location="below")
plot_def.xaxis.axis_label = 'Salary'
plot_def.yaxis.axis_label = 'Somme des statistiques selectionnées'

plot_def.circle(x='SalaryCap', y='St_Mik_def',line_color=color_def, size=5, source=source_def)
plot_def.add_layout(color_bar_def, 'right')
output_file(filename="billy_beane.html", title="ASHL DATA FILE")
show(column(checkbox_button_group,plot,checkbox_button_group_def,plot_def))
