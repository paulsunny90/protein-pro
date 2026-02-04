import app  from "./app.ts";
import connectDB from "./config/db.config.ts"

const PORT = process.env.PORT || 5000


const start = async ()=>{
    await  connectDB();
    app.listen(PORT,()=>{
        console.log(`Server running on http://localhost:${PORT}`)
    })
}
start();