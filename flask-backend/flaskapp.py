from flask import Flask, render_template, url_for
import audiomanager

app = Flask(__name__)

@app.route('/')
@app.route('/home')
def home():
    return render_template('index.html', excerpt_id='')

# @app.route('/about')
# def about():
#     return render_template('about.html', title='About')

if __name__ == '__main__':
    app.run(debug=True)
