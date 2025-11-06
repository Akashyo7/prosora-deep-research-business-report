import { FlowContext } from '@motiadev/core';
import { z } from 'zod';

const ResearchStateSchema = z.object({
    status: z.string(),
    report: z.string().optional(),
});

export const config = {
    name: 'api.report',
    type: 'api',
    path: '/research/report',
    method: 'GET',
    emits: [],
};

export const handler = async (request: Request, { state }: FlowContext) => {
    const url = new URL(request.url);
    const requestId = url.searchParams.get('requestId');

    if (!requestId) {
      return new Response(JSON.stringify({ error: 'requestId is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const researchState = await state.get<z.infer<typeof ResearchStateSchema>>(requestId);

    if (!researchState || researchState.status !== 'completed') {
      return new Response(JSON.stringify({ error: 'Report not ready or not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ report: researchState.report }), { status: 200, headers: { 'Content-Type': 'application/json' } });
};