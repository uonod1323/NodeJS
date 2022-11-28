const express = require('express'); //express 라이브러리를 첨부해주세요
const app = express(); //첨부한 express 라이브로 객체 생성
app.use(express.urlencoded({extended: true}));
const MongoClient = require('mongodb').MongoClient;
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
require('dotenv').config();
var db;


//생각해 보니 전역으로 써도 아무 문제 없네...
MongoClient.connect(process.env.DB_URL,function(에러, client){
    if(에러) {return console.log(에러)}
    db = client.db('todoapp'); //todoapp 이라는 db에 연결
    db2 = client.db('gameBoard'); //gameBoard라는 db에 연결
    app.listen(process.env.PORT, function(){
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
    응답.render('write.ejs');
});

app.get('/', function(요청, 응답){ //슬래시를 하나만 쓰면 홈페이지라 생각하셈
    응답.sendFile(__dirname + '/index.html'); //index.html 이라는 파일 불러오기
});


//list로 GET요청을 보내면 .ejs 파일 보내주기
//sendFile 과는 다릅니다
app.get('/list', function(요청, 응답){

    //post라는 곳에 저장된 모든 db데이터를 다 가지고 와서 콘솔에 출력
    db.collection('post').find().toArray(function(에러,결과){
        응답.render('list.ejs', {posts : 결과}); //결과라는 데이터가 posts라는 이름으로 list.ejs 로 전송한다
    }); 
});

//한글 최적화된 Search Inedx를 이용한 검색방법
app.get('/search', (요청, 응답) => {
    var 검색조건 = [
        {
            $search: {
              index: 'titleSearch',
              text: {
                query: 요청.query.value,
                path: '제목'
              }
            }
          }
    ]
    db.collection('post').aggregate(검색조건).toArray((에러,결과)=>{   //toArray가 아니면 이동할 페이지로 데이터 전달이 잘 안되네...
        console.log(결과);
        응답.render('search.ejs', {posts : 결과}); //결과라는 데이터를 posts라는 이름으로 search.ejs 로 전송한다
    })
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

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');


app.use(session({secret : '비밀코드', resave : true, saveUninitialized: false})); //app.use(미들웨어)
app.use(passport.initialize());
app.use(passport.session());

app.get('/login', function(요청,응답){
    응답.render('login.ejs');
});

app.post('/login', passport.authenticate('local', {
    failureRedirect : '/fail'
}), function(요청,응답){
    //로그인하고 실행되는 기능을 이곳에 입력
    응답.redirect('/') // 회원인증 성공하면 홈으로 redirect
});

//로그인했니 라는 이름으로 사용자가 만든 미들웨어를 집어넣었습니다.
//mypage로 접속할 때 마다 로그인했니 라는 함수를 실행하고 응답을 해 줍니다.
app.get('/mypage', 로그인했니, function(요청,응답){
    console.log(요청.user); // mypage가 실행될 때 user의 id와 pw 데이터를 받아옴
    응답.render('mypage.ejs', {사용자 : 요청.user});
});

// 로그인 체크하는 미들웨어 만들기
function 로그인했니(요청, 응답, next){
    if (요청.user){
        next() //그냥 통과시켜주세요
    }else{
        응답.send('로그인안하셨는데요?')
    }
}




//아이디 비번 인증하는 세부 코드
passport.use(new LocalStrategy({
    usernameField: 'id',
    passwordField: 'pw',
    session: true,
    passReqToCallback: false,
  }, function (입력한아이디, 입력한비번, done) {
    //console.log(입력한아이디, 입력한비번);
    db.collection('login').findOne({ id: 입력한아이디 }, function (에러, 결과) {
      if (에러) return done(에러)
  
      if (!결과) return done(null, false, { message: '존재하지않는 아이디요' })
      if (입력한비번 == 결과.pw) {
        return done(null, 결과)
      } else { 
        return done(null, false, { message: '비번틀렸어요' })
      }
    })
  }));

  //세션을 저장시키는 코드(로그인 성공시 발동)
  passport.serializeUser(function (user, done) {
    done(null, user.id) //id를 이용해서 세션을 저장시키는 코드
  });
  
  //이 세션 데이터를 가진 사람을 DB에서 찾아주세요(마이페이지 접속시 발동)
  //deserializeUser() 로그인한 유저의 세션아이디를 바탕으로 개인정보를 DB에서 찾는 역할
  passport.deserializeUser(function (아이디, done) {
    //디비에서 위에 있는 user.id로 유저를 찾은 뒤에 유저 정보를
    db.collection('login').findOne({id : 아이디}, function(에러, 결과){
        done(null, 결과) //마이페이지 접속시 DB에서 {id:어쩌구} 인 것을 찾아서 그 결과를 보내줌.
    })
  }); 

  app.post('/register', function(요청,응답){
    db.collection('login').insertOne({ id : 요청.body.id, pw : 요청.body.pw }, function(에러,결과){
        응답.redirect('/');
    })
  })

  //어떤 사람이 /add경로로 POST요청을 하면 ???를 해주세요
app.post('/add', function(요청, 응답){
    응답.render('write.ejs');
    db.collection('counter').findOne({name : '게시물갯수'}, function(에러, 결과){  //counter라는 collection에서 name이 '게시물갯수' 인 데이터를 찾아주세요
        console.log(결과.totalPost);
        var 총게시물갯수 = 결과.totalPost;

        var 저장할거 = {_id : 총게시물갯수 + 1, 제목 : 요청.body.title, 날짜 : 요청.body.date, 작성자 : 요청.user._id}

        //사용자가 전달한 데이터를 서버에 저장
        db.collection('post').insertOne( 저장할거 , function(에러, 결과){
            console.log('저장완료');
            db.collection('counter').updateOne({name : '게시물갯수'},{$inc : {totalPost:1}},function(에러, 결과){
                if(에러){return console.log(에러)}
            })
        });
    });
});

app.delete('/delete', function(요청, 응답){
    console.log(요청.body)
    요청.body._id = parseInt(요청.body._id);

    // _id와 작성자 둘 다 만족하는 경우에만 삭제할 데이터로 선정됨.
    var 삭제할데이터 = { _id : 요청.body._id, 작성자 : 요청.user._id }

    //요청 body에 담겨온 게시물번호를 가진 글을 db에서 찾아서 삭제해주세요
    db.collection('post').deleteOne(삭제할데이터, function(에러,결과){
        console.log('삭제완료');
        if (결과) {console.log(결과)}
        응답.status(200).send({message : '실패했습니다'}); //응답코드 200을 보내주세요~~~~ 200은 요청이 성공했다는뜻. 일단 무조건 성공판정 하려면 200쓰면됨
    });
});

//app.use는 미들웨어를 사용하고 싶을때 씁니다
// 슬래시 경로로 접속한 사람들은 전부 require 미들웨어(라우터)가 적용됨
//shop.js 파일 첨부하기 (./ 는 server.js가 위치한 현재경로라는 뜻이다)
app.use('/shop', require('./routes/shop.js'))
app.use('/board/sub', require('./routes/board.js'))
app.use('/board/sub/oldgame', require('./routes/gameboard/oldgame.js'))