
//将时间戳转换为时间,可以精确到秒
function formatTimeTwo(number, format) {
  var formateArr = ['Y', 'M', 'D', 'H', 'M', 'S'];
  var returnArr = [];
  var date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));
  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));
  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}
//将方法暴露出去
module.exports = {
    formatTimeTwo: formatTimeTwo
}
