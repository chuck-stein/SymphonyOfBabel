from flask import Flask, render_template, jsonify, request, url_for
import audiomanager as am

app = Flask(__name__)


@app.route('/random', methods=['GET'])
def get_random_excerpt():
    random_excerpt_id = am.get_random_excerpt_id()
    random_excerpt_data = am.get_excerpt_data(random_excerpt_id)
    return jsonify({'excerptID': random_excerpt_id, 'excerptData': random_excerpt_data}), 200


@app.route('/excerpt', methods=['GET'])
def get_excerpt():
    id = request.args.get('id')
    try:
        excerpt_data = am.get_excerpt_data(id)
    except (TypeError, ValueError):
        return 'Bad ID format', 400  # TODO: is this the right return value?
    else:
        return jsonify({'excerptData': excerpt_data}), 200

if __name__ == '__main__':
    app.run(debug=True)
