from sklearn.datasets import load_iris
iris=load_iris()

X=iris.data
y=iris.target

feature_names = iris.feature_names
target_names = iris.target_names

from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X,y, test_size=1)
print(X_train.shape)
print(X_test.shape)

#create network
from sklearn.neighbors import KNeighborsClassifier
knn = KNeighborsClassifier(n_neighbors=3)
knn.fit(X_train, y_train)
y_pred = knn.predict(X_test)

#test the score of knn
from sklearn import metrics
print(metrics.accuracy_score(y_test, y_pred))
#test knn with random input
sample = [[3,5,6,5],[2,3,4,5]]
predictions= knn.predict(sample)
pred_species = [iris.target_names[p] for p in predictions]
print('preds: ', pred_species)

#put the network in a file
import joblib

from joblib import dump, load
joblib.dump(knn, 'm1brain.joblib')
model = joblib.load('m1brain.joblib')
#so we where able to test it with knn like so
model.predict(X_test)
sample = [[3,5,6,5],[2,3,4,5]]
predictions= model.predict(sample)
pred_species = [iris.target_names[p] for p in predictions]
print('preds: ', pred_species)