import { Motia } from '@motiadev/core';

const app = new Motia();

app.start().then(() => {
  console.log('🚀 Motia research agent started on http://localhost:3000');
});