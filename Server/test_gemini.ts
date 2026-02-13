import dotenv from "dotenv"
dotenv.config()
import { generateReply } from "./services/gemini.service"

async function test() {
    try {
        console.log("Testing Gemini API...")
        const reply = await generateReply("Hello, who are you?")
        console.log("Reply:", reply)
    } catch (err) {
        console.error("Test failed:", err)
    }
}

test()
