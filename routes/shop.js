var router = require('express').Router();

// 로그인 체크하는 미들웨어 만들기
function 로그인했니(요청, 응답, next){
   if (요청.user){
       next() //그냥 통과시켜주세요
   }else{
       응답.send('로그인안하셨는데요?')
   }
}

//모든 라우트에 적용할 미들웨어를 괄호 안에 입력
//router.use(로그인했니)

//shirts 로 접근할 때만 로그인했니를 실행
router.use('/shirts', 로그인했니)

router.get('/shirts', function(요청, 응답){
    응답.send('셔츠 파는 페이지입니다.');
 });
 
 router.get('/pants', function(요청, 응답){
    응답.send('바지 파는 페이지입니다.');
 }); 

 module.exports = router;
