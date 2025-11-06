import { FlowContext } from '@motiadev/core';
import { searchService } from '../services/search.service';
import { z } from 'zod';

const GenerateQueriesEventDataSchema = z.object({
    requestId: z.string(),
    queries: z.array(z.string()),
});

type GenerateQueriesEvent = {
    data: z.infer<typeof GenerateQueriesEventDataSchema>
}

export const config = {
    name: 'search.web',
    type: 'event',
    subscribes: ['generate.queries'],
    emits: ['search.web'],
};

export const handler = async (event: GenerateQueriesEvent, { state }: FlowContext) => {
    const { queries, requestId } = event.data;

    // In a real application, you would fan out the searches
    // and process them in parallel.
    const searchResults = await Promise.all(
      queries.map((query: string) => searchService.search(query))
    );

    await state.set(requestId, 'searchResults', searchResults.flat());
    await state.set(requestId, 'status', 'searching-web');
};