// lib/mongodb.ts

import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI || "mongodb+srv://ashwanigupta1242:sZ6YrXTpNvkYpTI3@backenddb.tgrrz.mongodb.net/interdimensional-comedy?retryWrites=true&w=majority&appName=BackendDB");

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
    // In development, use a global variable to avoid exhausting the database connection pool.
    let globalAny: any = global;
    if (!globalAny._mongoClientPromise) {
        globalAny._mongoClientPromise = client.connect();
    }
    clientPromise = globalAny._mongoClientPromise;
} else {
    clientPromise = client.connect();
}

export default clientPromise;
