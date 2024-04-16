from flask import Flask, request
from flask_cors import CORS
import json
import pandas as pd

api = Flask(__name__)
CORS(api)

@api.route('/tracks', methods=["POST"])
def tracks():
    with open('playlists.json', 'w') as f:
        json.dump(request.json, f)

    df_myplaylist = pd.json_normalize(request.json) 
    

    print(df_myplaylist)
    return "received"
