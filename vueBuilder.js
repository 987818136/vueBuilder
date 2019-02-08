 import axios from 'axios';
 export default (function(){
   function vq(){
     this.canSend=true;
     this.vueOb={};
     this.ofenData={};
   }
   //修改当前vue对象
   vq.prototype.v=function(vue){
      this.vueOb=vue;
      return this;
   }
   //常用工具
   //cookies
  vq.prototype.cookier={
     setCookies:function(name,value,day){
      var Days = day||1;
      var exp = new Date();
      exp.setTime(exp.getTime() + Days*24*60*60*1000);
      document.cookie =  name + "="+escape( value) + ";expires=" + exp.toGMTString();
      this.MemberId=value;
      this.cookieNum=this.getCookie(this.MemberId);
    },
     getCookie:function(name){
      var arr=[];
      var name=name||"MemberId";
      var reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
      if(arr=document.cookie.match(reg))
      return unescape(arr[2]);
      else
      return null;
    },
     deleteCookies:function(name){
      var exp = new Date();
      exp.setTime(exp.getTime() - 1);
      var cval=this.getCookie(name);
      if(cval!=null)
      document.cookie=name +"="+cval+";expires="+exp.toGMTString();
      this.cookieNum=null;
    },
  };
   vq.prototype.helpTool={
     //对象参数formdata化
   	 toqs:function(nameArray,valueArray){
            var data="";
            if (nameArray instanceof Object&& !(nameArray instanceof Array)){
		          var _arr=[];
		          for(i in nameArray){
		             _arr.push(i); 
		          }
		          for(var j=0;j<_arr.length;j++){
		             data+=_arr[j];
		             data+="="
		             data+=nameArray[_arr[j]];
		             if(_arr.length>1&&j!=_arr.length-1){
		                data+="&"
		             }
                  }            
             }
             else{ 
		          for(var i=0;i<nameArray.length;i++){
		             data+=nameArray[i];
		             data+="="
		             data+=valueArray[i];
		             if(nameArray.length>1&&i!=nameArray.length-1){
		               data+="&"
		             }
		          }          
              }
        return data;
      },
     isPhone:function(tel){
     	return !!String(tel).match(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/ig);
     } 
   }
   //放置常用参数
   vq.prototype.putData=function(name,fn){
       this.ofenData[name]=fn;
   }
   vq.prototype.getData=function(name,togo){
    var _data=null;
    var vueob=this.vueOb;
    var _value=this.ofenData[name](vueob);
    if(togo){
      _data=this.objectAdd(togo,_value);
    }else{
      _data=_value;
    }
    return _data;
   }
   vq.prototype.objectAdd=function(target,adder){
    var _target=target
    if(adder){
       for(var item in adder){
         _target[item]=adder[item];
       }
    }
     return _target;
   }
   //数据绑定
   vq.prototype.dataBind=function(name,value,fn){
   	var _fn=fn||function(){};
   	this.vueOb[name]=value
   	_fn();
   }
   //发送请求
   vq.prototype.sendMes=function(ob){
   	//回调定义
   	var _fn=null;
   	var that=this;
   	var isAsycn=ob.isAsycn||false;
   	var loaderdiv = document.createElement("div"); 
   	var _type=ob.type||"get";
   	ob.fn?_fn=ob.fn:function(res){
   		console.log(res);
   	}
   	var backdata=null;
    //状态器
    var state={
    	//post请求发送
       post:function(){
       	  var statethat=this;
       	    this.beforeSend();       	  	
	       	  axios.post(ob.url,ob.data).then(function(res){
	       	  	var newres=statethat.defaultFn(res);
	       		  ob.fn(newres);
	       	  }).catch(function(err){
	       		  ob.err?ob.err(err):(function(){console.log(err)})();
              statethat.defaultFn(err)
	       	  })
       },
       //get请求发送
       get:function(){
          var statethat=this;
          var str="";
          ob.data?str='?'+that.helpTool.toqs(ob.data):str=""
       	    this.beforeSend();       	  	
	       	  axios.get(ob.url+str).then(function(res){
	       	  	var newres=statethat.defaultFn(res);
	       		  ob.fn(newres);
	       	  }).catch(function(err){
	       		  ob.err?ob.err(err):(function(){console.log(err)})();
             statethat.defaultFn(err)
	       	  })   
       },
       //判断是否需要某些操作，封装统一判断
       defaultFn:function(res){
          var _data=res.data;
          if(ob.loader){
            document.body.removeChild(loaderdiv);
          }
	      if(!isAsycn){
	        that.canSend=true;
	      }
	      if(ob.valueName){
	      	for(var i=0,len=ob.valueName.length;i<len;i++){
              _data=_data[ob.valueName];
	      	}
	      } 
	      backdata=_data;
	      return _data;      
       },
       beforeSend:function(){
	   	  if(ob.loader){
	   		 this.showLoader();
	   	  }
  	
       },     
       showLoader:function(){
    		  //定义默认loader，如果用户没指定使用默认loader
    		  var defaultloader="<div style='position:fixed;left:0px;right:0px;top:0px;bottom:0px;background-color:rgba(0,0,0,0.8);z-index:999999999999'><div style='border-radius:25px;background-color:white;width:150px;text-align:center;padding:10px 0px;position:absolute;left:50%;top:50%;margin-left:-75px'>加载中...</div></div>";
    		  var loaderhtml=ob.loaderhtml||defaultloader;
              loaderdiv.innerHTML = loaderhtml; 
              document.body.appendChild(loaderdiv);
       }
     }
     //最终发送请求
      if(isAsycn){
        state[_type]();
      }else{
        if(this.canSend){
          this.cansend=false;
          state[_type]();
        }else{
        }
      }
      return backdata;
   }
   //多个请求发送
   vq.prototype.sendAll=function(ob){
      var isAsycn=ob.isAsycn||false;
      if(isAsycn){
          for(var i=0,len=ob.reqList.length;i<len;i++){
             ob.reqList[i].isAsycn=true;
             this.sendMes(ob.reqList[i]);
          }
      }else{
         //监视者模式帮助同步发送
          var length=ob.reqList.length;
          var nownum=0;
          var that=this;
          var listner={
            waylist:{},
            regist:function(name,fn){
              this.waylist[name]=fn; 
            },
            send:function(name,arg){
               this.waylist[name](arg);
            }
          };
          function obHandle(reslast){
            var _reslast=reslast
            var _fn=function(res){
              ob.reqList[nownum].fn(res,_reslast);
              if(nownum<length-1){
                nownum++;
                listner.send("finish",res);
              }
            }
            var _ob={
                      url:ob.reqList[nownum].url,
                      type:ob.reqList[nownum].type,
                      data:ob.reqList[nownum].data,
                      fn:_fn,
                      err:ob.reqList[nownum].err,
                   } 
            return _ob;           
          }
          //同步发送
          listner.regist("finish",function(reslast){
             var _ob=obHandle(reslast);
             that.sendMes(_ob);
          });
          var firstob=obHandle();
          this.sendMes(firstob);      
      }
   }
   vq.prototype.bindTo=function(ob){
   	  var _arr=ob.url.split("/")
   	  var _name=ob.bindName||_arr[_arr.length-1];
   	  var that=this;
      ob.fn=function(value){
        that.dataBind(_name,value);
        ob.addfn?ob.addfn(value):function(){};
      };
      this.sendMes(ob);
   };
   vq.prototype.testHave=function(ob){
       var vuexData=this.vueOb.$store.state[ob.name][ob.testname];
       if(vuexData){
         ob.hasFn(vuexData);
       }else{
         ob.noFn(ob.data);
       }
   }
   vq.prototype.vuexBind=function(ob){
      var _ob=ob;
      var that=this;
      _ob.noFn=function(){
        that.bindTo(ob.data);
      }
      _ob.hasFn=function(store){
        that.vueOb[ob.name]=store;
      }
      this.testHave(_ob);
   }
   //迭代器工具
   vq.prototype.insertTo=function(res,name,value){
      var res=res;
      if(typeof value=='object'){
         for(var i=0,len=res.length;i<len;i++){
           res[i][name]=value[i];
         }
      }else{
          for(var i=0,len=res.length;i<len;i++){
           res[i][name]=value;
         } 
      }
      return res;
   }
   vq.prototype.getInfo=function(){
    this.vq.sendMes({
            url:"/api/Agency/GetAgencyInfo",
            isAsycn:true,
            fn:function(res){
             that.$store.state.userInfo=res;
             that.vq.cookier.setCookies("Id",res.Object.Id,1);
             that.vq.cookier.setCookies("AgencyName",res.Object.AgencyName,1);
             that.vq.cookier.setCookies("AgencyBalance",res.Object.AgencyBalance,1);
             that.vq.cookier.setCookies("EarningOfPaying",res.Object.EarningOfPaying,1);       
            }
      }); 
   }  
   vq.prototype.forHas=function(res,has,name){
      var res=res;
      var arr=[];
      if(res instanceof Array){
         for(var i=0,len=res.length;i<len;i++){
          if(name){
            if(res[i][name]==has){
              arr.push(res[i]);
            }
          }else{
            if(res[i]==has){
              arr.push(res[i]);
            }            
          }
         }
      }else{
         for(var item in res){
           if(res[item]==has){
             arr.push(res[item])
           }
         }
      }
      return arr;
   }
   //绑定循环
   //循环查找符合的  ·   
   return vq;
 })()
