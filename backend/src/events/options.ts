export const project = {
  projectId: '4653',
  id: 0, // because root
  children: [
    { type: 'file', id: 1, file_name: 'test.js', project_id: '4653' },
    {
      type: 'dir',
      id: 2,
      directory_name: 'testdir',
      project_id: '4653',
      children: [
        { type: 'file', id: 3, file_name: 'test2.js', project_id: '4653' },
        { type: 'file', id: 4, file_name: 'test3.js', project_id: '4653' },
      ],
    },
  ],
};

export const options = {
  async onLoadDocument(context) {
    const projectId = context.document.name;
    console.log('OnLoad -------->', projectId);
    //   await handleLoadDocument(context, projectId);
    const ymap = context.document.getMap('root');
    ymap.set('filetree', project);
    console.log(
      'Array loaded from house',
      Array.from(context.document.getMap('root')),
    );
    return context.document;
  },
  onConnect: (context) => {
    console.log('------onConnect------->', {context})
    if (context) {
      const connectionId = context.connection?.id || 'unknown';
      const roomName = context.document?.name || 'unknown';

      console.log(`Client connected: ${connectionId}`);
      console.log(`Room name: ${roomName}`);
    } else {
      console.error('Awareness context is undefined');
    }
  },
  onDisconnect: (context) => {
    const connectionId = context.connection?.id || 'unknown';
    console.log(`Client disconnected: ${connectionId}`);
  },
  onError: (context, error) => {
    console.error(`Error occurred: ${error.message}`);
  },
  onUpdate: (context) => {
    console.log(`Document updated in room: ${context.document.name}`);
  },
};

export default options;
