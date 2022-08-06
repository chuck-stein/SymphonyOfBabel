from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import audio_manager as am

application = Flask(__name__, static_folder='../react-app/build/static', template_folder='../react-app/build')

CORS(application, supports_credentials=True)


@application.route('/')
def get_index():
    return render_template('index.html')


@application.route('/api/audioSettings', methods=['GET'])
def get_audio_settings():
    """
    Get the audio settings currently being used, namely the sample rate and duration of each audio excerpt.
    :return: the audio settings for representing audio excerpts
    """
    return jsonify({'sampleRate': am.SAMPLE_RATE, 'excerptDuration': am.EXCERPT_DURATION}), 200


@application.route('/api/randomExcerpt', methods=['GET'])
def get_random_excerpt():
    """
    Get a random audio excerpt.
    :return: the randomly selected audio excerpt, and its corresponding excerpt ID
    """
    excerpt_id = am.get_random_id()
    excerpt_data = am.get_excerpt_data(excerpt_id)
    return jsonify({'excerptID': excerpt_id, 'excerptData': excerpt_data}), 200


@application.route('/api/specificExcerpt', methods=['POST'])
def get_excerpt():
    """
    Get the audio excerpt associated with the ID in the HTTP request.
    :return: the requested audio excerpt and its ID
    """
    excerpt_id = request.json['id']
    try:
        excerpt_data = am.get_excerpt_data(excerpt_id)
    except (TypeError, ValueError):
        return 'Bad ID format', 400
    else:
        return jsonify({'excerptID': excerpt_id, 'excerptData': excerpt_data}), 200


@application.route('/api/searchByMic', methods=['POST'])
def search_by_mic():
    """
    Get the audio excerpt associated the recorded audio data in the HTTP request.
    :return: the requested audio excerpt and its ID
    """
    search_query = request.json['searchQuery']
    excerpt_id = am.get_id_from_buffer(search_query)
    excerpt_data = am.get_excerpt_data(excerpt_id)
    return jsonify({'excerptID': excerpt_id, 'excerptData': excerpt_data}), 200


if __name__ == '__main__':
    application.run()
