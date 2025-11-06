import { z } from 'zod';
import { createId } from '@paralleldrive/cuid2';
import { FlowContext } from '@motiadev/core';

export const config = {
  name: 'api.start.research',
  type: 'api',
  path: '/research',
  method: 'POST',
  emits: ['research.started'],
};

export const handler = async (req: { body: { query: string, depth: 'basic' | 'detailed' | 'comprehensive' } }, { state }: FlowContext) => {
    const { query, depth } = req.body;
    const requestId = createId();

    await state.set(requestId, 'status', 'pending');
    await state.set(requestId, 'query', query);
    await state.set(requestId, 'depth', depth);

    return {
      status: 202,
      body: {
        requestId,
      },
      events: [{
        name: 'research.started',
        data: { requestId, query, depth },
      }]
    };
};