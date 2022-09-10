import { getNewsList, getNewsContent } from '../services/jwzx.mjs';
import fs from 'fs-extra';
import { RecurrenceRule, scheduleJob } from 'node-schedule';

/**
 * @description 获取教务在线新闻的文本内容
 */
const getJWZXNewsText = async (id) => {
  try {
    const {
      data: { data }
    } = await getNewsContent(id);

    return `${data.title}
发布时间：${data.date.split('.')[0]}
----------------------------------
${data.content || '详见附件'}`;
  } catch (error) {
    console.log(error);
  }
};

/**
 * @description 定时发送教务在线最新消息，每隔十分钟轮询
 */
export const sendTimedJWZXMessage = (client, groupId) => {
  const rule = new RecurrenceRule();
  rule.minute = [0, 10, 20, 30, 40, 50];
 
  scheduleJob(rule, async () => {
    const cache = await fs.readJSON('src/data/cache/jwzxNew.json');

    /** @description 得到最新的消息 */
    const {
      data: { data }
    } = await getNewsList(1);
    const latest = [];
    let find = false;
    data.forEach((news) => {
      if (!find) {
        if (news.id === cache.id) {
          find = true;
        } else {
          latest.push(news);
        }
      }
    });

    console.log('❌ 暂无最新教务在线消息');
    if (latest.length === 0) return;

    /** @description 推送最新的消息 */
    for (const news of latest) {
      try {
        const text = await getJWZXNewsText(news.id);
        client.sendGroupMsg(groupId, text);
      } catch (error) {
        console.log(error);
      }
    }

    await fs.writeJson('src/data/cache/jwzxNew.json', { id: latest[0].id });
  });
};
