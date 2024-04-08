import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import env from '@/lib/env';

dotenv.config();



const connectionOptions = {
    dbName: 'soro-soro',
    useUnifiedTopology: true,

}
mongoose.connect(env.MONGO_URL, connectionOptions).then(() => {
    console.log('Db connected')
})




