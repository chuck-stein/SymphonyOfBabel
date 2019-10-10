from flask import Flask, jsonify, request
from flask_cors import CORS

import audio_manager as am

application = Flask(__name__)

CORS(application)

@application.route('/audioSettings', methods=['GET'])
def get_audio_settings():
    return jsonify({'sampleRate': am.SAMPLE_RATE, 'excerptDuration': am.EXCERPT_DURATION}), 200


@application.route('/randomExcerpt', methods=['GET'])
def get_random_excerpt():
    random_excerpt_id = am.get_random_id()
    random_excerpt_data = am.get_excerpt_data(random_excerpt_id)
    return jsonify({'excerptID': random_excerpt_id, 'excerptData': random_excerpt_data}), 200


@application.route('/specificExcerpt', methods=['POST'])
def get_excerpt():
    id = request.json['id']
    try:
        excerpt_data = am.get_excerpt_data(id)
    except (TypeError, ValueError):
        return 'Bad ID format', 400
    else:
        return jsonify({'excerptData': excerpt_data}), 200


@application.route('/searchByMic', methods=['POST'])
def search_by_mic():
    search_query = request.json['searchQuery']
    excerpt_id = am.get_id_from_buffer(search_query)
    excerpt_data = am.get_excerpt_data(excerpt_id)
    return jsonify({'excerptID': excerpt_id, 'excerptData': excerpt_data})


if __name__ == '__main__':
    application.run()  # debug=True
