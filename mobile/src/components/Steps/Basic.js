import React from 'react';
import styles from './Basic.less';

class Arrow extends React.Component {
    render() {
        var {width, height} = this.props;
        return (
            <svg className='arrow' width={width || 14} height={height || 40} viewBox="0 0 14 40">
                <g transform="translate(-19.367715,-906.67177)">
                    <a transform="matrix(0.4059671,0,0,0.43302802,-11.844235,491.13986)">
                        <path style={{fill: '#eeeeee', fillOpacity: 1, fillRule: 'evenodd', stroke: 'none'}}
                              d="m 85.618002,1052.2217 -8.735048,-0.029 26.205146,-46.2839 -26.205146,-46.31291 8.735048,0 26.205138,46.31291 z"/>
                    </a>
                </g>
            </svg>
        );
    }
}

export default class Basic extends React.Component {
    render() {
        const items = this.props.items.map((item, idx, list) => {
            return (
                <div key={idx} className='item' style={{ background: item.activeItem ? '#108ee9' : '#ddd', 'border-radius' : '2em' }}>
                    <span className='number' style={{ color: item.activeItem ? '#fff' : 'initial'}}>{idx + 1}</span>
                    <Arrow width={30} height={60} />
                    <span className='text' style={{ color: item.activeItem ? '#fff' : 'initial' }}>{item.text}</span>
                </div>
            );
        });
        return (<div style={this.props.style}>{items}</div>);
    }
}
