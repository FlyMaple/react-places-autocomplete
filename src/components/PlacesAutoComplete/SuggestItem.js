import React, { Component } from 'react';

class SuggestItem extends Component {
    /**
     * 選項滑鼠點擊動作
     */
    onClick = () => {
        this.props.onClick(this.props.suggest)
    }

    render() {
        const { suggest } = this.props
        const className = suggest.active ? 'suggestion_item active' : 'suggestion_item'

        return (
            <div className={ className } onMouseDown={ this.onClick }>
                <i className="material-icons">place</i>
                <strong>{ suggest.main_text }</strong>
                <small>{ suggest.secondary_text }</small>
            </div>
        );
    }
}

export default SuggestItem;