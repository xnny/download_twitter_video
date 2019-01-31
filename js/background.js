/**
 * 背景页
 * User: wangtao
 * Date: 2019/1/25
 * Time: 20:43
 */

function get_tweet_status(pathname) {
    let path_arr = pathname.split('status/');
    if (path_arr.length < 2) {
        return '';
    }
    return path_arr.pop();
    alert(path_arr);
}


/**
 * 生成 JSON 文件
 * @param cookies_list
 * @returns {string}
 */
function generate_cookies(cookies_list) {
    let cookies_obj = {};
    cookies_list.forEach(function (item) {
        let obj_name = item.name;
        cookies_obj[obj_name] = item.value;
    });
    return cookies_obj;
}

function down_load(mp4_url) {
    chrome.downloads.download({
        url: mp4_url,
        conflictAction: 'uniquify',
        saveAs: false
    });
}

/**
 * 获得
 * @param status_code
 * @param cookies
 */
function get_mp4_url(status_code, cookies) {

    let header = {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        'authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
        "x-csrf-token": cookies.ct0,
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
            let mp4_arr = json_data.globalObjects.tweets[status_code].extended_entities.media[0].video_info.variants;
            mp4_arr = mp4_arr.reverse();
            let downloaded = false;
            mp4_arr.forEach(function (item) {
                let content_type = item.content_type;
                if (content_type === 'video/mp4') {
                    let mp4_url = item.url;
                    if (downloaded === false) {
                        down_load(mp4_url);
                    }
                    downloaded = true;

                    return false;
                }
            });
            // console.log(mp4_arr);
            return false;

            // let mp4_url = json_data.globalObjects.tweets[status_code].extended_entities.media[0].video_info.variants[2].url;

        });
        console.log(response.status)
    }).catch(error=> console.error('Error:', error));
}


function main() {
    let cookies_url = 'https://twitter.com/';
    chrome.tabs.query(
        { active: true },
        function (tabs) {
            let tab = tabs[0];
            let url_obj = new URL(tab.url);
            let pathname = url_obj.pathname;
            let domain = url_obj.hostname;
            let tweet_domain_list = ['mobile.twitter.com', 'twitter.com', ];
            let index_int = tweet_domain_list.indexOf(domain);
            if (index_int < 0) {
                alert('只支持 Twitter 官网');
                return false;
            }

            let tweet_code = get_tweet_status(pathname);
            if (tweet_code === '') {
                alert('找不到 tweet 信息');
                return false;
            }
            chrome.cookies.getAll(
                {'url': cookies_url},
                function (cookies) {
                    let cookies_obj = generate_cookies(cookies);
                    get_mp4_url(tweet_code, cookies_obj);
                }
            );
        }
    );
    /**/
    // alert('xx');
}

/**
 * 监控点击事件
 */
chrome.browserAction.onClicked.addListener(main);
