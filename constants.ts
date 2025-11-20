import { SchemaCategory } from './types';

export const STORAGE_KEY = 'weekly_tracker_v4_excel';

export const DATA_SCHEMA: SchemaCategory[] = [
  {
      category: "平台用户分布",
      fields: [
          { k: 'p_total', n: '总人数' }, // 图表1数据源
          { k: 'p_no_des', n: '非设计' },
          { k: 'p_des', n: '设计' }
      ]
  },
  {
      category: "美境首页",
      fields: [
          { k: 'hm_duv', n: '日均UV' },
          { k: 'hm_dpv', n: '日均PV' },
          { k: 'hm_wuv', n: '周UV' }
      ]
  },
  {
      category: "AI设计师",
      fields: [
          { k: 'aid_duv', n: '日均UV' },
          { k: 'aid_dpv', n: '日均PV' },
          { k: 'aid_wuv', n: '周UV' }
      ]
  },
  {
      category: "AI应用",
      fields: [
          { k: 'app_duv', n: '日均UV' },
          { k: 'app_dpv', n: '日均PV' },
          { k: 'app_wuv', n: '周UV' }
      ]
  },
  {
      category: "AI生成首页",
      fields: [
          { k: 'gen_duv', n: '日均UV' },
          { k: 'gen_dpv', n: '日均PV' },
          { k: 'gen_wuv', n: '周UV' }
      ]
  },
  {
      category: "AI实验室",
      fields: [
          { k: 'lab_duv', n: '日均UV' },
          { k: 'lab_dpv', n: '日均PV' },
          { k: 'lab_wuv', n: '周UV' }
      ]
  },
  {
      category: "AI工作流",
      fields: [
          { k: 'wf_duv', n: '日均UV' },
          { k: 'wf_dpv', n: '日均PV' },
          { k: 'wf_wuv', n: '周UV' }
      ]
  },
  {
      category: "访问/转化",
      fields: [
          { k: 'uv_unique', n: '去重访问人数' },
          { k: 'uv_workday', n: '工作日日均' },
          { k: 'user_active', n: '使用人数' }, // 图表2数据源
          { k: 'rate_conv', n: '转化率(%)' }
      ]
  },
  {
      category: "生成指令表现",
      fields: [
          { k: 'cmd_gen', n: '生成指令数' },
          { k: 'cmd_succ', n: '成功数' },
          { k: 'rate_succ', n: '成功率(%)' }
      ]
  },
  {
      category: "产出与采纳",
      fields: [
          { k: 'out_img', n: '生成图像张' },
          { k: 'out_vid', n: '视频数' },
          { k: 'out_dl', n: '下载数' },
          { k: 'rate_adopt', n: '采纳率(%)' }
      ]
  },
  {
      category: "总数汇总",
      fields: [
          { k: 'tot_cmd', n: '生成指令数' },
          { k: 'tot_cmd_s', n: '成功指令' },
          { k: 'tot_img_s', n: '图像成功' },
          { k: 'tot_vid_s', n: '视频成功' },
          { k: 'tot_dl', n: '下载' },
          { k: 'tot_rate', n: '采纳率(%)' }
      ]
  },
  {
      category: "做袋鼠项目",
      fields: [
          { k: 'kds_wuv', n: '周访问UV' },
          { k: 'kds_use', n: '周使用UV' },
          { k: 'kds_cmd', n: '生成指令数' },
          { k: 'kds_succ', n: '成功指令' },
          { k: 'kds_sub', n: '提交审核' }
      ]
  }
];