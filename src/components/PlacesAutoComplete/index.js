import React, { Component } from 'react';
import { geocodeByPlaceId, geocodeByAddress } from '../../utils'

import '../../../public/css/placesAutoComplete.css'

import SuggestItem from './SuggestItem'

class PlacesAutoComplete extends Component {
    constructor(props) {
        super(props)

        this.state = {
            address: props.defaultValue,
            empty: false,
            predictions: []
        }
    }
    
    /**
     * 元件加載完畢後載入 google map places autocomplete service object
     */
    componentDidMount() {
        this.autocompleteService = new google.maps.places.AutocompleteService()
        this.autocompleteOK = google.maps.places.PlacesServiceStatus.OK
        this.autocompleteZERO = google.maps.places.PlacesServiceStatus.ZERO_RESULTS
    }

    /**
     * 若找不到相關選項資訊，則設定 Empty 狀態
     */
    setEmptySuggestionItem = () => {
        this.setState({
            predictions: [],
            empty: true
        })
    }

    /**
     * 設定 地址 狀態，並且同時觸發 callback
     */
    setAddress = (address) => {
        this.setState({
            address
        })
        this.props.onInputChange(address)
    }
    
    /**
     * 地址翻譯完成後的 callback，
     * 需依照回傳狀態作動作
     * @param { Array } predictions
     * @param { sring } status
     */
    getPlacePreductionsCallback = (predictions, status) => {
        if (status === this.autocompleteOK) {
            this.setState({
                empty: false,
                predictions: predictions.map((prediction) => {
                    const { description, place_id } = prediction
                    const { main_text, secondary_text } = prediction.structured_formatting
                    
                    return {
                        description,
                        place_id,
                        main_text,
                        secondary_text
                    }
                })
            })
        } else if (status === this.autocompleteZERO) {
            this.setEmptySuggestionItem()
        }
    }
    
    /**
     * 清空自動完成 Container
     */
    clearSuggestionContainer = () => {
        this.setState({
            empty: false,
            predictions: []
        })
    }

    /**
     * 鍵盤操作上下輪巡選項時，取得 active 的選項
     */
    getActiveItem = () => {
        return this.state.predictions.find(prediction => (
            prediction.active
        ))
    }

    /**
     * 取得現在輪巡到的選項，若沒有任何被輪巡則回傳0
     */
    getActiveItemIndex = () => {
        let index = 0

        this.state.predictions.forEach((prediction, predictionIndex) => {
            if (prediction.active) {
                index = predictionIndex
            }
        })

        return index
    }

    /**
     * 鍵盤操作上下輪巡選項時，設定選項的 active 屬性，
     * 並且在設定的時候一併更新輸入框顯示的地址
     */
    setActiveItemIndex = (index) => {
        let activeItem

        this.setState({
            predictions: this.state.predictions.map((prediction, predictionIndex) => {
                if (predictionIndex === index) {
                    activeItem = prediction

                    return { ...prediction, active: true }
                } else {
                    return { ...prediction, active: false }
                }
            })
        })

        this.setAddress(activeItem.description)
    }

    /**
     * 輸入框按下 Entet 的動作
     */
    handleKeyEnter = () => {
        const activeItem = this.getActiveItem()

        let address, placeId
        if (activeItem) {
            address = activeItem.description
            placeId = activeItem.place_id
        } else {
            address = this.refs.input.value
        }


        this.props.onSelectedStart()

        setTimeout(() => {
            geocodeByPlaceId(placeId, (err, location, results) => {
                if (err) {
                    geocodeByAddress(address, (err, location, results) => {
                        this.props.onSelectedEnd(err, location, results)
                    })
                } else {
                    this.props.onSelectedEnd(err, location, results)
                }
            })
        }, 500)

        this.clearSuggestionContainer()
    }

    /**
     * 輸入框按下 Down 的動作
     */
    handleKeyDown = () => {
        const activeItem = this.getActiveItem()

        let activeItemIndex = this.getActiveItemIndex()
        if (activeItem) {
            activeItemIndex = (activeItemIndex === (this.state.predictions.length - 1)) ? 0 : (activeItemIndex + 1)
        }

        this.setActiveItemIndex(activeItemIndex)
    }

    /**
     * 輸入框按下 Up 的動作
     */
    handleKeyUp = () => {
        const activeItem = this.getActiveItem()

        let activeItemIndex = this.getActiveItemIndex()
        if (activeItem) {
            activeItemIndex = (activeItemIndex === 0) ? (this.state.predictions.length - 1) : activeItemIndex - 1
        }

        this.setActiveItemIndex(activeItemIndex)
    }

    
    /**
     * 輸入框變更時的動作，
     * 執行地址翻譯動作
     */
    onInputChange = () => {
        const address = this.refs.input.value

        this.setAddress(address)

        if (address) {
            this.autocompleteService.getPlacePredictions({
                input: address
            }, this.getPlacePreductionsCallback)
        } else {
            this.clearSuggestionContainer();
        }
    }

    /**
     * 輸入框被按下時最上層的動作
     */
    onInputKeyDown = (event) => {
        const KEY_DOWN = 40
        const KEY_UP = 38
        const KEY_ENTER = 13
        const KEY_ESC = 27

        switch(event.which) {
            case KEY_DOWN:
                this.handleKeyDown()
                break
            case KEY_UP:
                this.handleKeyUp()
                break
            case KEY_ENTER:
                this.handleKeyEnter()
                break
            case KEY_ESC:
                this.clearSuggestionContainer()
                break
            default:
        }
    }

    /**
     * 輸入框失去焦點時的動作
     */
    onInputBlur = () => {
        this.clearSuggestionContainer();
    }

    /**
     * 選項元件被滑鼠按下時的動作
     */
    onSuggestItemClick = (suggest) => {
        const address = suggest.description
        const placeId = suggest.place_id

        this.setAddress(address)

        this.props.onSelectedStart()

        setTimeout(() => {
            geocodeByPlaceId(placeId, (err, location, results) => {
                if (err) {
                    geocodeByAddress(address, (err, location, results) => {
                        this.props.onSelectedEnd(err, location, results)
                    })
                } else {
                    this.props.onSelectedEnd(err, location, results)
                }
            })
        }, 500)
    }

    /**
     * 渲染輸入框
     */
    renderInput = () => {
        const { placeholder, autoFocus } = this.props

        return (
            <input type="text" ref="input"
                className="places_input"
                placeholder={ placeholder }
                value={ this.state.address }
                onChange={ this.onInputChange }
                onKeyDown={ this.onInputKeyDown }
                onBlur={ this.onInputBlur }
                autoFocus={ autoFocus } />
        )
    }

    /**
     * 渲染自動完成 Container
     */
    renderSuggestionContainer = () => {
        if (this.state.empty) {
            return <div className="empty">Empty</div>
        } else if (this.state.predictions.length > 0) {
            return (
                <div className="suggestion_container">
                    {
                        this.state.predictions.map((suggest, suggestIndex) => (
                            <SuggestItem key={ suggestIndex } suggest={ suggest } onClick={ this.onSuggestItemClick }/>
                        ))
                    }
                </div>
            )
        } else {
            return null
        }
    }

    render() {
        const { className } = this.props

        let cn = 'place_auto_complete_container'
        if (className) {
            cn = cn + ' ' + className
        }

        return (
            <div className={ cn }>
                { this.renderInput() }
                { this.renderSuggestionContainer() }
            </div>
        );
    }
}

export default PlacesAutoComplete;