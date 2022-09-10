import { createClient } from 'oicq';
import { sendTimedJWZXMessage } from './plugins/pushJWZXNews.mjs';
import monitorGroupKeyword from './plugins/monitorGroupKeyword.mjs';
import './config/env-config.mjs';

const account = process.env.ACCOUNT;
const client = createClient(account);

client.on('system.online', () => {
  console.log('Logged in!');
});

client.on('message.private', () => {
  console.log('private');
});

client
  .on('system.login.qrcode', function (e) {
    //扫码后按回车登录
    process.stdin.once('data', () => {
      this.login();
    });
  })
  .login();

client.on('message.group', async (e) => {
  try {
    if (e.raw_message.startsWith('监听群消息')) {
      const [groupId, keyword] = e.raw_message.replace('监听群消息', '').split(':');
      e.reply(`获取命令成功，正在为${e.sender.nickname}实时监听“${keyword}”`, false);
      monitorGroupKeyword(Number(groupId), keyword, client);
    } 
  } catch (error) {
  }
});

scheduleTask(client);

/**
 * @description 定时任务
 */
function scheduleTask(client) {
  sendTimedJWZXMessage(client, process.env.CHONG_YOU_CHENG_GONG_REN_SHI_JIAO_LIU_QUN);
}
