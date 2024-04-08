import pandas as pd
import numpy as np
import seaborn as sns
from imblearn.over_sampling import SMOTE
import sklearn
from sklearn.pipeline import Pipeline
from sklearn.model_selection import cross_val_score
from sklearn.model_selection import train_test_split
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import plot_confusion_matrix
from sklearn import metrics 
from sklearn.metrics import f1_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression 
from sklearn.tree import DecisionTreeClassifier
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
import spotipy
import spotipy.util as util
from spotipy.oauth2 import SpotifyClientCredentials
from spotipy import oauth2

# In the input file we are left with number,track_id,duration_ms,dancebility,energy

df = pd.read_csv('dataset.csv')
df.drop(columns=['favorite', 'length','popularity'])



def train(df_myplaylist):
    df = pd.concat([df,df_myplaylist], axis=0)
    df.shape
    shuffle_df = df.sample(frac=1)
    train_size = int(0.8 * len(df))
    train_set = shuffle_df[:train_size]
    test_set = shuffle_df[train_size:]
    train_set.head()
    X = train_set.drop(columns=['favorite', 'track_id'])
    y = train_set.favorite
    X.head()
    y.value_counts()

    oversample = SMOTE()
    X_train, y_train = oversample.fit_resample(X, y) 
    X_train.head()
    y_train.value_counts()
    test_set.head()
    # Setting test datasets
    X_test = test_set.drop(columns=['favorite', 'track_id'])
    y_test = test_set['favorite']
    X_test.head()
    y_test.value_counts()

    
    # Logistic Regression
    lr = LogisticRegression(solver='lbfgs', max_iter=400).fit(X_train, y_train)
    lr_scores = cross_val_score(lr, X_train, y_train, cv=10, scoring="f1")
    print(np.mean(lr_scores))
    

    # Logistic Regression confusion matrix
    lr_preds = lr.predict(X_train)
    plot_confusion_matrix(lr, X_train, y_train)

    # Hyperparameter optimization for Decision Tree Classifier
    parameters = {
    'max_depth':[3, 4, 5, 6, 10, 15,20,30],
    }
    dtc = Pipeline([('CV',GridSearchCV(DecisionTreeClassifier(), parameters, cv = 5))])
    dtc.fit(X_train, y_train)
    dtc.named_steps['CV'].best_params_

    
    # Decision Tree Classifier
    dt = DecisionTreeClassifier(max_depth=30).fit(X_train, y_train)
    dt_scores = cross_val_score(dt, X_train, y_train, cv=10, scoring="f1")
    np.mean(dt_scores)

    
   #RandomForestClassifier
    parameters = {
    'max_depth':[3, 6,12,15,20],
    'n_estimators':[10, 20,30]
    }
    clf = Pipeline([('CV',GridSearchCV(RandomForestClassifier(), parameters, cv = 5))])
    clf.fit(X_train, y_train)
    clf.named_steps['CV'].best_params_

    # RandomForestClassifier
    rf = Pipeline([('rf', RandomForestClassifier(n_estimators = 10, max_depth = 20).fit(X_train, y_train))])
    rf_scores = cross_val_score(rf, X_train, y_train, cv=10, scoring="f1")
    np.mean(rf_scores)
    y_test.value_counts()

    pipe = make_pipeline(StandardScaler(), DecisionTreeClassifier(max_depth=30))
    pipe.fit(X_train, y_train)  # apply scaling on training data
    Pipeline(steps=[('standardscaler', StandardScaler()), ('dt', DecisionTreeClassifier(max_depth=30))])
    pipe.score(X_test, y_test)

    df = pd.read_csv('dataset.csv')
    df.head()

    prob_preds = pipe.predict_proba(df.drop(['favorite','track_id'], axis=1))
    threshold = 0.30 # define threshold here
    preds = [1 if prob_preds[i][1]> threshold else 0 for i in range(len(prob_preds))]
    df['prediction'] = preds

    df['prediction'].value_counts()

    cid = '51a424f7865249b7a40a7f54aba825c2'
    secret = '6160ed6182a44a79b40eac0dd3d9ba5a'
    redirect_uri='http://localhost:3000/callback'
    username = '31j5yy4bqjlafh5ss4h3liyoqbbe'

    scope = 'user-top-read playlist-modify-private playlist-modify-public'
    token = util.prompt_for_user_token(username, scope, client_id=cid, client_secret=secret, redirect_uri=redirect_uri)

    if token:
        sp = spotipy.Spotify(auth=token)
    else:
        print("Can't get token for", username)

    # Creating a function that builds a playlist in the user's spotify account
    def create_playlist(sp, username, playlist_name, playlist_description):
        playlists = sp.user_playlist_create(username, playlist_name, description = playlist_description)

    create_playlist(sp, username, 'Your New Jams', 'This playlist was created using python!')
def fetch_playlists(sp, username):
    """
    Returns the user's playlists.
    """
        
    id = []
    name = []
    num_tracks = []
    
    # Make the API request
    playlists = sp.user_playlists(username)
    for playlist in playlists['items']:
        id.append(playlist['id'])
        name.append(playlist['name'])
        num_tracks.append(playlist['tracks']['total'])

    # Create the final df   
    df_playlists = pd.DataFrame({"id":id, "name": name, "#tracks": num_tracks})
    return df_playlists
    fetch_playlists(sp,username).head()
    playlist_id = fetch_playlists(sp,username)['id'][0]

    # Function to add selected songs to playlist
def enrich_playlist(sp, username, playlist_id, playlist_tracks):
    index = 0
    results = []
    
    while index < len(playlist_tracks):
        results += sp.user_playlist_add_tracks(username, playlist_id, tracks = playlist_tracks[index:index + 50])
        index += 50

    # Adding songs to playlist
    list_track = df.loc[df['prediction']  == 1]['track_id']
    enrich_playlist(sp, username, playlist_id, list_track)  