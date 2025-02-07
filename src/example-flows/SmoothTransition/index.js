import { Easing, Tween, autoPlay } from 'es6-tween';
import React, { useCallback, useState } from 'react';
import ReactFlow, { addEdge, Background } from 'react-flow-renderer';

import './transition.css';

autoPlay(true);

const TRANSITION_TIME = 300;
const EASING = Easing.Quadratic.Out;

const initialElements = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Smooth Transition' },
    position: { x: 250, y: 5 },
  },
  {
    id: '2',
    type: 'output',
    data: { label: 'zoom-in' },
    position: { x: 100, y: 100 },
  },
  { id: '3', data: { label: 'zoom-out' }, position: { x: 400, y: 100 } },
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
];

const SmoothTransition = () => {
  const [rfInstance, setRfInstance] = useState(null);
  const [elements, setElements] = useState(initialElements);
  const onConnect = (params) => setElements((els) => addEdge(params, els));

  const onLoad = useCallback((instance) => {
    instance.fitView();
    setRfInstance(instance);
  }, []);

  const handleZoom = useCallback(
    (ratio) => () => {
      const { zoom } = rfInstance.toObject();

      new Tween({ zoom })
        .to({ zoom: zoom * ratio }, TRANSITION_TIME)
        .easing(EASING)
        .on('update', ({ zoom }) => rfInstance.zoomTo(zoom))
        .start();
    },
    [rfInstance]
  );

  const handleTransform = useCallback(
    (transform) => () => {
      const {
        position: [x, y],
        zoom,
      } = rfInstance.toObject();

      new Tween({ x: x, y: y, zoom })
        .to(transform, TRANSITION_TIME)
        .easing(EASING)
        .on('update', ({ x, y, zoom }) =>
          rfInstance.setTransform({ x, y, zoom })
        )
        .start();
    },
    [rfInstance]
  );

  return (
    <div className="transition">
      <ReactFlow elements={elements} onConnect={onConnect} onLoad={onLoad}>
        <div className="controls">
          <button onClick={handleZoom(1.2)}>zoom in</button>
          <button onClick={handleZoom(1 / 1.2)}>zoom out</button>
          <button onClick={handleTransform({ x: 0, y: 0, zoom: 1 })}>
            pan to center(0,0,1)
          </button>
        </div>
        <Background />
      </ReactFlow>
    </div>
  );
};

export default SmoothTransition;
