import React from 'react';
import ReactDOM from 'react-dom';

const SeverityNumberBlock = (props) => {
	return (
		<div className="block-combo">
			<div className={`${props.colorClass} block`} onClick={props.onBlockClick}></div>
			<span>{props.num}</span>
		</div>
		);
}
export default SeverityNumberBlock;