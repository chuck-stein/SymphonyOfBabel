from flask import Flask, render_template, jsonify, request, url_for
import audiomanager as am

app = Flask(__name__)


@app.route('/audioSettings', methods=['GET'])
def get_audio_settings():
    return jsonify({'sampleRate': am.SAMPLE_RATE, 'excerptDuration': am.EXCERPT_DURATION}), 200


@app.route('/randomExcerpt', methods=['GET'])
def get_random_excerpt():
    random_excerpt_id = am.get_random_excerpt_id()
    random_excerpt_data = am.get_excerpt_data(random_excerpt_id)
    return jsonify({'excerptID': random_excerpt_id, 'excerptData': random_excerpt_data}), 200


@app.route('/specificExcerpt', methods=['POST'])
def get_excerpt():
    id = request.json['id']
    try:
        excerpt_data = am.get_excerpt_data(id)
    except (TypeError, ValueError):
        return 'Bad ID format', 400
    else:
        return jsonify({'excerptData': excerpt_data}), 200


@app.route('/searchQuery', methods=['POST'])
def search_by_mic():
    search_query = request.files['searchquery']
    id = am.get_excerpt_id_from_wav(search_query)
    excerpt_data = am.get_excerpt_data(id)
    return jsonify({'excerptID': id, 'excerptData': excerpt_data})


if __name__ == '__main__':
    app.run(debug=True)
