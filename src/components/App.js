import React, { Component } from 'react';

import loading from '../../public/images/ripple.gif'

import PlacesAutoComplete from './PlacesAutoComplete'

const initState = {
    loading: false,
    address: '',
    location: {},
    state: ''
}

class App extends Component {
    constructor(props) {
        super(props)

        this.state = initState
    }

    /**
     * 設定 loading 的狀態
     * @param { boolean } b
     */
    setLoadStatus = (b) => {
        this.setState({
            loading: b,
        })
    }
    
    /**
     * 設定 地址
     * @param { string } address
     */
    handleInputOnChange = (address) => {
        this.setState(
            { ...initState, address }
        )
    }
    
    /**
     * PlacesAutoComplete 開始翻譯地址前觸發
     */
    handleSuggestSelectedStart = () => {
        this.setLoadStatus(true)
    }

    /**
     * PlacesAutoComplete 翻譯地址完成後觸發
     * success: 顯示座標、地圖
     * ZOER_RESULTS: 顯示 Not Found
     * @param { string } err
     * @param { object } loaction
     * @param { object } results
     */
    handleSuggestSelectedEnd = (err, location, results) => {
        if (err) {
            this.setState({
                state: 'ZERO_RESULTS',
                location: {},
                loading: false
            })
        } else {
            this.setState({
                state: 'success',
                location,
                loading: false
            })
        }
    }

    /**
     * 渲染查詢結果
     */
    renderResult = () => {
        if (this.state.state === 'success') {
            return (
                <div className="result">
                    <div className="state success">
                        <strong>Success!</strong>
                        <div className="desc">
                            Geocoder found latitude and longitude: <b>{ `${ this.state.location.lat }, ${ this.state.location.lng }` }</b>
                        </div>
                    </div>
                </div>
            )
        } else if (this.state.state === 'ZERO_RESULTS') {
            return (
                <div className="result">
                    <div className="state zero">
                        <strong>Not Found!</strong>
                    </div>
                </div>
            )
        }
    }

    /**
     * 渲染地圖
     */
    renderMap = () => {
        const location = this.state.location
        
        if (location.lat && location.lng) {
            return (
                <div className="map">
                    <iframe src={ `http://maps.google.com.tw/maps?f=q&hl=zh-TW&geocode=&q=${ location.lat },+${ location.lng }&z=16&output=embed&t=` } width="600" height="450" allowFullScreen></iframe>
                </div>
            )
        } else {
            return null
        }
    }

    render() {
        return (
            <div id="app">
                <PlacesAutoComplete 
                    className="test"
                    placeholder="Typing Your Address"
                    defaultValue=""
                    autoFocus={ true }
                    onInputChange={ this.handleInputOnChange }
                    onSelectedStart={ this.handleSuggestSelectedStart }
                    onSelectedEnd={ this.handleSuggestSelectedEnd } />

                {
                    this.state.loading ? (
                        <div className="loading">
                            <img src={ loading } alt=""/>
                        </div>
                    ) : null
                }
                { this.renderResult() }
                { this.renderMap() }
            </div>
        );
    }
}

export default App;