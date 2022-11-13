const express = require('express'); //express 라이브러리를 첨부해주세요
const app = express(); //첨부한 express 라이브로 객체 생성
app.use(express.urlencoded({extended: true}));
const MongoClient = require('mongodb').MongoClient;
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
var db;

app.listen(8989, function(){
    console.log('listen on 8989')
});

//생각해 보니 전역으로 써도 아무 문제 없네...
MongoClient.connect('mongodb+srv://uonod1323:qwer1234@hongodb.rtsccuj.mongodb.net/todoapp?retryWrites=true&w=majority',function(에러, client){
    if(에러) {return console.log(에러)}
    db = client.db('todoapp'); //todoapp 이라는 db에 연결
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
    응답.sendFile(__dirname + '/write.html');
    db.collection('counter').findOne({name : '게시물갯수'}, function(에러, 결과){  //counter라는 collection에서 name이 '게시물갯수' 인 데이터를 찾아주세요
        console.log(결과.totalPost);
        var 총게시물갯수 = 결과.totalPost;

        //사용자가 전달한 데이터를 서버에 저장
        db.collection('post').insertOne( {_id : 총게시물갯수 + 1, 제목 : 요청.body.title, 날짜 : 요청.body.date} , function(에러, 결과){
            console.log('저장완료');
            db.collection('counter').updateOne({name : '게시물갯수'},{$inc : {totalPost:1}},function(에러, 결과){
                if(에러){return console.log(에러)}
            })
        });
    });
});

//list로 GET요청을 보내면 .ejs 파일 보내주기
//sendFile 과는 다릅니다
app.get('/list', function(요청, 응답){

    //post라는 곳에 저장된 모든 db데이터를 다 가지고 와서 콘솔에 출력
    db.collection('post').find().toArray(function(에러,결과){
        응답.render('list.ejs', {posts : 결과}); //결과라는 데이터가 posts라는 이름으로 list.ejs 안에 들어간다.
    }); 
    
    
});

app.delete('/delete', function(요청, 응답){
    console.log(요청.body)
    요청.body._id = parseInt(요청.body._id);
    //요청 body에 담겨온 게시물번호를 가진 글을 db에서 찾아서 삭제해주세요
    db.collection('post').deleteOne(요청.body, function(에러,결과){
        console.log('삭제완료');
        응답.status(200).send({message : '실패했습니다'}); //응답코드 200을 보내주세요~~~~ 200은 요청이 성공했다는뜻. 일단 무조건 성공판정 하려면 200쓰면됨
    });
});

//detail 로 접속하면 detail.ejs 보여줌
app.get('/detail/:id', function(요청,응답){
    db.collection('post').findOne({_id : parseInt(요청.params.id)}, function(에러, 결과){ 
        console.log(결과);
        응답.render('detail.ejs', { data : 결과 });
    });
});

app.get('/edit/:id', function(요청, 응답){
    db.collection('post').findOne({_id : parseInt(요청.params.id)}, function(에러, 결과){ 
        console.log(결과);
        응답.render('edit.ejs', {post : 결과});
    });
});

app.put('/edit', function(요청, 응답){
    db.collection('post').updateOne({_id : parseInt(요청.body.id) },{ $set : {제목: 요청.body.title, 날짜: 요청.body.date }}, function(에러, 결과){
        console.log(요청.body.id);
        console.log('수정완료');
        응답.redirect('/list') //응답이 없으면 페이지가 멈추기 때문에 필수.
    })
});