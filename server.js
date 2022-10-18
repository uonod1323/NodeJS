const express = require('express'); //express 라이브러리를 첨부해주세요
const app = express(); //첨부한 express 라이브로 객체 생성

app.listen(8080, function(){
    console.log('listen on 8080')
});//서버 열기. listen(서버띄울 포트번호, 띄운 후 실행할 코드)

//누군가가 /pet으로 방문을 하면 pet관련된 안내문을 띄워주자

app.get('/pet', function(요청, 응답){ //누군가 /pet으로 접속하면 펫용품 페이지 안내문을 띄워주라 (http://localhost:8080/pet)
    응답.send('펫용품 페이지 입니다');
});