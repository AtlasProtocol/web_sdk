import VOTE from './VoteFramework'
import $ from 'jquery'
import interTips from './interTips'

const apiVersion = "/v1/"

const testApiUrls = {
    airdrop: 'http://test-ces.atpsrv.net'
}

const apiUrls = {
    airdrop: 'http://ces.atpsrv.net'
}
var localitem = {}

class Atlasp {
    constructor(campaignID, address, dev = false) {
        this.apiUrls = dev ? testApiUrls : apiUrls
        this.mtx = 0
        this.container = null
        this.tie = null
        this.tieState = null
        this.locale = ''
        this.actions = {}
        this.callback = {}
        this.address = address
        this.campaignID = campaignID
        this.retCallback = {
            cancel: () => {
                console.log("cancelcancel")
                this.tie.completeLoading()
            },
            confirm: (accid) => {
                this.tie.completeLoading();
                this.tie.onSubmit();
                this.reqInteract(accid);
            }
        }
        this.initTipsView()
    }

    lock() {
        if (this.mtx !== 0) {
            throw new Error(1001, 'mtx already locked')
        }
        this.mtx = 1
    }

    unlock() {
        this.mtx = 0
    }

    setLocale(l) {
        this.locale = l
    }

    bindContainer(containerID) {

        let $container = $('#' + containerID)
        if ($container.length === 0) {
            return
        }

        this.container = $container

        this.tie = null
        this.bindEvent()

        return this
    }

    submit() {
        this.lock()
        let item = this.tie.beforeSubmit()
        if (item.key === null) {
            this.unlock()
            // alert('illegal operation')
            this.showTipsView('illegal operation')
            return
        }
        // this.tie.onSubmit()
        // if (this.tie.tips !== null) {
        //     this.getBored()
        // }

        localitem = item
        this.callback.choosed(item, this.retCallback)
        this.tie.showLoading()
    }

    reqInteract(accid) {
        $.ajax({
            type: 'POST',
            url: this.apiUrls.airdrop + apiVersion + 'interact',
            dataType: 'json',
            contentType: 'application/json',
            crossDomain: true,
            data: JSON.stringify({
                nasAddress: this.address,
                answer: localitem.key,
                index: this.tieState.index,
                campaignID: this.campaignID,
                accid: accid
            }),
            success: (data, textStatus, xhr) => {
                this.unlock()
                if (data.success) {
                    this.callback.success();
                    this.destroy();
                    // this.pollingResult(data.data.txID)
                } else {
                    this.showTipsView('Post answer error, please reload this page')
                    let errObj = {
                        errMsg:'Post answer error, please reload this page',
                        errCode: '1'
                    }
                    this.callback.failure(errObj);
                    // alert('Post answer error, please reload this page')
                }
            },
            error: (xhr, textStatus, errThrown) => {
                this.unlock()
                this.showTipsView(textStatus)
                let errObj = {
                    errMsg:errThrown,
                    errCode: '2'
                }
                this.callback.failure(errObj);
                // alert(textStatus)
            }
        })
    }

    /*
      actions: {
      begin,
      step,
      finish,
      cancel,
      }
      */
    bindActions(actions) {
        if (actions !== null) {
            this.actions = actions
        }
        return this
    }

    // callback:{
    //     success,
    //     failure
    // }
    bindCallback(callback) {
        if (callback !== null) {
            this.callback = callback
        }
        return this
    }

    bindEvent() {
        this.container.on('click', (ev) => {
            ev.stopPropagation()
            // ev.preventDefault()
            let $t = $(ev.target)
            if ($t.hasClass('atp-action-next')) {
                this.submit()
            } else if ($t.hasClass('atp-action-cancel') || $t.hasClass('atp-action-back')) {
                this.callback.cancel();
                this.destroy()
                if (this.actions.cancel
                    && Object.prototype.toString.call(this.actions.cancel) === '[object Function]') {
                    this.actions.cancel()
                }
            }
        })
        return this
    }

    destroy() {
        this.container.empty()
    }


    setContractAddress(addr) {
        this.contractAddr = addr
    }

    signup() {
        let reqData = JSON.stringify({
            campaignID: this.campaignID,
            nasAddress: this.address,
        })
        $.ajax({
            type: 'POST',
            url: this.apiUrls.airdrop + apiVersion + 'sae/signup',
            dataType: 'json',
            contentType: 'application/json',
            crossDomain: true,
            data: reqData,
            success: (data, txtStat, xhr) => {
                this.unlock()
                if (!data.success) {
                    // let errObj = {
                    //     errMsg:data.errorMsg,
                    //     errCode: '1'
                    // }
                    // this.callback.failure(errObj);
                    this.showTipsView(data.errorMsg)
                } else {
                    // this.address = addr
                    console.log('data' + JSON.stringify(data.data))
                    this.getTie(data.data.contract + '')
                    // resolve({
                    //     ...data.data,
                    //     balance: data.data.balance / Math.pow(10, 18)
                    // })
                }
            },
            error: (xhr, txtStat, err) => {
                this.unlock()
                let errObj = {
                    errMsg:txtStat,
                    errCode: '2'
                }
                this.callback.failure(errObj);
                // reject(txtStat)
            }
        })

    }

    getTie(contractAddr, options = {symbol: ''}) {
        if (!this.contractAddr) {
            this.contractAddr = contractAddr
        }

        this.symbol = options.symbol ? options.symbol : ''

        $.ajax({
            type: 'GET',
            url: this.apiUrls.airdrop + apiVersion + 'tie?campaignID=' + this.campaignID + '&contractAddr=' + this.contractAddr + '&nasAddr=' + this.address,
            dataType: 'json',
            crossDomain: true,
            success: (res, textStatus, xhr) => {
                this.unlock()
                this.container.empty()

                if (!res.success) {
                    console.log(res)
                    return
                }

                let data = b64DecodeUnicode(res.data.data)
                console.log('b64DecodeUnicode'+data)
                if (res.data.state !== 'END') {
                    let tieStat = JSON.parse(data)
                    if (tieStat.hasOwnProperty("index")) {
                        if (tieStat.data === 'END') {
                            if (this.actions.finish && Object.prototype.toString.call(this.actions.finish) === '[object Function]') {
                                this.actions.finish()
                            }
                        }
                        this.tieState = {
                            ...tieStat,
                            type: "SAE"
                        }
                    } else {
                        this.tieState = {
                            index: "1",
                            numTie: "2",
                            numInteract: "0",
                            data: tieStat,
                            type: "CMS",
                            symbol: this.symbol
                        }
                    }
                } else {
                    if (this.actions.finish && Object.prototype.toString.call(this.actions.finish) === '[object Function]') {
                        this.actions.finish()
                    }
                    this.tieState = {
                        data: "END",
                        message: data,
                        index: "2",
                        numTie: "2",
                        numInteract: "1",
                        type: "CMS",
                        symbol: this.symbol
                    }
                    let errObj = {
                        errMsg:'操作异常',
                        errCode: '1'
                    }
                    this.callback.failure(errObj);
                }

                if (!this.tie) {
                    if (this.tieState.type === "SAE") {
                        this.tie = new TIE(this, this.campaignID, this.address, this.container)
                    } else {
                        this.tie = new VOTE(this, this.campaignID, this.address, this.container)
                    }

                    this.tie.setLocale(this.locale === '' ? 'en' : this.locale)
                }

                this.tie.render(this.container, this.tieState)
            },

            error: (xhr, textStatus, errThrown) => {
                this.unlock()
                console.log(errThrown)
                let errObj = {
                    errMsg:errThrown,
                    errCode: '2'
                }
                this.callback.failure(errObj);
            }
        })
    }

    start() {
        this.lock()
        this.signup()
    }


    pollingResult(id) {
        this.lock()

        $.ajax({
            type: 'GET',
            url: this.apiUrls.airdrop + apiVersion + 'transaction-receipt/message/' + id,
            dataType: 'json',
            crossDomain: true,
            success: (data, textStatus, xhr) => {
                this.unlock()
                let tx = data.data
                if (tx === undefined || tx === null || tx.status === undefined || tx.status === null || tx.status === 2) {
                    window.setTimeout(this.pollingResult.bind(this), 2000, id)
                } else if (tx.status === 1) {
                    this.stopTips()
                    if (this.actions.step && Object.prototype.toString.call(this.actions.step) === '[object Function]') {
                        this.actions.step(tx)
                    }
                    this.start(tx.data, this.symbol)
                } else {
                    console.log('Server Error: polling error')
                    showTipsView('Please try again later')
                    // window.location.reload()
                }
            },
            error: (xhr, textStatus, errThrown) => {
                this.unlock()
                console.log(errThrown)
            }
        })
    }


    getBored() {
        let tips = interTips[this.locale]
        let tip = tips[Math.round(Math.random() * 100) % tips.length]
        this.tie.tips(tip)
        this.bored = setTimeout(() => {
            this.getBored()
        }, 5000)
    }

    stopTips() {
        try {
            clearTimeout(this.bored)
            this.bored = null
        } catch (e) {
            console.log("no this.bored to cancel", e)
        }
    }

    initTipsView() {
        $('.alert_div').empty()
        $("body").append("<div class='alert_div'><h1>Tip</h1>" +
            "<span id='sp'></span></div>");
        $('.alert_div').css('display', 'none');
    }

    showTipsView(tips) {
        document.getElementById("sp").innerText = tips;
        $('.alert_div').show().delay(1000).fadeOut();

    }

}

if (typeof window !== 'undefined') {
    window['Atlasp'] = (campaignID, address, dev = false) => {
        return new Atlasp(campaignID, address, dev)
    }
}

export default Atlasp

function b64DecodeUnicode(str) {
    return decodeURIComponent(atob(str).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}
