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

# In the input file we are left with number,track_id,duration_ms,dancebility,energy

df = pd.read_csv('dataset.csv')
df.drop(columns=['favorite', 'length','popularity'])
train_size = int(0.8 * len(df))


def train(df_myplaylist):
    ...