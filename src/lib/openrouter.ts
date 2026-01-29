// Z.AI API client for GLM-4.7 model using OpenAI SDK
import OpenAI from 'openai';

export interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

const SYSTEM_PROMPT = `You are an expert software engineer and logical problem solver. You provide clear, concise, and accurate answers with code examples when appropriate. Format your responses using markdown for better readability.`;

export async function* streamChat(
    messages: Message[]
): AsyncGenerator<{ content: string; reasoning: string }, void, unknown> {
    const apiKey = import.meta.env.VITE_ZAI_API_KEY;

    if (!apiKey) {
        throw new Error('VITE_ZAI_API_KEY is not set');
    }

    const client = new OpenAI({
        apiKey,
        baseURL: 'https://api.z.ai/api/paas/v4/',
        dangerouslyAllowBrowser: true, // Required for browser usage
    });

    const allMessages = [
        { role: 'system' as const, content: SYSTEM_PROMPT },
        ...messages.filter(m => m.role !== 'system'),
    ];

    let accumulatedContent = '';
    let accumulatedReasoning = '';

    try {
        const stream = await client.chat.completions.create({
            model: 'glm-4.7-flash',
            messages: allMessages,
            stream: true,
            max_tokens: 4096,
        });

        for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta;

            if (delta?.content) {
                accumulatedContent += delta.content;
            }

            // Check for reasoning in the delta (some models include this)
            if ((delta as { reasoning?: string })?.reasoning) {
                accumulatedReasoning += (delta as { reasoning?: string }).reasoning;
            }

            // Log finish reason if present
            if (chunk.choices[0]?.finish_reason) {
                console.log('Stream finish reason:', chunk.choices[0].finish_reason);
            }

            yield { content: accumulatedContent, reasoning: accumulatedReasoning };
        }

        console.log('Stream ended. Final content length:', accumulatedContent.length);
    } catch (error) {
        console.error('Stream error:', error);
        throw error;
    }
}
