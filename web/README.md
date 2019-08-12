# 星途协议web sdk开发文档
## Atlas SDK Development  Document for WEB

## For Developers

#### Installation Guide

```
npm i atp-kit
```

-----------------
#### 集成步骤
#### Integration steps

1.复制 atp.js和atp-vote.css 文件夹 到你的工程目录

2.在你需要调用展示sdk的页面加入如下代码,
可参考demo.html

```
<script type="text/javascript" src="./atp.js"></script>
```
```
<link href="atp-vote.css?de27b1b6740b78fa3ab7" rel="stylesheet">
```
在你需要调用的时候执行：


```
 let atp = new Atlasp('cbeditrvif2md98qv4bog', '231dsa231', true)
        atp.setLocale('zh')
        atp.bindContainer('atlasp-container')
        atp.bindCallback(callback)
        atp.start()
```

#### 接口说明
#### Interface specification


```
  * 初始化Atlasp SDK
     * @param campaignID String 投票活动id
     * @param address String 参与地址
     * @param dev  Boolean是否开启调试

public Atlasp.constructor(campaignID, address, dev?) 

```

```
  * 设置语言
     * @param setLocale String 显示语言 zh：中文，cn：英文 
     
(function) public Atlasp.setLocale('zh')
        
```  

    
```
  * 设置展示的containerId
     * @param containerId String 需要展示的containerId
     
(function) public Atlasp.bindContainer(containerId)
```

```
  * 设置回调函数
  * @param callback callback 需要展示的callback
(function) public Atlasp.bindCallback(callback)

       let callback = {
            success: () => {
                console.log('success')
            },
            failure: (errMsg) => {
                // console.log(errObj.errMsg)  //错误信息
                // console.log(errObj.errCode) //错误码
            },
            cancel: () => {
                console.log('cancel')
            },
            choosed: (item, retCallback) => {
                // console.log(item.num) //选中的数值
                // retCallback.cancel()  //取消时候调用
                // retCallback.confirm('accid') //确认下一步时候调用传accid
            }
        }



```

```
  * 启动互动组件
     
(function) public Atlasp.start()
```
