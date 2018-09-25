  import axios from "axios";
  import vue from "vue";
  export default vueBuilder;
/*自动登录相关*/
  /*cookie*/
  function vueBuilder(MemberId,vueob){
   this.vueOb=vueob||null;
   this.MemberId=MemberId||"MemberId";
   this.cookieNum=0;
   this.canpost=true;
   this.reflash=true;
   this.vuexList={};
   this.helpStore={};
  }
  vueBuilder.prototype.vueXInit=function(ob){
    var srcob=ob;
    var _ob={};
    for(var item in srcob){
      console
      _ob[item]=srcob[item];
    }
    this.vuexList=_ob;
  }
  vueBuilder.prototype.cookier={
     setCookies:function(name,value,day){
      var Days = day||7;
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
    checkLoginCookie:function(name){
      var loginArr=[];
      var arr=[];
      var name=name||"MemberId";
      var reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
      var regt=new RegExp("(^| )"+"token"+"=([^;]*)(;|$)");
      if(arr=document.cookie.match(reg)){
       loginArr.push(arr[2]);        
      }
      else{
        loginArr.push(null); 
      }
      if(arr=document.cookie.match(regt)){
        loginArr.push(arr[2]);
      }
      else{
        loginArr.push(null);
      }
      if(loginArr[0]!=null&&loginArr[1]!=null){
        return true;
      }
      else{
        return false;
      }
    }  
  };
  /*制定vue实例对象*/
  vueBuilder.prototype.v=function(vueOb){
      this.vueOb=vueOb;
      this.cookieNum=this.cookier.getCookie(this.MemberId);
      return this;
  }

    /*自动登录*/
  vueBuilder.prototype.routerAuto=function(tourl,nourl,target){
    var _cookieNum=this.cookieNum;
    target.beforeEach((to,from,next)=>{
   //看目标地址是否需要验证登录
      if (to.matched.some(record=>{ return record.meta.requireAuth})) {
          if (this.cookier.checkLoginCookie()) {
              next();
          }else{
              next({
                  path:nourl
              })
          }
      }else{
          next();
      }
   });
  };
  
/*请求相关*/
  /*axios*/
  vueBuilder.prototype.saj=function(ob){
        var ob=ob;
        var that=ob.target||this;
        var dataType=ob.dataType||"json";
        var data=ob.data;
        var returnData=null;
        var successFn=ob.fn;
        var loaderName=ob.loaderName||false;
        var catchFn=ob.fn2?ob.fn2:function(err){console.log(err)};
        /*算法模式*/
        var state={
         thenFn:function(response){
            successFn(response.data);
            that.canpost=true;
            if(loaderName){
              that.vueOb.$data[loaderName]=false;
            }
            returnData=response.data;          
         },
         errorFn:function(err){
            catchFn(err);
            that.canpost=true;
         },
         post:function(){
            var _that=this;
            if(dataType==="json"){
              data=JSON.stringify(ob.data);
            }else{
              data=that.helpTool.myqs(data);
            };
            axios.post(ob.url,data)
            .then(function(response){
             _that.thenFn(response);
            })
            .catch(function(err){
              _that.errorFn(err);
            });    
         },
         get:function(){
            var _that=this;
            if(typeof ob.data=="undefined"){
              
            }else{
              var _data=ob.data;
              var _url=ob.url;
              var _furl=_url+"?"+that.helpTool.myqs(_data);
              ob.url=_furl;
            }
            axios.get(ob.url)
            .then(function (response) {
              _that.thenFn(response);
            })
            .catch(function (err) {
                _that.errorFn(err);
            });           
         }      
        };
        if(that.canpost){
          /*防止请求重复提交*/
          that.canpost=false;
            if(loaderName){
              that.vueOb.$data[loaderName]=true;
            }      
          state[ob.type]();
        }
        else{
        }
        return returnData;
     };

     vueBuilder.prototype.loaderAx=function(ob){
      var that=this;
      var loaderName=ob.loaderName;
       that.vueOb[loaderName]=true;
       var _fn=ob.fn;
       ob.fn=function(data){
        that.vueOb[loaderName]=false;
         _fn(data); 
       };
       this.saj(ob);
     }
    /*axios配置*/      
  vueBuilder.prototype.axiosInit=function(ob){
 
  };    
    /*axios并发*/
  vueBuilder.prototype.axiosAll=function(ob){
    var sendArr=[];
    var that=this;
    var way="";
    var type="";
    var oneFn=ob.oneFn||null;
    ob.inOne?way="inOne":way="apart";
    var reqArr=ob.reqArr;

    //状态器*/
    var state={
      whichFn:function(oneFn,data){
         //简易监听器
         var lis={
           on:function(type,fn){
             this.list[type]=fn;
           },
           fire:function(type,arg){
            this.list[type](arg)
           },
           list:{}           
         };        
        if(oneFn===null){
         for(var i=1,len=reqArr.length-1;i<len;i++){
            (function(i){
             lis.on("list"+i,function(){
               sendArr[i].then(function(res){
                 reqArr[i].fn(res.data);
                 list.fire("list"+(i+1));
               }
               );
             })
            })();
         };
         sendArr[0].then(function(res){
           reqArr[0].fn(res.data);
           lis.fire("list1");
         })
        }
        else{
          oneFn(data);
        }
      },

      inOne:function(){
        var _that=this;
        return function(){
          axios.all(sendArr).then(axios.spread(function(){
            var _dataArr=[];
            for(var i=0,len=arguments.length;i<len;i++){
              _dataArr.push(arguments[i].data);
            }
            _that.whichFn(oneFn,_dataArr);
          }));  
        } 
      },

      apart:function(){
       return function(){
        _that.whichFn(oneFn);
       } 
      },
      getType:function(i){
        return function(){
          if(typeof reqArr[i].data!="undefined"){
            var param=that.helpTool.myqs(reqArr[i].data);
            sendArr.push(axios.get(reqArr[i].url+"?"+param));
          }
          else{
            sendArr.push(axios.get(reqArr[i].url));           
          }            
        }     
      },
      postType:function(i){
        return function(){
          var param= reqArr[i].data;
          sendArr.push(axios.post(reqArr[i].url,param));  
        }         
      }
    }
    for(var i=0;i<reqArr.length;i++){
     reqArr[i].type=="get"?type="getType":type="postType";
     state[type](i)();
    }
    state[way]()();
  };

 /*快速数据绑定*/ 
   /*发送请求，并快速绑定数据*/  
   vueBuilder.prototype.getTobind=function(ob){
      var fn=null;
      var valueName=ob.valueName||false;
      var that=this;
      var vuex=ob.vuex||false;
      if(typeof ob.valueName=="undefined"){   
        fn=function(data){
          that.quickData(data,"vue");
          }   
      }
      else{

          fn=function(data){
            var _fn=that.quickBind.bind(that);
            var dataName=ob.dataName||[""];
            var _data=data;
           for(var i=0,len=dataName.length;i<len;i++){
             _data=_data[dataName[i]];
           }
            if(vuex){
             that.vueOb.$store.state[ob.valueName]=_data; 
            }
            _fn(ob.valueName,_data)
           }
      }
      ob.fn=fn;
      this.saj(ob);         
   };
    /*数据绑定方法*/
    vueBuilder.prototype.quickData=function(data,type){
      var dataNamearray=[];
      var targetNamearray=[];
      var varname="";
      var that=this;
      var type=type||"vue";
      var vuedata=that.vueOb.$data;
      var vuexstore=that.vueOb.$store.state;
        for (varname in data){
          dataNamearray.push(varname);
        }

        if(type=="vue"){
           for(var i=0,len=dataNamearray.length;i<len;i++){
            if(!vuedata[dataNamearray[i]]){
               console.log(dataNamearray[i]+"属性不存在")
            } 
            else{
              vuedata[dataNamearray[i]]=data[dataNamearray[i]];
             }
           }
        }
        else{
          for(var i=0,len=dataNamearray.length;i<len;i++){
            if(typeof that.vueOb.$store.state[dataNamearray[i]]=="undefined"){
               console.log(dataNamearray[i]+"属性不存在")
            } 
            else{
              vuexstore[dataNamearray[i]]=data[dataNamearray[i]];
             }
           } 
        }    
    };

    vueBuilder.prototype.quickBind=function(namearr,valueArray){
      if(namearr instanceof Array){
        for(var i=0;i<namearr.length;i++){
          this.vueOb[namearr[i]]=valueArray[i];
        } 
      }
      else{
        this.vueOb[namearr]=valueArray;
      }
    };
    /*vuex相关工具*/
    vueBuilder.prototype.vuexChange=function(name,value){
        var that=this;
        if(name instanceof Object){
         that.quickData(name,"vuex");
        } 
        else{  
         that.vueOb.$store.state[name]=value;  
        }     
    };    
    /*内部常用工具库*/
    vueBuilder.prototype.helpTool={
      /*表单模式数据生成*/
      myqs:function(nameArray,valueArray){
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
        }else{
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
      /*查询出某些对象合为一个对象*/
      tOne:function(arr,ob){
        var _ob={};
       for(var i=0;i<arr.length;i++){
        _ob[arr[i]]=ob[arr[i]];
       }
       return _ob;
      }
    };
 
 
/*登录接口。外观模式集合为一个接口*/
    vueBuilder.prototype.loginTo=function(ob){
        var ob=ob;
        var autoLogin=autoLogin||true;
        var data=ob.data;
        var autoLogin=ob.autoLogin||true;
        var that=this;
        var name=ob.name||null;
        var MemberId=this.MemberId;
        var goTo=function(data){
          that.vueOb.$router.push(ob.tourl);
          /*vuex储存一下return的data*/
          if(!name){
            that.vuexChange(data);
          }else{
            that.vuexChange(name,data);
          }
        }

        var loginGetback=function(data){
        if(!data){
          errorfn?errorfn():(function(){alert("用户名或者密码错误")})();
        }
        else{
          if(autoLogin){
            that.cookier.setCookies(MemberId,data[MemberId]);
            that.cookier.setCookies("token",data.token);
            goTo(data);
          }
          else{
            goTo(data);
          }
        }
      };
      var returnData=this.saj({
        type:"post",
        data:data,
        url:ob.url,
        fn:loginGetback
      });
      return returnData;      
    };
  /*判断是否有vuex缓存，没有则加载*/
    vueBuilder.prototype.mineLoad=function(url,load,name,testname,addRequest,type){
            var that=this;
            var name=name||"userInfo";
            var testname=testname||"NickName";
            var addRequest=addRequest||false;
            var initData={
              MemberId:this.cookieNum
            }
            if(!that.vueOb.$store.state[name][testname]){
                if(addRequest){
                  for(var item in addRequest){
                     initData[item]=addRequest[item];
                  }
                  this.saj({
                    type:type,
                    data:initData,
                    url:url,
                    loaderName:load,
                    fn:function(res){
                    that.vuexChange(name,res.Data);
                    var _res={};
                    _res[name]=res.Data;
                    that.quickBind(name,_res);
                   }
                  })
                }else{
                    that.getInfoByid(url,function(res){
                    that.vuexChange(name,res);
                    var _res={};
                    _res[name]=res;
                    that.quickData(_res);
                  },load);
                }            
            }
            else{
               that.vueOb[name]=that.vueOb.$store.state[name];
            }         
    };
  /*自定义无vuex缓存加载策略*/
    vueBuilder.prototype.testVuex=function(name,testname,fn,fn2){
            var that=this;
            var name=name||"userInfo";
            var testname=testname||"NickName";
            var fn2=fn2||function(){
            that.vueOb[name]=that.vueOb.$store.state[name];
            }
            if(!that.vueOb.$store.state[name][testname]){
              fn();
            }
            else{
              var _data=that.vueOb.$store.state[name];
              fn2(_data);
            }         
    };  
    /*登出接口*/
    vueBuilder.prototype.loginOut=function(tourl){
       this.cookier.deleteCookies("MemberId");
       this.cookier.deleteCookies("token");
        this.vueOb.$router.push(tourl);
        window.location.reload();
    }
  /*通过MemberId获取信息*/
  vueBuilder.prototype.getInfoByid=function(url,put,load){
   var MemberId=this.cookieNum;
   var that=this;
   var putfn=function(){};
   if(MemberId!=null){
     typeof put=="function"?putfn=put:putfn=that.quickData.bind(that);
     var backdata=this.saj({
      type:"get",
      url:url+"?"+that.MemberId+MemberId,
      fn:putfn,
      loaderName:load
     });
   }
   else{
     console.log("cookie里没有用户id");
   }
  }
  /*check 路由传参*/
   vueBuilder.prototype.checkRouter=function(name,checker,ob){
            this.vueOb[name]=this.vueOb.$route.query[checker];
            if(typeof this.vueOb.$route.query.item=="string"){
              this.getTobind(ob);
            }    
   }
   /*切换*/
    vueBuilder.prototype.tabChannel=function(channelId,changeId,ob){
       var that=this;
       that.vueOb[channelId]=changeId;
       varob=ob
       ob.vuex=true;
       that.testVuex(ob.valueName,ob.testname,function(){
          that.getTobind(ob);
       },function(){that.vueOb[ob.valueName]=that.vueOb.$store.state[ob.valueName]})
   }
   /*帮助路由传参*/
   vueBuilder.prototype.handleStore=function(ob,name){
    var _name="v"+name;
     this.vueOb.$router.push('SteamDaiGouDetail?storeid='+name);
     this.helpStore[_name]=ob;
   }
   vueBuilder.prototype.getStore=function(fn,fn2,name){
    var name=name||this.vueOb.$route.query.storeid;
    var _name="v"+name
     if(!this.helpStore[_name]){
       fn(name);
     }
     else{
       fn2(this.helpStore[_name]);
     }
   }
   vueBuilder.prototype.renderTable=function(data){
     var _vuedata=this.vueOb.$data[data.dataName];
     var _html="<table class='table-style'><tr>";
     for(var i=0,len=data.title.length;i<len;i++){
       _html+="<td class='table-title'>";
       _html+=data.title[i];
       _html+="</td>";
     }

     _html+="</tr>";
     for(var j=0,len=_vuedata.length;j<len;j++){
 
       _html+="<tr>";
       for(var item in _vuedata[j]){
         _html+="<td class='table-td'>";
         _html+=_vuedata[j][item];
         _html+="</td>";
       }
       _html+="</tr>"
     }
     _html+="</table>";
     if(!data.tableClass){

     }else{
       _html=this.indexAdd(_html,/table-style/g,data.tableClass,"table-style");
     }
     if(!data.titleClass){

     }else{
       _html=this.indexAdd(_html,/table-title/g,data.tableClass,"table-title");
     }
     if(!data.tdClass){

     }else{
       _html=this.indexAdd(_html,/table-td/g,data.tableClass,"table-td");
     }          
     return _html;
   }

   vueBuilder.prototype.tabCard=function(ob){
    var that=this;

     return   function(ob){
      
        var _template="<div class='tab-content'><div v-for='title in data' class='tab-title'>{{title}}</div><div class='tab-body'>@content</div></div>";
        var _data=ob.data.dataName;
      return new vue({
          el:"#tabCard",
          data:{
            data:that.vueOb.$data[_data],
          },
          template:"<div class='tab-content'><div v-for='title in data' class='tab-title'>{{title}}</div></div>",
          methods:{
            change:function(){

            }
          }
         })
      }
   }   
   vueBuilder.prototype.indexAdd=function(str,reg,addName,className){
     return str.replace(reg,""+className+" "+addName);
   }  
