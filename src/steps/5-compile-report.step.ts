import { FlowContext } from '@motiadev/core';
import { GroqService } from '../services/groq.service';
import { z } from 'zod';

const AnalyzeContentEventDataSchema = z.object({
    requestId: z.string(),
    analyzedContent: z.array(z.any()),
    query: z.string(),
});

type AnalyzeContentEvent = {
    data: z.infer<typeof AnalyzeContentEventDataSchema>
}

export const config = {
    name: 'compile.report',
    type: 'event',
    subscribes: ['analyze.content'],
    emits: ['compile.report'],
};

export const handler = async (event: AnalyzeContentEvent, { state }: FlowContext) => {
    const { analyzedContent, query, requestId } = event.data;
    const groqService = new GroqService();

    const prompt = `
      Based on the following analyzed content, generate a comprehensive business research report for the query: "${query}".
      The report should have the following sections:
      1. Executive Summary
      2. Key Findings
      3. Market Analysis
      4. Competitive Landscape
      5. Conclusion

      Analyzed Content:
      ${JSON.stringify(analyzedContent, null, 2)}

      Return the report as a single string.
    `;

    const reportContent = await groqService.generate(prompt);

    await state.set(requestId, 'report', reportContent);
    await state.set(requestId, 'status', 'completed');
};