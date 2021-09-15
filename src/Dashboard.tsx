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

  async builder(node: any) {
    let out = new Rete.Output('num', 'Number', numSocket);

    await node.addOutput(out);
  }

  worker(node: any, _inputs: any, outputs: any) {
    outputs['num'] = node.data.num;
  }
}

export const Dashboard = () => {
  console.log('dashboard');

  // const container = document.querySelector('#rete');
  const rete = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // const data: any = {
    //   id: "demo@0.1.0",
    //   nodes: {
    //     one: {
    //         id: 1,
    //         data: {
    //           num: 2
    //         },
    //         inputs: {},
    //         outputs: {
    //           num: {
    //               connections: [{
    //                 node: 3,
    //                 input: "num1",
    //                 data: {}
    //               }]
    //           }
    //         },
    //         position: [80, 200],
    //         name: "Number"
    //     }
    //   }
    // };

    if (rete && rete.current) {
      const container = rete.current;
      console.log(container)
      const editor = new Rete.NodeEditor('demo@0.1.0', container);

      // editor.fromJSON(data);
      
      editor.use(ConnectionPlugin);
      editor.use(ReactRenderPlugin);
      
      const numComponent = new NumComponent();
      // @ts-ignore
      editor.register(numComponent);
      
      const engine = new Rete.Engine('demo@0.1.0');
      engine.register(numComponent);

      editor.on(['process', 'nodecreated', 'noderemoved', 'connectioncreated', 'connectionremoved'], async () => {
        await engine.abort();
        await engine.process(editor.toJSON());
    });
    }
  }, []);

 useEffect(() => {

 })

  return (
    <div
      id="rete"
      ref={rete}
      style={{
        border: '1px solid red'
      }}
    >
      Hoan
    </div>
  );
};