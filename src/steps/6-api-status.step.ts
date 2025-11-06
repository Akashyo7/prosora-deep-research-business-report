import { FlowContext } from '@motiadev/core';

export const config = {
    name: 'api.status',
    type: 'api',
    path: '/research/status',
    method: 'GET',
    emits: [],
};

export const handler = async (request: Request, { state }: FlowContext) => {
    const url = new URL(request.url);
    const requestId = url.searchParams.get('requestId');

    if (!requestId) {
      return new Response(JSON.stringify({ error: 'requestId is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const researchState = await state.get(requestId);

    if (!researchState) {
      return new Response(JSON.stringify({ error: 'Research request not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify(researchState), { status: 200, headers: { 'Content-Type': 'application/json' } });
};