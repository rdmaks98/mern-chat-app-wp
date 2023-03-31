import mongoose from 'mongoose';
const connectmongo = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log(`Mongodb Connect: ${conn.connection.host}`)
    }
    catch (err) {
        console.log(`Error From Mongodb Coneection: ${err.message}`)
        process.exit()
    }
}

export default connectmongo;