// Initialize Firebase
var config = {
    apiKey: "AIzaSyBNCFBUoICaVRg-UolIDv4F-uYpXG1w8-c",
    authDomain: "wildmio-9ecea.firebaseapp.com",
    databaseURL: "https://wildmio-9ecea.firebaseio.com",
    projectId: "wildmio-9ecea",
    storageBucket: "wildmio-9ecea.appspot.com",
    messagingSenderId: "689834474795"
};
const firebaseApp = firebase.initializeApp(config);
const db = firebase.firestore();
const firestore = db;

const docRef = firestore.doc("samples/sandwichDate");
const messagesRef = db.collection("messages");

function saveData() {
	docRef.set({
		hotDogStatus: 'something about this'
	}).then(function() {
		console.log("Status save");
	}).catch(function(error) {
		console.log("Got an error", error);
	});
}

function getDate() {
	docRef.get().then(function(doc) {
		if(doc && doc.exists) {
			const myData = doc.data();
			console.log(myData.hotDogStatus);
		}
	}).catch(function (error) {
		console.log("Got an error: ", error);
	});
}

function getRealtimeUpdated () {
	docRef.onSnapshot(function(doc) {
		if(doc && doc.exists) {
			const myData = doc.data();
			console.log("Check out this document I received ", doc);
			console.log(myData.hotDogStatus);
		}
	});
}

function getUserData() {
	db.collection("users").get().then((querySnapshot) => {
	    querySnapshot.forEach((doc) => {
	        console.log(`${doc.id} => ${doc.data()}`);
	    });
	});
}

function addData(type) {
	switch(type) {
		case 'set':
			// Add a new document in collection "cities"
			db.collection("cities").doc("LA").set({
			    name: "Los Angeles",
			    state: "CA",
			    country: "USA"
			})
			.then(function() {
			    console.log("Document successfully written!");
			})
			.catch(function(error) {
			    console.error("Error writing document: ", error);
			});
			break;
		case 'merge':
			let cityRef = db.collection('cities').doc('BJ');

			let setWithMerge = cityRef.set({
			    capital: true
			}, { merge: true });
			break;
		case 'datatypes':
			var docData = {
			    stringExample: "Hello world!",
			    booleanExample: true,
			    numberExample: 3.14159265,
			    dateExample: new Date(),
			    arrayExample: [5, true, "hello"],
			    nullExample: null,
			    objectExample: {
			        a: 5,
			        b: {
			            nested: "foo"
			        }
			    }
			};
			db.collection("data").doc("one").set(docData).then(function() {
			    console.log("Document successfully written!");
			});
			break;
		case 'add':
			// Add a new document with a generated id.
			db.collection("cities").add({
			    name: "Tokyo",
			    country: "Japan"
			})
			.then(function(docRef) {
			    console.log("Document written with ID: ", docRef.id);
			})
			.catch(function(error) {
			    console.error("Error adding document: ", error);
			});
			break;
		case 'doc':
			// Add a new document with a generated id.
			let newCityRef = db.collection("cities").doc();

			// later...
			var data = {
			    stringExample: "Hello world!",
			    booleanExample: true,
			    numberExample: 3.14159265,
			    dateExample: new Date(),
			    arrayExample: [5, true, "hello"],
			    nullExample: null,
			    objectExample: {
			        a: 5,
			        b: {
			            nested: "foo"
			        }
			    }
			};
			newCityRef.set(data);
			break;
		case 'update':
			var washingtonRef = db.collection("cities").doc("DC");

			washingtonRef.set({
				country: "Taiwan"
			});

			// Set the "capital" field of the city 'DC'
			return washingtonRef.update({
			    capital: true
			})
			.then(function() {
			    console.log("Document successfully updated!");
			})
			.catch(function(error) {
			    // The document probably doesn't exist.
			    console.error("Error updating document: ", error);
			});
			break;
		case 'updates':
			// Create an initial document to update.
			let frankDocRef = db.collection("users").doc("frank");
			frankDocRef.set({
			    name: "Frank",
			    favorites: { food: "Pizza", color: "Blue", subject: "recess" },
			    age: 12
			});

			// To update age and favorite color:
			db.collection("users").doc("frank").update({
			    "age": 13,
			    "favorites.color": "Red"
			})
			.then(function() {
			    console.log("Document successfully updated!");
			});
			break;
		case 'timestamp':
			let docRef = db.collection('objects').doc('some-id');

			docRef.set({
				testtimestamp: 'just test'
			});

			// Update the timestamp field with the value from the server
			let updateTimestamp = docRef.update({
			    timestamp: firebase.firestore.FieldValue.serverTimestamp()
			});
			break;
		default:
	}
}

// addData('timestamp');

function transaction(type) {
	// Create a reference to the SF doc.
	let sfDocRef = db.collection("cities").doc("SF");
	switch(type) {
		case 'run':
			// Uncomment to initialize the doc.
			sfDocRef.set({ population: 0 });

			return db.runTransaction(function(transaction) {
			    // This code may get re-run multiple times if there are conflicts.
			    return transaction.get(sfDocRef).then(function(sfDoc) {
			        let newPopulation = sfDoc.data().population + 1;
			        transaction.update(sfDocRef, { population: newPopulation });
			    });
			}).then(function() {
			    console.log("Transaction successfully committed!");
			}).catch(function(error) {
			    console.log("Transaction failed: ", error);
			});
			break;
		case 'passinfo':
			db.runTransaction(function(transaction) {
			    return transaction.get(sfDocRef).then(function(sfDoc) {
			        let newPopulation = sfDoc.data().population + 1;
			        if (newPopulation <= 1000000) {
			        transaction.update(sfDocRef, { population: newPopulation });
			        return newPopulation;
			        } else {
			        return Promise.reject("Sorry! Population is too big.");
			        }
			    });
			}).then(function(newPopulation) {
			    console.log("Population increased to ", newPopulation);
			}).catch(function(err) {
			    // This will be an "population is too big" error.
			    console.error(err);
			});
			break;
		case 'batch':
			// Get a new write batch
			let batch = db.batch();

			// Set the value of 'NYC'
			let nycRef = db.collection("cities").doc("NYC");
			batch.set(nycRef, {name: "New York City"});

			// Update the population of 'SF'
			let sfRef = db.collection("cities").doc("SF");
			batch.update(sfRef, {"population": 1000000});

			// Delete the city 'LA'
			let laRef = db.collection("cities").doc("LA");
			batch.delete(laRef);

			// Commit the batch
			batch.commit().then(function () {
			    // ...
			});
			break;
		default:
	}
}

// transaction('batch');

function deleteData(type) {
	switch(type) {
		case 'document':
			db.collection("cities").doc("DC").delete().then(function() {
			    console.log("Document successfully deleted!");
			}).catch(function(error) {
			    console.error("Error removing document: ", error);
			});
			break;
		case 'field':
			var cityRef = db.collection('cities').doc('BJ');

			// Remove the 'capital' field from the document
			var removeCapital = cityRef.update({
			    capital: firebase.firestore.FieldValue.delete()
			});
			break;
		case 'collection':
			/**
			 * Delete a collection, in batches of batchSize. Note that this does
			 * not recursively delete subcollections of documents in the collection
			 */
			function deleteCollection(db, collectionRef, batchSize) {
			    var query = collectionRef.orderBy('__name__').limit(batchSize);

			    return new Promise(function(resolve, reject) {
			        deleteQueryBatch(db, query, batchSize, resolve, reject);
			    });
			}

			function deleteQueryBatch(db, query, batchSize, resolve, reject) {
			    query.get()
			        .then((snapshot) => {
			            // When there are no documents left, we are done
			            if (snapshot.size == 0) {
			                return 0;
			            }

			            // Delete documents in a batch
			            var batch = db.batch();
			            snapshot.docs.forEach(function(doc) {
			                batch.delete(doc.ref);
			            });

			            return batch.commit().then(function() {
			                return snapshot.size;
			            });
			        }).then(function(numDeleted) {
			            if (numDeleted <= batchSize) {
			                resolve();
			                return;
			            }

			            // Recurse on the next process tick, to avoid
			            // exploding the stack.
			            process.nextTick(function() {
			                deleteQueryBatch(db, query, batchSize, resolve, reject);
			            });
			        })
			        .catch(reject);
			}
			break;
		default:
	}
}

const action = {
	start: 'setSomeData',
	getdocument: 'getdocument',
	where: 'whereForQuery',
	getall: 'getAllDocument',
	realtime: 'realtimeUpdate',
	localchange: 'checkEventForLocalChange',
	multilisten: 'listenToMultipleDocument',
	changetype: 'ViewChangesBetweenSnapshoot',
	detach: 'detach a listener',
	error: 'handleListenErrors',
	orderlimit: 'orderAnd limit',
	paginate: 'paginate a query',
	multicondition: 'Set multiple cursor conditions'
}

function queryData(type) {
	let citiesRef = db.collection("cities");
	switch(type) {
		case action.start:
			citiesRef.doc("SF").set({
			    name: "San Francisco", state: "CA", country: "USA",
			    capital: false, population: 860000 });
			citiesRef.doc("LA").set({
			    name: "Los Angeles", state: "CA", country: "USA",
			    capital: false, population: 3900000 });
			citiesRef.doc("DC").set({
			    name: "Washington, D.C.", state: null, country: "USA",
			    capital: true, population: 680000 });
			citiesRef.doc("TOK").set({
			    name: "Tokyo", state: null, country: "Japan",
			    capital: true, population: 9000000 });
			citiesRef.doc("BJ").set({
			    name: "Beijing", state: null, country: "China",
			    capital: true, population: 21500000 });
			break;
		case action.getdocument:
			let docRef = db.collection("cities").doc("SF");

			docRef.get().then(function(doc) {
			    if (doc.exists) {
			    	let likethis = doc.data();
			        console.log("Document data:", likethis);
			    } else {
			        console.log("No such document!");
			    }
			}).catch(function(error) {
			    console.log("Error getting document:", error);
			});
			break;
		case action.where:
			db.collection("cities").where("capital", "==", true)
		    .get()
		    .then(function(querySnapshot) {
		        querySnapshot.forEach(function(doc) {
		            console.log(doc.id, " => ", doc.data());
		        });
		    })
		    .catch(function(error) {
		        console.log("Error getting documents: ", error);
		    });
		    break;
		case action.getall:
			db.collection("cities").get().then(function(querySnapshot) {
			    querySnapshot.forEach(function(doc) {
			        console.log(doc.id, " => ", doc.data());
			    });
			}); 
			break;
		case action.realtime:
			db.collection("cities").doc("SF")
			    .onSnapshot(function(doc) {
			        console.log("Current data: ", doc && doc.data());
			    });
			break;
		case action.localchange:
			db.collection("cities").doc("SF")
			    .onSnapshot(function(doc) {
			        var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
			        console.log(source, " data: ", doc && doc.data());
			    });
			break;
		case action.multilisten:
			db.collection("cities").where("state", "==", "CA")
			    .onSnapshot(function(querySnapshot) {
			        var cities = [];
			        querySnapshot.forEach(function(doc) {
			            cities.push(doc.data().name);
			        });
			        console.log("Current cities in CA: ", cities.join(", "));
			    });
			break;
		case action.changetype:
			db.collection("cities").where("state", "==", "CA")
			    .onSnapshot(function(snapshot) {
			        snapshot.docChanges.forEach(function(change) {
			            if (change.type === "added") {
			                console.log("New city: ", change.doc.data());
			            }
			            if (change.type === "modified") {
			                console.log("Modified city: ", change.doc.data());
			            }
			            if (change.type === "removed") {
			                console.log("Removed city: ", change.doc.data());
			            }
			        });
			    });
			break;
		case action.detach:
			var unsubscribe = db.collection("cities")
			    .onSnapshot(function () {});
			// ...
			// Stop listening to changes
			unsubscribe();
			break;
		case action.error:
			db.collection("cities")
			    .onSnapshot(function(snapshot) {
			        //...
			    }, function(error) {
			        //...
			    });
		    break;
		case action.orderlimit:
			citiesRef.where("population", ">", 100000).orderBy("population").limit(2);
			break;
		case action.paginate:
			let first = db.collection("cities")
			        .orderBy("population")
			        .limit(2);

			return first.get().then(function (documentSnapshots) {
			  // Get the last visible document
			  let lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
			  console.log("last", lastVisible);

			  // Construct a new query starting at this document,
			  // get the next 25 cities.
			  let next = db.collection("cities")
			          .orderBy("population")
			          .startAfter(lastVisible)
			          .limit(2);
			});
			break;
		case action.multicondition:
			// Will return all Springfields
			db.collection("cities")
			   .orderBy("name")
			   .orderBy("state")
			   .startAt("Springfield")

			// Will return "Springfield, Missouri" and "Springfield, Wisconsin"
			db.collection("cities")
			   .orderBy("name")
			   .orderBy("state")
			   .startAt("Springfield", "Missouri")
			break;
		default:
	}
}

// queryData(action.paginate);