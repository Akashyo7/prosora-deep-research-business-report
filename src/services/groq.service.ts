import Groq from 'groq-sdk';

export class GroqService {
  private groq: Groq;

  constructor() {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  async generate(prompt: string, json: boolean = false): Promise<string> {
    const chatCompletion = await this.groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      ...(json ? { response_format: { type: 'json_object' } } : {}),
    });
    return chatCompletion.choices[0].message.content || '';
  }
}