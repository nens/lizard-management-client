import React, { useEffect, useRef } from 'react';

import Rete from 'rete';
import ConnectionPlugin from 'rete-connection-plugin';
// @ts-ignore
import ReactRenderPlugin from 'rete-react-render-plugin';

const numSocket = new Rete.Socket('Number value');

class NumComponent extends Rete.Component {
  constructor() {
    super('Number');
  }

  // @ts-ignore
  builder(node: any) {
    let out = new Rete.Output('num', 'Number', numSocket);

    node.addOutput(out);
  }

  worker(node: any, _inputs: any, outputs: any) {
    outputs['num'] = node.data.num;
  }
}

const Dashboard = () => {
  // const container = document.querySelector('#rete');
  const rete = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (rete && rete.current) {
      const container = rete.current;
      const editor = new Rete.NodeEditor('demo@0.1.0', container);
      
      editor.use(ConnectionPlugin);
      editor.use(ReactRenderPlugin);
      
      const numComponent = new NumComponent();
      // @ts-ignore
      editor.register(numComponent);
      
      const engine = new Rete.Engine('demo@0.1.0');
      engine.register(numComponent);
      
      editor.on('process', async () => {
          await engine.abort();
          await engine.process(editor.toJSON());
      });
    }
  }, []);

  return (
    <div id="rete" ref={rete}></div>
  );
};

export default Dashboard;