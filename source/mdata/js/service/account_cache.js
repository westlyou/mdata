
/*
 * account 列表缓存处理
 * @return {Object} functions
 * */
oasgames.mdataServices.factory('AccountCache', [
    '$cacheFactory',
    'CacheControl',
    function ($cacheFactory, CacheControl) {
        return {

            /*
             * cache account list
             * */
            set : function (data) {
                var cache = $cacheFactory.get('account');
                if(!cache) {
                    cache = $cacheFactory('account');
                }
                cache.put('list', data);
                CacheControl.refresh('account');
            },

            /*
             * get account list
             * */
            get : function () {
                if(CacheControl.isExpiration('account')) {
                    return null;
                }
                var cache = $cacheFactory.get('account'),
                    listCache = null, listSetTime = '';
                if(cache) {
                    listCache = cache.get('list');
                }
                return listCache
            },

            /*
             * delete account list
             * */
            delete : function () {
                var cache = $cacheFactory.get('account');
                if(cache) {
                    cache.remove('list');
                }
                return true;
            },

            /*
             * add account list item
             * @return {Boole} 添加结果
             * */
            addItem : function (data) {
                var listCache = this.get();
                if(!listCache || !data || !data['uid']) {
                    return false;
                }
                for(var i = listCache.length - 1; i >= 0; i--) {
                    if(data['uid'] == listCache[i]['uid']) {
                        listCache.splice(i, 1, data);
                        return true;
                    }
                }
                listCache.push(data);
                return true;
            },

            /*
             * delete account list item
             * @return {Boole} 删除结果
             * */
            deleteItem : function (uid) {
                var listCache = this.get();
                if(!listCache || !uid) {
                    return false;
                }
                for(var i = listCache.length - 1; i >= 0; i--) {
                    if(uid == listCache[i]['uid']) {
                        listCache.splice(i, 1);
                        return true;
                    }
                }
                return false;
            }
        }
    }
]);
