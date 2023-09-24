from flask import Flask, render_template
 
app = Flask(__name__, template_folder='template', static_folder='static')
 
 
@app.route("/")
def main():
    return render_template("main.html")
 
if __name__ == "__main__":
    app.run(debug=True)  # Enable debug mode
