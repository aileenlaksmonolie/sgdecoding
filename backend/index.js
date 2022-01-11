const { MongoClient } = require("mongodb");

async function run() {

    // Connection URI
    const uri =
    "mongodb+srv://terry:node1234@cluster0.m84iv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

    // Create a new MongoClient
    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB cluster
        await client.connect();
        console.log('Connected')
        // Make the appropriate DB calls

        //await  listDatabases(client);
        await findOneListingByName(client, "Private Room in Bushwick");
        await findListingsWithMinimumBedroomsBathroomsAndMostRecentReviews(client, {
            minimumNumberOfBedrooms: 4,
            minimumNumberOfBathrooms: 4,
            maximumNumberOfResults: 5
        })
 
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
run().catch(console.error);

async function listDatabases(client){
    const databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
}
//Read
async function findOneListingByName(client, nameOfListing) {
    // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#findOne for the findOne() docs
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").findOne({ name: nameOfListing });

    if (result) {
        console.log(`Found a listing in the collection with the name '${nameOfListing}':`);
        console.log(result);
    } else {
        console.log(`No listings found with the name '${nameOfListing}'`);
    }
}

async function findListingsWithMinimumBedroomsBathroomsAndMostRecentReviews(client, {
    minimumNumberOfBedrooms = 0,
    minimumNumberOfBathrooms = 0,
    maximumNumberOfResults = Number.MAX_SAFE_INTEGER
} = {}) {

    // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#find for the find() docs
    const cursor = client.db("sample_airbnb").collection("listingsAndReviews")
        .find({
            bedrooms: { $gte: minimumNumberOfBedrooms }, // greater than or equal
            bathrooms: { $gte: minimumNumberOfBathrooms }
        }
        )
        .sort({ last_review: -1 })
        .limit(maximumNumberOfResults);

    // Store the results in an array
    const results = await cursor.toArray();

    // Print the results
    if (results.length > 0) {
        console.log(`Found listing(s) with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms:`);
        results.forEach((result, i) => {
            const date = new Date(result.last_review).toDateString();

            console.log();
            console.log(`${i + 1}. name: ${result.name}`);
            console.log(`   _id: ${result._id}`);
            console.log(`   bedrooms: ${result.bedrooms}`);
            console.log(`   bathrooms: ${result.bathrooms}`);
            console.log(`   most recent review date: ${date}`);
        });
    } else {
        console.log(`No listings found with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms`);
    }
}