## 설치

npm init
npm install express openai cors

## app.js 생성

const express = require('express')
const app = express()
const port = 80

app.get('/', (req, res) => {
res.send('Hello World!')
})

app.listen(port, () => {
console.log(`Example app listening on port ${port}`)
})

## 실행

node app.js
