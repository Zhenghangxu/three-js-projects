import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
export const renderContent = (content:HTMLElement) => {
    const object = new CSS3DObject(content);
    const renderer = new CSS3DRenderer();
    renderer.setSize(content.clientWidth * 1.02, content.clientHeight * 1.02);
}