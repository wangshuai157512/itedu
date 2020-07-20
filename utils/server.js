// 是否为开发环境
const devUrl = "https://uec.chinaedu.net/wx";
// const devUrl = "http://localhost:3002/wx";
// const devUrl = "http://172.16.16.191:3002/wx";  // 兰志远
const lineUrl = "https://xxzx.chinaedu.net/wx"

const devImg = "https://uec.chinaedu.net";
// const devImg = "http://172.16.16.26:3002";
const lineImg = "https://xxzx.chinaedu.net"

const isDev = false  // 开发环境
const baseUrl = isDev? devUrl : lineUrl
const normalUrl = isDev? devImg : lineImg

const getCategoryList = baseUrl + '/api/it_course/getCategoryList'; // 获取课程分类
const getCourseList = baseUrl + '/api/it_course/getCourseList'; // 获取分类下的课程
const lookNum = baseUrl + '/api/it_course/lookNum'; // 课程观看人数
const getBannerList = baseUrl + '/api/it_course/getBannerList'; // 获取Banner
const showContent = baseUrl + '/api/it_login/iteduIsShowContent'; // 审核模式
const courseDetail = baseUrl + '/api/it_course/courseDetail'; // 课程详情
const shareCourse = baseUrl + '/api/it_course/shareCourse'; // 分享课程
const add = baseUrl + '/api/it_evaluation/add'; // 提交评价
const getEvaluation = baseUrl + '/api/it_evaluation/get'; // 查询评价
const getMycourseList = baseUrl + '/api/it_course/getMycourseList'; // 我的课程
// const setDays = baseUrl + '/api/it_count/setDays'; // 学习天数
const setDuration = baseUrl + '/api/it_count/setDuration'; // 学习时长
const getDuration = baseUrl + '/api/it_count/getUserInfo'; // 查询学习时长
const setMycourse = baseUrl + '/api/it_count/setMycourse'; // 学习课程节数
const authLogin = baseUrl + '/api/it_login/iteduLoginAuth'
const iteduLogin = baseUrl + '/api/it_login/iteduLogin'
const iteduAuthPhone = baseUrl + '/api/it_login/iteduAuthPhone' // 手机号

export default {
    normalUrl: normalUrl,
    getCategoryList: getCategoryList,
    getCourseList: getCourseList,
    lookNum: lookNum,
    getBannerList: getBannerList,
    showContent: showContent,
    authLogin: authLogin,
    iteduLogin: iteduLogin,
    iteduAuthPhone: iteduAuthPhone,
    courseDetail: courseDetail,
    shareCourse: shareCourse,
    add: add,
    getEvaluation: getEvaluation,
    getMycourseList: getMycourseList,
    // setDays: setDays,
    setDuration: setDuration,
    getDuration: getDuration,
    setMycourse: setMycourse
}

