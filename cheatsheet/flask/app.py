from flask import Flask, render_template
import csv

app = Flask(__name__)

@app.route("/")
def cheatsheet_list():
    return render_template('cheatsheet.html', rows=row_list)

core_reader = csv.reader(open("functions.csv", "r"), delimiter=';')
shapes_reader = csv.reader(open("shapes.csv", "r"), delimiter=';')
texture_reader = csv.reader(open("texture.csv", "r"), delimiter=';')
text_reader = csv.reader(open("text.csv", "r"), delimiter=';')
models_reader = csv.reader(open("models.csv", "r"), delimiter=';')
audio_reader = csv.reader(open("audio.csv", "r"), delimiter=';')
maths_reader = csv.reader(open("maths.csv", "r"), delimiter=';')
structs_reader = csv.reader(open("structs.csv", "r"), delimiter=';')

row_list = []

for row in core_reader:
    row.append("table-light")
    row.append("core")
    row.append("text-dark")
    row_list.append(row)

for row in shapes_reader:
    row.append("table-danger")
    row.append("shapes")
    row.append("text-dark")
    row_list.append(row)
    
for row in texture_reader:
    row.append("table-success")
    row.append("textures")
    row.append("text-dark")
    row_list.append(row)
    
for row in text_reader:
    row.append("table-info")
    row.append("text")
    row.append("text-dark")
    row_list.append(row)

for row in models_reader:
    row.append("table-primary")
    row.append("models")
    row.append("text-dark")
    row_list.append(row)
    
for row in audio_reader:
    row.append("table-warning")
    row.append("audio")
    row.append("text-dark")
    row_list.append(row)
    
for row in maths_reader:
    row.append("table-violet")
    row.append("maths")
    row.append("text-dark")
    row_list.append(row)
    
for row in structs_reader:
    row.append("table-light")
    row.append("structs")
    row.append("text-dark")
    row_list.append(row)