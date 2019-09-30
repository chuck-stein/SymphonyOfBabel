from flask import Flask, render_template, jsonify, request, url_for
import audiomanager

app = Flask(__name__)

@app.route('/')
@app.route('/home')
def home():
    return render_template('index.html', sample_rate=audiomanager.SAMPLE_RATE, excerpt_size=audiomanager.TOTAL_SAMPLES)


@app.route('/excerpt', methods=['GET'])
def excerpt():
    random_excerpt_id = audiomanager.get_random_excerpt_id()
    random_excerpt_data = audiomanager.get_excerpt_data(random_excerpt_id)
    return jsonify({'excerptID': str(random_excerpt_id), 'excerptData': random_excerpt_data}), 200


if __name__ == '__main__':
    app.run(debug=True)
