var router = require('express').Router();

//메인 페이지. 게시물 CRUD 가 가능해야 하며, 조회가 가능해야 함.
 router.get('/main', function(요청, 응답){
    //post라는 곳에 저장된 모든 db데이터를 다 가지고 와서 콘솔에 출력
    db2.collection('oldgame').find().toArray(function(에러,결과){
      응답.render('gameboard/oldgame/main.ejs', {oldgame : 결과}); //결과라는 데이터가 oldgame라는 이름으로 main.ejs 로 전송한다
  }); 
});

//작성 페이지로 넘어가기
router.get('/write', function(요청, 응답){
  응답.render('gameboard/oldgame/write.ejs'); //결과라는 데이터가 oldgame라는 이름으로 main.ejs 로 전송한다
});

//어떤 사람이 /add경로로 POST요청을 하면 ???를 해주세요
  router.post('/addOldgame', function(요청, 응답){
        //사용자가 전달한 데이터를 서버에 저장
        console.log(저장할거);
        db.collection('post').insertOne( 저장할거 , function(에러, 결과){
            // db.collection('counter').updateOne({name : '게시물갯수'},{$inc : {totalPost:1}},function(에러, 결과){
            //     if(에러){return console.log(에러)}
            // })
        });
    });

 module.exports = router;