import Product from "../models/Product";
import { connectDB } from "../config/db";
import 'dotenv/config';

async function syncData () {
    await connectDB();

    const stream = Product.synchronize();
    let count = 0;

    stream.on('data', function(err, doc) {
        count++;
    });

    stream.on('close', function() {
        console.log('indexed ' + count + ' documents!');
    });

    stream.on('error', function(err) {
        console.log(err);
    });
}

syncData().catch((err) => {
    console.error("❌ Error indexing:", err);
    process.exit(1);
});