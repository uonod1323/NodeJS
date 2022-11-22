var router = require('express').Router();

 router.get('/oldgame', function(요청, 응답){
    //post라는 곳에 저장된 모든 db데이터를 다 가지고 와서 콘솔에 출력
    응답.render('gameboard/oldgame/main.ejs');
    });

 module.exports = router;