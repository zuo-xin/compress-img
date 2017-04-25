var util = {
    ajaxSubmit: function(param) {
        if (window.frameElement && window.frameElement.util && typeof window.frameElement.util.ajaxSubmit === 'function') {
            window.frameElement.util.ajaxSubmit(param);
        } else {
            var xhr = new XMLHttpRequest();
            if (!param.data) {
                param.data = {};
            }
            xhr.onreadystatechange = function() {
                var s;
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        try {
                            s = JSON.parse(xhr.responseText);
                        } catch (e) {}
                        if (s) {
                            if (s.ret == 200) {
                                if (typeof param.success === 'function') {
                                    param.success(s);
                                }
                            } else {
                                if (typeof param.error === 'function') {
                                    param.error(s);
                                } else if (!param.silent) {

                                }
                            }
                        } else {
                            if (typeof param.error === 'function') {
                                param.error(xhr);
                            }
                        }
                    } else {
                        if (typeof param.error === 'function') {
                            param.error(xhr);
                        } else if (!param.silent) {
                            util.hint('网络或服务器错误: ' + xhr.status);
                        }
                    }
                    if (typeof param.complete === 'function') {
                        param.complete(xhr);
                    }
                }
            };
            if (param.type === 'get') {
                xhr.open('get', param.url + '?' + util.buildQueryString(param.data), true);
                xhr.send();
            } else {
                xhr.open('post', param.url, true);
                if (param.data instanceof FormData) {
                    xhr.setRequestHeader('Content-Type', 'multipart/form-data');
                    xhr.send(util.buildQueryString(param.data));
                } else {
                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                    xhr.send(JSON.stringify(param.data));
                }
            }
        }
    },
    buildQueryString: function(data) {
        var n, s = '';
        for (n in data) {
            if (s) {
                s += '&';
            }
            s += data[n] === undefined ? encodeURIComponent(n) : encodeURIComponent(n) + '=' + encodeURIComponent(data[n]);
        }
        return s;
    },
    hint: function(text, t) {
        var hintCtn = document.getElementById('hint'),
            hintmo;
        document.querySelector('#hint>.text').innerHTML = text;
        if (hintmo) {
            clearTimeout(hintmo);
        } else {
            hintCtn.style.opacity = 1;
        }
        hintmo = setTimeout(function() {
            hintCtn.style.opacity = '';
            hintmo = undefined;
        }, t ? t : 2000);
    },

    getLocArgs: function() {
        var loc = location.hash.length > 0 ? location.hash : "";
        var index = loc.indexOf("?"),
            hash = "";
        if (index < 0) {
            hash = loc.length > 0 ? loc.substring(2) : "";
        } else {
            hash = loc.length > 0 ? loc.substring(2, index) : "";

        }
        var obj = {},
            items = hash.length ? hash.split("&") : [],
            item = null,
            name = null,
            value = null;
        for (var i = 0; i < items.length; i++) {
            item = items[i].split("=");
            name = decodeURIComponent(item[0]);
            value = decodeURIComponent(item[1]);
            if (name.length) {
                obj[name] = value
            }
        }
        return obj;
    },
    moneyFormat: function(money, precision, refix, n) {
        var prefix;
        if (isFinite(money)) {
            money = parseFloat(money);
        } else {
            money = 0;
        }
        if (money < 0) {
            money = money * -1;
            prefix = '-';
        }
        if (refix) {
            if (money >= 10000 * 10000) {
                money = toFloat(money / (10000 * 10000), precision) + '亿';
            } else if (money >= 10000) {
                money = toFloat(money / 10000, precision) + '万';
            } else {
                money = toFloat(money, precision);
            }
        } else {
            money = splitMoney(toFloat(money, precision), isFinite(n) ? n : 3) + '';
        }
        if (prefix && parseFloat(money) > 0) {
            money = prefix + money;
        }
        return money;

        function splitMoney(money, n) {
            var i, tmp = money.split('.');
            n = parseInt(n);
            if (tmp.length > 1) {
                money = '.' + tmp[1];
            } else {
                money = '';
            }
            for (i = 0; i < tmp[0].length; i += n) {
                if (i < tmp[0].length - n) {
                    money = ',' + tmp[0].substr(-n - i, n) + money;
                } else {
                    money = tmp[0].substr(0, tmp[0].length - i) + money;
                }
            }
            return money;
        }

        function toFloat(money, precision) {
            if (!isFinite(precision)) {
                if (money % 1) {
                    precision = 2;
                } else {
                    precision = 0;
                }
            }
            var i, p = Math.pow(10, precision);
            money = (Math.round(money * p) / p).toString();
            if (precision > 0) {
                i = money.split('.')[1];
                for (i = i ? i.length : 0; i < precision; i++) {
                    if (i === 0) {
                        money += '.';
                    }
                    money += '0';
                }
            }
            return money;
        }
    },
    formatTime: function(time) {
        if (time <= 0) return '未知';
        var t, y, m, d, h, i, s;
        t = new Date(time * 1000);
        y = t.getFullYear();
        m = t.getMonth() + 1;
        if (m < 10) m = '0' + m;
        d = t.getDate();
        if (d < 10) d = '0' + d;

        return y + '-' + m + '-' + d;
    },
    getScrollHeight: function(o) {
        return o.classList.contains('iosScrollFix') ? o.scrollHeight - 1 : o.scrollHeight;
    },
    logout:function(){
        var a = document.createElement("a");
        a.className = "logout";
        a.style.display="block"
        a.style.width="20px";
        a.style.height="20px";
        a.setAttribute("href","hqb://logout");
        document.querySelector("body").appendChild(a);
        a.click();
        document.querySelector("body").removeChild(a);
    },
    complete:function(){
        var a = document.createElement("a");
        a.className = "complete";
        a.style.display="block"
        a.style.width="20px";
        a.style.height="20px";
        a.setAttribute("href","hqb://complete");
        document.querySelector("body").appendChild(a);
        a.click();
        document.querySelector("body").removeChild(a);
    },
    activeZhimaUrl:function(url){
        var a = document.createElement("a");
        a.className = "activeZhimaUrl";
        a.style.display="block"
        a.style.width="20px";
        a.style.height="20px";
        a.setAttribute("href",url);
        document.querySelector("body").appendChild(a);
        a.click();
        document.querySelector("body").removeChild(a);
    }
}
