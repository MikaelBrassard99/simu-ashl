# import serial,time
# import matplotlib.pyplot as plt

# ser = serial.Serial('COM4', 9600)
# data =[]
# for i in range(50):
#     b = ser.readline()         # read a byte string
#     string_n = b.decode()  # decode byte string into Unicode  
#     string = string_n.rstrip() # remove \n and \r
#     flt = float(string)        # convert string to float
#     print(flt)
#     data.append(flt)           # add to the end of data list
#     time.sleep(0.1)            # wait (sleep) 0.1 seconds

# ser.close()

# plt.plot(data)
# plt.xlabel('Time (seconds)')
# plt.ylabel('Potentiometer Reading')
# plt.title('Potentiometer Reading vs. Time')
# plt.show()


from cProfile import label
import datetime
from tkinter import Menu
import serial
from bokeh.driving import count
from bokeh.models import ColumnDataSource,HoverTool,Dropdown
from bokeh.plotting import curdoc, figure
from bokeh.layouts import column

import serial.tools.list_ports

from Import_Clean_Show_Data import LABELS

ports = serial.tools.list_ports.comports()
menu = []
for port, desc, hwid in sorted(ports):
        print("{}: {} [{}]".format(port, desc, hwid))
        menu.append("{}: {} [{}]".format(port, desc, hwid))


update_interval = 1000


source = ColumnDataSource({'x':[],'y':[]})

@count()
def updateData(x):
    roll_over = 1000
    ser = serial.Serial('COM5', 57600)
    data = ser.readline()       # read a byte string
    string_n = data.decode()  # decode byte string into Unicode  
    string = string_n.rstrip() # remove \n and \r
    y = float(string)        # convert string to float
    source.stream({'x':[x], 'y':[y]}, rollover=roll_over)

TOOLTIPS = HoverTool(tooltips=[
    ("Amplitude", "$y"),
    ("Time", f'{datetime.datetime.now().hour}hr:{datetime.datetime.now().minute}min'),
])
plot = figure(tools=[TOOLTIPS])
plot.line('x','y',source=source)
plot.yaxis.axis_label = 'Amplitude'
plot.xaxis.axis_label = 'Temps (s) depuis l\'acquisition'

dropdown = Dropdown(label="Port COM disponible", button_type="warning", menu=menu)
doc = curdoc()
layout = column(dropdown,plot)
dropdown.on_click(updateData)
doc.add_root(layout)
doc.add_periodic_callback(updateData, update_interval)

