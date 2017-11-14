import Now from '../src/index';

test('expect to return format1', () => {
  const arr = [
    ['dddd, MMMM Do YYYY, a h:mm:ss', '星期日, 二月 14日 2010, 下午 3:25:50'],
    ['ddd, Ah', '周日, 下午3'],
    ['M Mo MM MMMM MMM', '2 2月 02 二月 2月'],
    ['YYYY YY', '2010 10'],
    ['D Do DD', '14 14日 14'],
    ['h hh', '3 03'],
    ['H HH', '15 15'],
    ['m mm', '25 25'],
    ['s ss', '50 50'],
    ['a A', '下午 下午'],
    ['LTS', '15:25:50'],
    ['L', '2010年2月14日'],
    ['LL', '2010年2月14日'],
    ['LLL', '2010年2月14日下午3点25分'],
    ['LLLL', '2010年2月14日星期日下午3点25分'],
    ['l', '2010年2月14日'],
    ['ll', '2010年2月14日'],
    ['lll', '2010年2月14日 15:25'],
    ['llll', '2010年2月14日星期日 15:25'],
    ['d do dddd ddd dd', '0 0日 星期日 周日 日'],
    ['DDD DDDo DDDD', '45 45日 045'],
    ['w wo ww', '6 6周 06'],
    ['[这年的第] DDDo', '这年的第 45日']
  ];
  const now = new Now(2010, 1, 14, 15, 25, 50, 125);
  now.locale('zh-cn');
  for (let i = 0, len = arr.length; i < len; i++) {
    const output = now.format(arr[i][0]);
    console.log('output: ', output);
    expect(output).toBe(arr[i][1]);
  }
});
