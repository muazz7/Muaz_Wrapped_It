import Groq from "groq-sdk";
import { NextResponse } from "next/server";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export async function POST(req: Request) {
    try {
        // 1. Get the messages array from your website
        const { messages } = await req.json() as { messages: Message[] };

        // Validate messages
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json({ error: "No messages provided" }, { status: 400 });
        }

        // Check if API key exists
        if (!process.env.GROQ_API_KEY) {
            return NextResponse.json({ error: "GROQ_API_KEY not configured" }, { status: 500 });
        }

        // 2. Setup Groq client
        const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY,
        });

        // 3. Ask Groq with full conversation history
        const chatCompletion = await groq.chat.completions.create({
            messages: messages.map((msg) => ({
                role: msg.role,
                content: msg.content,
            })),
            model: "llama-3.1-8b-instant",
        });

        // 4. Send answer back to website
        const text = chatCompletion.choices[0]?.message?.content || "No response received.";
        return NextResponse.json({ text });
    } catch (error: unknown) {
        console.error("Groq API Error:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: `Failed to fetch response: ${errorMessage}` }, { status: 500 });
    }
}