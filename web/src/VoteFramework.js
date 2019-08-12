import $ from 'jquery'
import nunjucks from 'nunjucks'
import './css/vote.css'

let newUI = `
<style>
@keyframes progress-animation {
  0% {
    width: {{ progress }}%;
  }
  100% {
    width: {{ progress }}%;
  }
}
</style>
<div id="atp-demo-1" class="atp-stage">
	<div class="atp-progress-bar">
		<div class="atp-progress-bar-indicator" style="color:white;text-align:right;"><span style="margin-right: 5px;"></span></div>
	</div>
	<div class="atp-loading-content hidden" style="display:none;" id="atp-loading-content">
    <div class="blockchain-waiting">
      <div class="mask"></div>
      <div class="stage">
        <div class="box movingbox">
          <div class="block"></div>
          <div class="block"></div>
          <div class="block"></div>
          <div class="block"></div>
          <div class="block"></div>
          <div class="block movingblock"></div>
        </div>
        <div class="block stuntblock generating-block"></div>
      </div>
      <div class="line"></div>
    </div>
    <div class="timer">{{ elapsed_i18n }} <br/> <span class="counter">0</span> {{ time_unit_i18n }}</div>
		<p class="tips">{{ loading_i18n }}...</p>
	</div>
	<div class="atp-page">
		<header>
			<h2>{{ question }}</h2>
		</header>
		<div id="opitem" class="atp-option-container">
			<ul class="atp-option-list">
        {% for item in options %}
				<li>
					<label class="atp-option">
						<input type="radio" name="tie-option" value="{{ loop.index0 }}">
						<span name="item-vale" class="atp-option-label">{{ item }}</span>
					</label>
					
				</li>
        {% endfor %}
  
			</ul>
			
		</div>
			<!--<footer>-->
		<!--<h7 text-align: center;">{{ message }}</h7>-->
			<!--</footer>-->
		<footer>
		
			<button type="button" class="atp-btn atp-action-next">{{ next_i18n }}</button>
		</footer>
	</div>
	<div class="atp-action">
		<a  class="atp-action-cancel" >{{ cancel_i18n }} </a>
		   <div style="position: absolute ;right: 5px;bottom: 15px">
		      <img style="transform:scale(0.6)" src="data:image/png;base64,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">
		   <!--<img src="img/atp-logo.png"/>-->
	  <!--<img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTM3cHgiIGhlaWdodD0iMzJweCIgdmlld0JveD0iMCAwIDEzNyAzMiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICAgIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggNTAuMiAoNTUwNDcpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPgogICAgPHRpdGxlPkFUUExvZ2/mqKrniYjpu5E8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZGVmcz48L2RlZnM+CiAgICA8ZyBpZD0i572R6aG1IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iQVRQSG9tZXBhZ2UtQ29weS0yNiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI2My4wMDAwMDAsIC0yMC4wMDAwMDApIiBmaWxsPSIjMDAwMDAwIiBmaWxsLXJ1bGU9Im5vbnplcm8iPgogICAgICAgICAgICA8ZyBpZD0iQVRQTG9nb+aoqueJiOm7kSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjYzLjAwMDAwMCwgMjAuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0iR3JvdXAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDU5LjAwMDAwMCwgMTAuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTguNTIyOTI2ODMsMTQuNzcyNzI3MyBMNy40NTc1NjA5OCwxMC43MzYzNjM2IEwyLjc2ODA0ODc4LDEwLjczNjM2MzYgTDEuNzIxNzA3MzIsMTQuNzcyNzI3MyBMMC4wNTcwNzMxNzA3LDE0Ljc3MjcyNzMgTDQuMDYxNzA3MzIsMC4yMzYzNjM2MzYgTDYuMjQsMC4yMzYzNjM2MzYgTDEwLjI0NDYzNDEsMTQuNzcyNzI3MyBMOC41MjI5MjY4MywxNC43NzI3MjczIFogTTUuMTY1MTIxOTUsMi4xNTQ1NDU0NSBMNS4wNTA5NzU2MSwyLjE1NDU0NTQ1IEwzLjE1ODA0ODc4LDkuMzM2MzYzNjQgTDcuMDQ4NTM2NTksOS4zMzYzNjM2NCBMNS4xNjUxMjE5NSwyLjE1NDU0NTQ1IFoiIGlkPSJTaGFwZSI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIGlkPSJTaGFwZSIgcG9pbnRzPSIyMS4wMTI0MzkgMTQuNzcyNzI3MyAyMS4wMTI0MzkgMS42NzI3MjcyNyAxNy42MDcwNzMyIDEuNjcyNzI3MjcgMTcuNjA3MDczMiAwLjIzNjM2MzYzNiAyNi4wNzI5MjY4IDAuMjM2MzYzNjM2IDI2LjA3MjkyNjggMS42NzI3MjcyNyAyMi42Njc1NjEgMS42NzI3MjcyNyAyMi42Njc1NjEgMTQuNzcyNzI3MyI+PC9wb2x5Z29uPgogICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIGlkPSJTaGFwZSIgcG9pbnRzPSIzNS43NzUzNjU5IDE0Ljc3MjcyNzMgMzUuNzc1MzY1OSAwLjIzNjM2MzYzNiAzNy40NCAwLjIzNjM2MzYzNiAzNy40NCAxMy4zMzYzNjM2IDQyLjM3NjgyOTMgMTMuMzM2MzYzNiA0Mi4zNzY4MjkzIDE0Ljc3MjcyNzMiPjwvcG9seWdvbj4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNTkuMjg5NTEyMiwxNC43NzI3MjczIEw1OC4yMjQxNDYzLDEwLjczNjM2MzYgTDUzLjUzNDYzNDEsMTAuNzM2MzYzNiBMNTIuNDg4MjkyNywxNC43NzI3MjczIEw1MC44MjM2NTg1LDE0Ljc3MjcyNzMgTDU0LjgyODI5MjcsMC4yMzYzNjM2MzYgTDU3LjAwNjU4NTQsMC4yMzYzNjM2MzYgTDYxLjAxMTIxOTUsMTQuNzcyNzI3MyBMNTkuMjg5NTEyMiwxNC43NzI3MjczIFogTTU1LjkzMTcwNzMsMi4xNTQ1NDU0NSBMNTUuODE3NTYxLDIuMTU0NTQ1NDUgTDUzLjkyNDYzNDEsOS4zMzYzNjM2NCBMNTcuODE1MTIyLDkuMzM2MzYzNjQgTDU1LjkzMTcwNzMsMi4xNTQ1NDU0NSBaIiBpZD0iU2hhcGUiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNzAuMTgwOTc1NiwxNC42NjM2MzY0IEw3MC4xODA5NzU2LDEzLjI5MDkwOTEgQzcwLjcwNDE0NjMsMTMuMzYzNjM2NCA3MS4yNzQ4NzgsMTMuNDE4MTgxOCA3MS44OTMxNzA3LDEzLjQ3MjcyNzMgQzcyLjUxMTQ2MzQsMTMuNTE4MTgxOCA3My4wNDQxNDYzLDEzLjU0NTQ1NDUgNzMuNDcyMTk1MSwxMy41NDU0NTQ1IEM3NC4wNjE5NTEyLDEzLjU0NTQ1NDUgNzQuNTM3NTYxLDEzLjUwOTA5MDkgNzQuODgsMTMuNDI3MjcyNyBDNzUuMjMxOTUxMiwxMy4zNDU0NTQ1IDc1LjUxNzMxNzEsMTMuMjA5MDkwOSA3NS43MzYwOTc2LDEzLjAxODE4MTggQzc1Ljk0NTM2NTksMTIuODM2MzYzNiA3Ni4wNzg1MzY2LDEyLjU2MzYzNjQgNzYuMTQ1MTIyLDEyLjIxODE4MTggQzc2LjIxMTcwNzMsMTEuODYzNjM2NCA3Ni4yNDk3NTYxLDExLjM5MDkwOTEgNzYuMjQ5NzU2MSwxMC44IEM3Ni4yNDk3NTYxLDEwLjAyNzI3MjcgNzYuMjIxMjE5NSw5LjQ4MTgxODE4IDc2LjE2NDE0NjMsOS4xNzI3MjcyNyBDNzYuMTA3MDczMiw4Ljg2MzYzNjM2IDc1Ljk2NDM5MDIsOC42NDU0NTQ1NSA3NS43NTUxMjIsOC41MDkwOTA5MSBDNzUuNTM2MzQxNSw4LjM3MjcyNzI3IDc1LjE1NTg1MzcsOC4yNjM2MzYzNiA3NC42MTM2NTg1LDguMTgxODE4MTggTDcyLjAzNTg1MzcsNy44IEM3MS40MTc1NjEsNy43IDcwLjk0MTk1MTIsNy41IDcwLjYzNzU2MSw3LjIgQzcwLjMyMzY1ODUsNi45IDcwLjEyMzkwMjQsNi41MDkwOTA5MSA3MC4wMjg3ODA1LDYuMDI3MjcyNzMgQzY5LjkzMzY1ODUsNS41NDU0NTQ1NSA2OS44ODYwOTc2LDQuOTA5MDkwOTEgNjkuODg2MDk3Niw0LjEgQzY5Ljg4NjA5NzYsMi42MzYzNjM2NCA3MC4yMDk1MTIyLDEuNiA3MC44NjU4NTM3LDAuOTgxODE4MTgyIEM3MS41MjIxOTUxLDAuMzcyNzI3MjczIDcyLjU1OTAyNDQsMC4wNjM2MzYzNjM2IDc0LjAwNDg3OCwwLjA2MzYzNjM2MzYgQzc1LjM4NDE0NjMsMC4wNjM2MzYzNjM2IDc2LjUwNjU4NTQsMC4xNzI3MjcyNzMgNzcuMzgxNzA3MywwLjQgTDc3LjM4MTcwNzMsMS43MDkwOTA5MSBDNzYuMzkyNDM5LDEuNTM2MzYzNjQgNzUuMzg0MTQ2MywxLjQ1NDU0NTQ1IDc0LjM4NTM2NTksMS40NTQ1NDU0NSBDNzMuNzQ4MDQ4OCwxLjQ1NDU0NTQ1IDczLjI0MzkwMjQsMS41MDkwOTA5MSA3Mi44NzI5MjY4LDEuNjA5MDkwOTEgQzcyLjUwMTk1MTIsMS43MTgxODE4MiA3Mi4yMTY1ODU0LDEuODcyNzI3MjcgNzIuMDI2MzQxNSwyLjA4MTgxODE4IEM3MS44MzYwOTc2LDIuMjkwOTA5MDkgNzEuNzAyOTI2OCwyLjU1NDU0NTQ1IDcxLjY0NTg1MzcsMi44NjM2MzYzNiBDNzEuNTg4NzgwNSwzLjE3MjcyNzI3IDcxLjU2MDI0MzksMy41NzI3MjcyNyA3MS41NjAyNDM5LDQuMDQ1NDU0NTUgQzcxLjU2MDI0MzksNC42OTA5MDkwOSA3MS41ODg3ODA1LDUuMTYzNjM2MzYgNzEuNjQ1ODUzNyw1LjQ1NDU0NTQ1IEM3MS43MDI5MjY4LDUuNzQ1NDU0NTUgNzEuODI2NTg1NCw1Ljk0NTQ1NDU1IDcxLjk5NzgwNDksNi4wNTQ1NDU0NSBDNzIuMTc4NTM2Niw2LjE2MzYzNjM2IDcyLjQ3MzQxNDYsNi4yNTQ1NDU0NSA3Mi44ODI0MzksNi4zMjcyNzI3MyBMNzUuMzc0NjM0MSw2LjcwOTA5MDkxIEM3NS45OTI5MjY4LDYuODA5MDkwOTEgNzYuNDg3NTYxLDYuOTU0NTQ1NDUgNzYuODM5NTEyMiw3LjE1NDU0NTQ1IEM3Ny4xOTE0NjM0LDcuMzU0NTQ1NDUgNzcuNDY3MzE3MSw3LjY5MDkwOTA5IDc3LjY1NzU2MSw4LjE3MjcyNzI3IEM3Ny44MzgyOTI3LDguNTgxODE4MTggNzcuOTIzOTAyNCw5LjM5MDkwOTA5IDc3LjkyMzkwMjQsMTAuNiBDNzcuOTIzOTAyNCwxMS42ODE4MTgyIDc3LjgwMDI0MzksMTIuNTM2MzYzNiA3Ny41NTI5MjY4LDEzLjE1NDU0NTUgQzc3LjMwNTYwOTgsMTMuNzcyNzI3MyA3Ni44OTY1ODU0LDE0LjIyNzI3MjcgNzYuMzI1ODUzNywxNC41MDkwOTA5IEM3NS43NTUxMjIsMTQuNzkwOTA5MSA3NC45NzUxMjIsMTQuOTI3MjcyNyA3My45NzYzNDE1LDE0LjkyNzI3MjcgQzcyLjYwNjU4NTQsMTQuOTQ1NDU0NSA3MS4zNDE0NjM0LDE0Ljg0NTQ1NDUgNzAuMTgwOTc1NiwxNC42NjM2MzY0IFoiIGlkPSJTaGFwZSI+PC9wYXRoPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwIj4KICAgICAgICAgICAgICAgICAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAwMDAwMCwgMTkuMTUzMTQ5KSIgaWQ9IlNoYXBlIiBvcGFjaXR5PSIwLjUiPgogICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9IjMzLjE5MzgyNzIgMy4zOTQ0Njg5OCAzMy43ODA2NTg0IDUuMjI0NDQ4MDYgMzkuNjM5NTA2MiAzLjkyNTQ0NzM2IDM0LjI2MzM3NDUgMTIuMTg0MDU3NiAzNC42OTg3NjU0IDEyLjE4NDA1NzYgMzYuMDA0OTM4MyAxMi4xODQwNTc2IDQ1Ljk2MjEzOTkgMCI+PC9wb2x5Z29uPgogICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9IjI5LjkyODM5NTEgNC4yNTczMDg4NSAwLjAzNzg2MDA4MjMgMTIuMTg0MDU3NiAyLjY1OTY3MDc4IDEyLjE4NDA1NzYgMzAuNTgxNDgxNSA1LjkxNjYxNjMxIj48L3BvbHlnb24+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIGlkPSJTaGFwZSIgcG9pbnRzPSIyLjY1OTY3MDc4IDMxLjMzNzIwNjYgMjUuMjE0ODE0OCA4LjU5MDQ3MTc2IDM0LjA0NTY3OSAzMS4zMzcyMDY2IDM2LjAwNDkzODMgMzEuMzM3MjA2NiAyNi4wMDA0MTE1IDAuMDY2MzcyMjk4NCAwLjAzNzg2MDA4MjMgMzEuMzM3MjA2NiI+PC9wb2x5Z29uPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=" alt="Atlas Protocol" style="height: 60%;width: 60%">-->
        </div>
	</div>
    <div id="loading" class="facebook" style="display:none;text-align: center;position: absolute;
			top:50%;
			left:50%;
			width: 100px;
			height: 100px;
			margin:-50px 0 0 -50px;
">
			<div></div>
			<div></div>
			<div></div>
		</div>

</div>`


let uiTemplateLast = `
<div id="atp-demo-1" class="atp-stage">
	<div class="atp-progress-bar">
		<div class="atp-progress-bar-indicator" style="width:100%;"></div>
	</div>
  <div class="atp-page atp-page-in">
    <div style="text-align:center;font-size:33px;margin-top:8%;margin-bottom:15%;">{{ summary_i18n }}</div>
    <!-- <div style="text-align:center;font-size:22px;">{{ summary_i18n }}</div> -->
    <footer>
			<button type="button" class="atp-btn atp-action-cancel">{{ back_i18n }}</button>
		</footer>
  </div>
</div>`

const locales = {
    zh: {
        cancel_i18n: '返回',
        back_i18n: '返回',
        next_i18n: '下一步',
        loading_i18n: '加载中',
        received_i18n: '您获得了',
        summary_i18n: '总共{{total}}题, 你答对了{{right}}题',
        elapsed_i18n: '你的回答正在写入区块链 ... ',
        time_unit_i18n: '秒'
    },
    en: {
        cancel_i18n: 'Cancel',
        back_i18n: 'Back',
        next_i18n: 'Next',
        loading_i18n: 'Loading',
        received_i18n: 'You have received',
        summary_i18n: 'You got {{right}} out of {{total}} questions right!',
        elapsed_i18n: 'Your answer is being written to blockchain ... ',
        time_unit_i18n: 's'
    }
}
var dataItem = {}
export default class VoteFramework {
    constructor(atlasp, campaignID, user, container) {
        this.atlasp = atlasp
        this.campaignID = campaignID
        this.hasNext = false
        this.user = user
        this.container = container
        this.timer = null
        this.ajaxbg = $("#background,#progressBar");
        this.tips = function (data) {
            this.container.find(".atp-loading-content").removeClass("hidden").children(".tips").html(data)
        }

        this.stopTips = function () {
            this.atlasp.stopTips()
        }

        // this.closeTie = function() {
        //     console.log('closeTie')
        //     this.container.empty()
        // }

    }

    setLocale(l) {
        this.locale = l
    }

    getIntl() {
        const l = locales[this.locale] ? locales[this.locale] : locales["en"]
        return {...l}
    }

    render(ele, tie) {
        let totalQuestion = parseInt(tie.numTie, 10) - 1
        // have finish all questions
        if (tie.data === "END") {
            // get balanceof user
            // this.atlasp.callContract("balanceOf", `["${this.user}"]`, (o) => {
            //   clearTimeout(this.timer)
            //   this.stopTips()
            //   let balance = o.result.replace(/^"*/, '').replace(/"*$/, '')
            //   balance = parseInt(balance, 10)
            //   if (balance.toString() === 'NaN') {
            //     balance = 0
            //   }
            //   let intl = this.getIntl()
            //   // intl.summary_i18n = intl.summary_i18n.replace('{{total}}', totalQuestion).replace('{{right}}', tie.numInteract)
            //   intl.summary_i18n = tie.message
            //   ele.html(nunjucks.renderString(uiTemplateLast, {...intl, balance}))
            // })
            clearTimeout(this.timer)
            this.stopTips()
            let intl = this.getIntl()
            let balance = 0
            intl.summary_i18n = tie.message
            ele.html(nunjucks.renderString(uiTemplateLast, {...intl, balance}))
        } else {
            this.stopTips()
            clearTimeout(this.timer)
            let data = tie.data
            let rT = Object.prototype.toString.call(data)
            let dataLocale = null
            let matchLocale = false
            if (rT === '[object Array]') {
                for (let i = 0, l = data.length; i < l; i++)
                    if (data[i].language === this.locale || (data[i].language === 'cn' && this.locale === 'zh')) {
                        dataLocale = data[i]
                        matchLocale = true
                        break
                    }
            }
            if (!matchLocale) {
                dataLocale = data[0]
            }

            if (dataLocale.hasOwnProperty('message')) {
                this.message = dataLocale.message
            }

            dataLocale.currentNum = parseInt(tie.index, 10) + 1
            dataLocale.totalNum = totalQuestion
            dataLocale.progressStart = Math.ceil(100 * (dataLocale.currentNum - 1) / (dataLocale.totalNum + 1))
            dataLocale.progress = Math.ceil(100 * dataLocale.currentNum / (dataLocale.totalNum + 1))

            // if (this.locale === 'zh') {
            //   data.question = data.question_cn
            //   data.options = data.options_cn
            // }

            ele.html(nunjucks.renderString(newUI, {...this.getIntl(), ...dataLocale, balance: tie.balance}))
            dataItem = tie.data;
        }
    }

    beforeSubmit() {
        console.log('beforeSubmit')

        let op = $('input[name=tie-option]:radio:checked', this.container)
        let opVal = null
        if (op.length > 0) {
            // $("#atp-loading-content").css('display', 'block'); //加载上链
            $('.atp-btn', this.container).attr('disabled', true)
            opVal = op.val()
        }
        let item = {
            key: opVal,
            val: dataItem[0].options[opVal]
        }
        console.log('val' + dataItem[0].options[opVal])
        return item
    }

    onSubmit() {
        console.log('onSubmit')
        let _this = this
        let start = (new Date()).getTime()
        let to = function () {
            _this.container.find('.atp-loading-content .timer .counter').html(Math.floor(((new Date()).getTime() - start) / 1000))
            _this.timer = setTimeout(to.bind(_this), 1000)
        }
        if (this.timer) {
            clearTimeout(this.timer)
        }
        this.timer = setTimeout(to.bind(this), 1000)
        this.container.find('.atp-action-cancel').hide()
        // $("#atp-loading-content").css('display','block');
        this.container.find('.atp-page').empty().append(this.container.find('.atp-loading-content').removeClass('hidden'))
    }

    //移除loading效果
    completeLoading() {
        document.getElementById("loading").style.display = "none";
        $('.facebook').empty()
    }

    //展示loading效果
    showLoading() {
        document.getElementById("loading").style.display = "block";
    }

    // closeTie = function (){
    //     console.log('closeTie')
    //     this.container.empty()
    // }

}
