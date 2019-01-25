/**
 * 背景页
 * User: wangtao
 * Date: 2019/1/16
 * Time: 20:43
 */
/*
// demo_0，发送消息
chrome.runtime.onMessage.addListener(function (request, sender, callback) {
    setTimeout(function () {
        callback('hi');
    }, 2000);
    return true;
});
*/
const __collection = ['twitter.com', 'www.instagram.com'];
// const __api_url = 'https://mprss.read.mx/sys/config';
const __api_url = 'http://127.0.0.1:8008/sys/config';
const __domain_key = {'twitter.com': 6, 'www.instagram.com': 5};

/**
 * 生成 JSON 文件
 * @param cookies_list
 * @returns {string}
 */
function generate_cookies_json(cookies_list) {
    let data_list = [];
    cookies_list.forEach(function (item) {
        let obj_name = item.name, new_item = {};
        new_item[obj_name] = item.value;
        data_list.push(new_item)
    });
    return JSON.stringify(data_list);
}

function save_cookies(domain, json_data) {
    let config_id = __domain_key[domain];
    let form_data = new FormData();
    form_data.append('option', config_id);
    form_data.append('content', json_data);
    let send_obj = {
        'method': 'POST',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'body': form_data
    };
    fetch(
        __api_url,
        send_obj
    ).then(
        response=> console.log('Success:', response)
    ).catch(error=> console.error('Error:', error));
}

// demo_1 接收消息
// chrome.runtime.addEventListener(
chrome.runtime.onMessage.addListener(
    function (request, sender, callback) {
    let msg = request.content;
    console.log('触发');
    chrome.tabs.query(
        { active: true },
        function (tabs) {
            let tab = tabs[0];
            let url_obj = new URL(tab.url);
            let domain = url_obj.hostname;
            let index_int = __collection.indexOf(domain);
            if (index_int < 0) {
                return false;
            }

            let cookies_url = 'https://' + domain + '/';
            console.log(cookies_url);
            chrome.cookies.getAll(
                {'url': cookies_url},
                function (cookies) {
                    let json_str = generate_cookies_json(cookies);
                    console.log('json_str', json_str);
                    save_cookies(domain, json_str);
                }
            );
        }
    );

    callback(msg);
    return true;
});
