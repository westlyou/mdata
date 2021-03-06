
/*
 * report 列表缓存处理
 * @return {Object} functions
 * */
oasgames.mdataServices.factory('ReportCache', [
    '$cacheFactory',
    'CacheControl',
    function ($cacheFactory, CacheControl) {
        return {

            /*
             * cache report list
             * */
            set : function (data) {
                var cache = $cacheFactory.get('report');
                if(!cache) {
                    cache = $cacheFactory('report');
                }
                cache.put('list', data);
                CacheControl.refresh('report');
            },

            /*
             * get report list
             * */
            get : function () {
                if(CacheControl.isExpiration('report')) {
                    return null;
                }
                var cache = $cacheFactory.get('report'),
                    listCache = null;
                if(cache && cache.get('list')) {
                    listCache = cache.get('list');
                }
                return listCache;
            },

            /*
             * delete account list
             * */
            delete : function () {
                var cache = $cacheFactory.get('report');
                if(cache) {
                    cache.remove('list');
                }
                return true;
            },

            /*
             * add report list item
             * @* 如果appid不存在则直接push-data，存在，则比较app下的reportid，存在则替换，不存在则push
             * @param {Object} data
             * @return {Boole} 添加结果
             * */
            addItem : function (data) {
                var listCache = this.get();
                if(!listCache || !data || !data['id'] || !data['appid']) {
                    return false;
                }
                try {
                    for(var i = listCache.length - 1; i >= 0; i--) {
                        if(data['appid'] == listCache[i]['appid']) {
                            for(var j = listCache[i]['reports'].length - 1; j >= 0; j--) {
                                if(data['id'] === listCache[i]['reports'][j]['id']) {
                                    listCache[i]['reports'].splice(j, 1, data['reports'][0]);
                                    return true;
                                }
                            }
                            listCache[i]['reports'].push(data['reports'][0]);
                            return true;
                        }
                    }
                }catch (e) {
                    console.log('add report list item error');
                    console.log(e);
                    return false;
                }

                listCache.push({
                    permission : 1,  //能够创建report，则权限至少为1
                    appname : data.appname,
                    appid : data.appid,
                    reports : [data]
                });
                return true;
            },

            /*
             * delete report list item
             * @return {Boole} 删除结果
             * */
            deleteItem : function (reportid, appid) {
                var listCache = this.get();
                if(!listCache || !appid || !reportid) {
                    return false;
                }
                try {
                    for(var i = listCache.length - 1; i >= 0; i--) {
                        if(appid == listCache[i]['appid']) {
                            for(var j = listCache[i]['reports'].length - 1; j >= 0; j--) {
                                if(reportid === listCache[i]['reports'][j]['id']) {
                                    listCache[i]['reports'].splice(j, 1);
                                    return true;
                                }
                            }
                            return false;
                        }
                    }
                }catch (e) {
                    console.log('delete report list item error');
                    console.log(e);
                    return false;
                }
                return false;
            }
        }
    }
]);
