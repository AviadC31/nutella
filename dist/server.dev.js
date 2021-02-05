"use strict";

var socketio = require('socket.io');

var express = require('express');

var http = require('http');

var path = require('path');

var app = express();
var server = http.createServer(app);
var io = socketio(server);

var Sequelize = require('sequelize');

var data = require('./data.json');

require('dotenv').config();

var _process$env = process.env,
    DB_URL = _process$env.DB_URL,
    DB_USER = _process$env.DB_USER,
    DB_PASS = _process$env.DB_PASS,
    DB_NAME = _process$env.DB_NAME,
    DB_PORT = _process$env.DB_PORT;
var sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_URL,
  port: DB_PORT,
  logging: console.log,
  maxConcurrentQueries: 100,
  dialect: 'mysql',
  dialectOptions: {
    ssl: 'Amazon RDS'
  },
  pool: {
    maxConnections: 5,
    maxIdleTime: 30
  },
  language: 'en'
});
var session = {};
io.on('connection', function (socket) {
  console.log("User ".concat(socket.handshake.address, " Connected"));
  session["".concat(socket.id)] = {
    id: 0,
    time: 0,
    score: 0,
    counter: 0,
    currentAnswer: '',
    askedQuestions: {}
  };
  socket.on('saveUserDetails', function _callee(userDetails) {
    var check, id;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(sequelize.query("SELECT id FROM results WHERE phone = '".concat(userDetails.phone, "'")));

          case 2:
            check = _context.sent;

            if (check[0].length) {
              _context.next = 10;
              break;
            }

            _context.next = 6;
            return regeneratorRuntime.awrap(sequelize.query("INSERT INTO results VALUES(null,'".concat(userDetails.name, "','").concat(userDetails.email, "','").concat(userDetails.phone, "',").concat(session["".concat(socket.id)].score, ",").concat(session["".concat(socket.id)].time, ")")));

          case 6:
            id = _context.sent;
            session["".concat(socket.id)].id = id[0];
            _context.next = 11;
            break;

          case 10:
            socket.emit('errorSaving');

          case 11:
          case "end":
            return _context.stop();
        }
      }
    });
  });
  socket.on('askOpeningQuestion', function () {
    var questionPlusAnswers = {
      question: "?איזה סמל של חנוכה מופיע על גבי צנצנת המבצע",
      A: "חנוכיה",
      B: "סביבון",
      C: "נר",
      D: "סופגניה"
    };
    socket.emit('question', questionPlusAnswers);
  });
  socket.on('askQuestion', function () {
    var randomID = -1;

    while (randomID == -1 || session["".concat(socket.id)].askedQuestions["".concat(randomID)]) {
      randomID = Math.floor(Math.random() * 10) + 1;
    }

    session["".concat(socket.id)].askedQuestions["".concat(randomID)] = true; //***********pulling data from db***********/
    // const question = sequelize.query(`SELECT * FROM questions WHERE id = ${randomID}`)
    // question.then(r => {
    //     session[`${socket.id}`].counter++
    //         session[`${socket.id}`].currentAnswer = r[0][0].answer
    //     const questionPlusAnswers = {
    //         question: r[0][0].question,
    //         A: r[0][0].option_A,
    //         B: r[0][0].option_B,
    //         C: r[0][0].option_C,
    //         D: r[0][0].option_D,
    //     }
    //     socket.emit('question', questionPlusAnswers)
    // })
    //***********pulling data from db - end***********/

    var info = data.find(function (r) {
      return r.id == randomID;
    });
    session["".concat(socket.id)].counter++;
    session["".concat(socket.id)].currentAnswer = info.answer;
    var questionPlusAnswers = {
      question: info.question,
      A: info.option_A,
      B: info.option_B,
      C: info.option_C,
      D: info.option_D
    };
    socket.emit('question', questionPlusAnswers);
  });
  socket.on('answer', function (answer) {
    var isCorrectAnswer = false;
    session["".concat(socket.id)].time = answer.currentTime;

    if (session["".concat(socket.id)].currentAnswer === answer.checkboxValue) {
      session["".concat(socket.id)].score++;
      isCorrectAnswer = true;
    }

    if (session["".concat(socket.id)].counter == 10) {
      socket.emit('score', session["".concat(socket.id)].score);
      sequelize.query("UPDATE results SET score = ".concat(session["".concat(socket.id)].score, ", time = ").concat(session["".concat(socket.id)].time, " WHERE id = ").concat(session["".concat(socket.id)].id)); // sequelize.query(`INSERT INTO results VALUES('${socket.id}','aviad cohen','aviadcoh1@gmail.com',0546445077,${session[`${socket.id}`].score},${session[`${socket.id}`].time})`)
    }
  });
  socket.on('firstAnswer', function (answer) {
    if (answer.checkboxValue === 'B') socket.emit('correctedAnswer');else socket.emit('wrongAnswer');
    console.log(session);
  });
  socket.on('disconnect', function () {
    console.log('user disconnected');
    delete session["".concat(socket.id)];
  });
});
app.use(express["static"](path.join(__dirname, 'dist')));
app.use(express["static"](path.join(__dirname, 'node_modules')));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
var port = process.env.PORT || 80;
server.listen(port, function () {
  return console.log("Server running on port: ".concat(port));
});