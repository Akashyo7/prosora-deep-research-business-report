import { FlowContext } from '@motiadev/core';
import { GroqService } from '../services/groq.service';
import { z } from 'zod';

const ResearchStartedEventDataSchema = z.object({
    requestId: z.string(),
    query: z.string(),
    depth: z.string(),
});

type ResearchStartedEvent = {
    data: z.infer<typeof ResearchStartedEventDataSchema>
}

export const config = {
    name: 'generate.queries',
    type: 'event',
    subscribes: ['research.started'],
    emits: ['generate.queries'],
};

export const handler = async (event: ResearchStartedEvent, { state }: FlowContext) => {
    const { query, depth } = event.data;

    const groqService = new GroqService();

    const prompt = `
      Based on the following user query and research depth, generate a list of 3-5 search queries to gather relevant information.
      Query: "${query}"
      Depth: "${depth}"

      Return the queries as a JSON array of strings.
      e.g.
      ["query 1", "query 2", "query 3"]
    `;

    const queries = await groqService.generate(prompt);

    await state.set(event.data.requestId, 'queries', JSON.parse(queries));

    return {
      message: 'Search queries generated successfully.',
    };
};