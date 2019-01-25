/**
 * 内容页
 * User: wangtao
 * Date: 2019/1/16
 * Time: 20:43
 */

function main() {
    /*
    // demo_0，接收消息
    chrome.runtime.sendMessage(
        {'greeting': 'hello'}, function (response) {
            console.log(response);
        }
        );*/
    console.log('ob');
    /**/
    // demo_1 发送消息
    chrome.runtime.sendMessage(
        {'content': 'LongDD'},
        function (response) {
            console.log(response);
        });
}
main();

