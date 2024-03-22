from flask import Flask, request
from flask_cors import CORS


import json
import pandas 


api = Flask(__name__)
CORS(api)

@api.route('/tracks', methods=["POST"])
def traks():
    with open('playlists.json','w') as f:
        json.dump(request.json,f)          
    #df_myplaylist = pandas.json_normalize(request.json)
    #print(df_myplaylist)
     
    print(request.json)

    return "received"


