import { FlowContext } from '@motiadev/core';
import { GroqService } from '../services/groq.service';
import { z } from 'zod';

const SearchWebEventDataSchema = z.object({
    requestId: z.string(),
    searchResults: z.array(z.any()),
});

type SearchWebEvent = {
    data: z.infer<typeof SearchWebEventDataSchema>
}

export const config = {
    name: 'analyze.content',
    type: 'event',
    subscribes: ['search.web'],
    emits: ['analyze.content'],
};

export const handler = async (event: SearchWebEvent, { state }: FlowContext) => {
    const { searchResults, requestId } = event.data;
    const groqService = new GroqService();

    const analysisPromises = searchResults.map(async (result: any) => {
      const prompt = `
        Analyze the following search result and extract the key insights related to the original research query.
        
        Title: ${result.title}
        Link: ${result.link}
        Snippet: ${result.snippet}

        Return the analysis as a JSON object with the keys "title", "link", and "insights" (an array of strings).
      `;

      const analysis = await groqService.generate(prompt, true);

      return JSON.parse(analysis || '{}');
    });

    const analyzedContent = await Promise.all(analysisPromises);

    await state.set(requestId, 'analyzedContent', analyzedContent);
    await state.set(requestId, 'status', 'analyzing-content');
};