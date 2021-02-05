const socketio = require('socket.io')
const express = require('express')
const http = require('http')
const path = require('path')
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const Sequelize = require('sequelize')
const data = require('./data.json')
require('dotenv').config()
const {
    DB_URL,
    DB_USER,
    DB_PASS,
    DB_NAME,
    DB_PORT
} = process.env

const sequelize = new Sequelize(
    DB_NAME,
    DB_USER,
    DB_PASS, {
        host: DB_URL,
        port: DB_PORT,
        logging: console.log,
        maxConcurrentQueries: 100,
        dialect: 'mysql',
        dialectOptions: {
            ssl: 'Amazon RDS'
        },
        pool: { maxConnections: 5, maxIdleTime: 30 },
        language: 'en',
    }
)

const session = {}

io.on('connection', function(socket) {
            console.log(`User ${socket.handshake.address} Connected`)

            session[`${socket.id}`] = {
                id: 0,
                time: 0,
                score: 0,
                counter: 0,
                currentAnswer: '',
                askedQuestions: {}
            }

            socket.on('saveUserDetails', async(userDetails) => {
                        const check = await sequelize.query(`SELECT id FROM results WHERE phone = '${userDetails.phone}'`)
                        if (!check[0].length) {
                            //         connection.query(`INSERT INTO results VALUES(null,'${userDetails.name}','${userDetails.email}','${userDetails.phone}',${session[`${socket.id}`].score},${session[`${socket.id}`].time})`, function(err, rows, fields) {
                            //     if (err) throw err;
                            //     console.log(rows);
                            // });
                            const id = await sequelize.query(`INSERT INTO results VALUES(null,'${userDetails.name}','${userDetails.email}','${userDetails.phone}',${session[`${socket.id}`].score},${session[`${socket.id}`].time})`)
                    session[`${socket.id}`].id = id[0]
                    socket.emit('errorSaving', false)

                } else {
                    socket.emit('errorSaving', true)
                }
            })

            socket.on('askOpeningQuestion', () => {
                const questionPlusAnswers = {
                    question: "איזה סמל של חנוכה מופיע על גבי צנצנת המבצע",
                    A: "חנוכיה",
                    B: "סביבון",
                    C: "נר",
                    D: "סופגניה",
                }
                socket.emit('question', questionPlusAnswers)
            })

            socket.on('askQuestion', () => {
                let randomID = -1
                while (randomID == -1 || session[`${socket.id}`].askedQuestions[`${randomID}`]) {
                    randomID = Math.floor(Math.random() * 10) + 1
                }
                session[`${socket.id}`].askedQuestions[`${randomID}`] = true

                //***********pulling data from db***********/

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


                const info = data.find(r => r.id == randomID)
                session[`${socket.id}`].counter++
                    session[`${socket.id}`].currentAnswer = info.answer
                const questionPlusAnswers = {
                    question: info.question,
                    A: info.option_A,
                    B: info.option_B,
                    C: info.option_C,
                    D: info.option_D,
                }
                socket.emit('question', questionPlusAnswers)
            })

            socket.on('answer', answer => {
                        let isCorrectAnswer = false
                        session[`${socket.id}`].time = answer.currentTime
                        if (session[`${socket.id}`].currentAnswer === answer.checkboxValue) {
                            session[`${socket.id}`].score++
                                isCorrectAnswer = true
                        }
                        if (session[`${socket.id}`].counter == 10) {
                            socket.emit('score', session[`${socket.id}`].score)
                            sequelize.query(`UPDATE results SET score = ${session[`${socket.id}`].score}, time = ${session[`${socket.id}`].time} WHERE id = ${session[`${socket.id}`].id}`)
                            // sequelize.query(`INSERT INTO results VALUES('${socket.id}','aviad cohen','aviadcoh1@gmail.com',0546445077,${session[`${socket.id}`].score},${session[`${socket.id}`].time})`)
                        }
            })

    socket.on('firstAnswer', answer => {
        if (answer.checkboxValue === 'B') 
        socket.emit('correctedAnswer')
        else  
        socket.emit('wrongAnswer')
        console.log(session)
})

    socket.on('disconnect', function() {
        console.log('user disconnected')
        delete session[`${socket.id}`]
    })

});


app.use(express.static(path.join(__dirname, 'dist')))
app.use(express.static(path.join(__dirname, 'node_modules')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const port = process.env.PORT || 80

server.listen(port, () => console.log(`Server running on port: ${port}`))