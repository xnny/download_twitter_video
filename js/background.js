/**
 * 背景页
 * User: wangtao
 * Date: 2019/1/25
 * Time: 20:43
 */


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

function get_mp4_url(status_code, json_data) {
    // let config_id = __domain_key[domain];
    // let form_data = new FormData();
    // form_data.append('option', config_id);
    // form_data.append('content', json_data);
    /*let send_obj = {
        'method': 'GET',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        'body': form_data
    };*/
    /**
     :
     ::

     :
     x-twitter-client-language: zh-tw
     */

    let header = {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        'authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
        "x-csrf-token": '76b68f34a0b9956b639e5a4fe1ff54b2',
        'x-twitter-active-user': 'yes',
        'x-twitter-auth-type': 'OAuth2Session',
    };
    let api_url = 'https://api.twitter.com/2/timeline/conversation/' + status_code + '.json?include_profile_interstitial_type=1&include_blocking=1&include_blocked_by=1&include_followed_by=1&include_want_retweets=1&include_mute_edge=1&include_can_dm=1&include_can_media_tag=1&skip_status=1&cards_platform=Web-12&include_cards=1&include_composer_source=true&include_ext_alt_text=true&include_reply_count=1&tweet_mode=extended&include_entities=true&include_user_entities=true&include_ext_media_color=true&include_ext_media_availability=true&send_error_codes=true&count=20&ext=mediaStats%2ChighlightedLabel%2CcameraMoment'
    fetch(
        api_url,
        {
            method: 'get',
            headers: header
        }
    ).then(function (response) {
        response.json().then(function(json_data) {
            // JSON.globalObjects.tweets[1088636851110535168].extended_entities.media[0].video_info.variants[2].url
            let mp4_url = json_data.globalObjects.tweets[status_code].extended_entities.media[0].video_info.variants[2].url;
            chrome.downloads.download({
                url: mp4_url,
                conflictAction: 'uniquify',
                saveAs: false
            });
        });
        console.log(response.status)
    }).catch(error=> console.error('Error:', error));
}


function main() {
    let cookies_url = 'https://twitter.com/';
    console.log(cookies_url);
    chrome.cookies.getAll(
        {'url': cookies_url},
        function (cookies) {
            let json_str = generate_cookies_json(cookies);
            console.log('json_str', json_str);
            get_mp4_url('1088636851110535168', '');
            // save_cookies(domain, json_str);
        }
    );
    alert('xx');
}

/**
 * 监控点击事件
 */
chrome.browserAction.onClicked.addListener(main);
