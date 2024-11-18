const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const users = [
    {
        user_id: "test",
        user_password: "1234",
        user_name: "테스트 유저",
        user_info: "테스트 유저입니다",
    },
];

const app = express();

app.use(
    cors({
        origin: ["http://127.0.0.1:5501", "http://localhost:3000"],
        methods: ["OPTIONS", "POST", "GET", "DELETE"],
        credentials: true,
    })
);

app.use(cookieParser());
app.use(express.json());

const secretKey = "ozcodingschool";

// 클라이언트에서 post 요청을 받은 경우
app.post("/", (req, res) => {
    const {userId, userPassword} = req.body;
    const userInfo = users.find(el => el.user_id === userId && el.user_password === userPassword);
    // 유저정보가 없는 경우
    if (!userInfo) {
        res.status(401).send("로그인 실패");
    } else {
        // 1. 유저정보가 있는 경우 accessToken을 발급하는 로직을 작성하세요.(sign)
        const accessToken = jwt.sign({userId: userInfo.user_id}, secretKey, {expiresIn: "10m"});
        // 2. 응답으로 accessToken을 클라이언트로 전송하세요. (res.send 사용)
        res.send(accessToken);
    }
});

// 클라이언트에서 get 요청을 받은 경우
app.get("/", (req, res) => {
    try {
        // Authorization 헤더 존재 여부 확인
        const authHeader = req.headers["authorization"];
        console.log("Authorization Header:", authHeader);
        if (!authHeader) {
            return res.status(401).send("토큰이 제공되지 않았습니다???.");
        }

        // 토큰 추출 및 검증
        const token = authHeader.split(" ")[1];
        console.log("Extracted Token:", token);
        const payload = jwt.verify(token, secretKey);

        // 유저 정보 전송
        const userInfo = users.find(el => el.user_id === payload.userId);
        res.send(userInfo);
    } catch (error) {
        res.status(401).send("유효하지 않은 토큰입니다.");
    }
});

app.listen(3000, () => console.log("서버 실행!"));
