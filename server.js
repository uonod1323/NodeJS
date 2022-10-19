const express = require('express'); //express 라이브러리를 첨부해주세요
const app = express(); //첨부한 express 라이브로 객체 생성
app.use(express.urlencoded({extended: true}));

const MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb+srv://uonod1323:qwer1234@hongodb.rtsccuj.mongodb.net/?retryWrites=true&w=majority',function(에러, client){
    app.listen(8989, function(){
        console.log('listen on 8989')
    });
});

//누군가가 /pet으로 방문을 하면 pet관련된 안내문을 띄워주자
//함수 안에 함수 (function(){}) = 콜백함수
app.get('/pet', function(요청, 응답){ //누군가 /pet으로 접속하면 펫용품 페이지 안내문을 띄워주라 (http://localhost:8080/pet)
    응답.send('펫용품 페이지 입니다'); //단어로 응담
});

app.get('/beauty', function(요청, 응답){
    응답.send('뷰티용품 페이지 입니다');
});

app.get('/write', function(요청, 응답){ //슬래시를 하나만 쓰면 홈페이지라 생각하셈
    응답.sendFile(__dirname + '/write.html'); //index.html 이라는 파일 불러오기
});

app.get('/', function(요청, 응답){ //슬래시를 하나만 쓰면 홈페이지라 생각하셈
    응답.sendFile(__dirname + '/index.html'); //index.html 이라는 파일 불러오기
});

//어떤 사람이 /add경로로 POST요청을 하면 ???를 해주세요
app.post('/add', function(요청, 응답){
    응답.send('전송완료');
    console.log(요청.body.title);
  });