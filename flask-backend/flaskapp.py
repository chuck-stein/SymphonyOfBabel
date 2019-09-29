from flask import Flask, render_template, url_for
app = Flask(__name__)

posts = [
    {
        'author': 'Chuck Stein',
        'title': 'blog post 1',
        'content': 'blog post 1 content',
        'date': 'September 29, 2019'
    },
    {
        'author': 'Hannah Lauterwasser',
        'title': 'blog post 2',
        'content': 'blog post 2 content',
        'date': 'September 30, 2019'
    }
]

@app.route('/')
@app.route('/home')
def home():
    return render_template('index.html', posts=posts)

# @app.route('/about')
# def about():
#     return render_template('about.html', title='About')

if __name__ == '__main__':
    app.run(debug=True)
