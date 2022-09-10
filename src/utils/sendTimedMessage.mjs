import { scheduleJob } from 'node-schedule';

const sendTimedMessage = (client, rule, groupId, message) => {
  scheduleJob(rule, () => {
    try {
      client.sendGroupMsg(groupId, message);
    } catch (error) {
      console.log(`发送定时消息失败：${error.message}`);
    }
  });
};

export default sendTimedMessage;
