from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import functools

import audio_manager as am

react_build_folder = '../react-app/build'

application = Flask(__name__, static_url_path='', static_folder=react_build_folder,
                    template_folder=react_build_folder)

CORS(application, supports_credentials=True)


@application.route('/')
def get_index():
    return render_template('index.html')


# TODO: figure out why i need both inner and outer functions, and why i need functools
# def endpoint(*route_args, **route_kwargs):

#     def outer(func):
#         # TODO: simplify this, do I really need all the local vars?
#         modified_route_args = list(route_args)
#         modified_route_args[0] = '/api' + modified_route_args[0]
#         modified_route_args_tuple = tuple(route_args)

#         @application.route(*modified_route_args_tuple, **route_kwargs)
#         @functools.wraps(func)
#         def inner(*f_args, **f_kwargs):
#             return func(f_args, f_kwargs)
#         return inner

#     return outer

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


@application.errorhandler(404)
def handle_404(e):
    if request.path.startswith("/api"):
        return jsonify(message="Resource not found"), 404
    return render_template('index.html')


if __name__ == '__main__':
    application.run()
