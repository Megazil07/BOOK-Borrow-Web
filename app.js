const express = require("express");
const path = require("path");
const con = require('./config/db');
const bcrypt = require('bcrypt');
const session = require('express-session');
const memoryStore = require('memorystore')(session);
const app = express();


// config
// set "public" folder to static folder
app.use("/Public", express.static(path.join(__dirname, "Public")));
// allow json exchange
app.use(express.json());
// allow URLencoded exchange
app.use(express.urlencoded({extended: true}));

// session
app.use(session({
    cookie: {maxAge: 24*60*60*1000},//1 day in millisecond
    secret: 'todayisgoodday',
    resave: false,
    saveUninitialized: true,
    store: new memoryStore({
        checkPeriod: 24*60*60*1000
    })
}));


// generate hashed password
// staff: username : Matthew.www
// localhost:3333/password/Matthew2345
// staff: username : Emily_lovemom
//localhost:3333/password/Emily3456
// lecturer: username : Daniel.loveduggy
//localhost:3333/password/Daniel8910
// lecturer: username : Olivia_cutetycat
// localhost:3333/password/Olivia6789
// student: username: James_An
// localhost:3333/password/James1234
// student: username: Emmazaza
//localhost:3333/password/Emma5678
app.get('/password/:raw', function(req, res){
    const raw = req.params.raw;
    bcrypt.hash(raw, 10, function(err, hash){
        if(err){
            console.error(err);
            res.status(500).send('Server error');
        }else{
            console.log(hash.length);
            res.status(200).send(hash);
        }
    });
});

// login
app.post("/login", function(req, res){
    // get username and password
    const username = req.body.username;
    const raw_password = req.body.password;
    // console.log(username,password);
    const sql = "SELECT id, role, password, fullname FROM user WHERE username=?";
    con.query(sql, [username], function(err, results){
        if(err){
            console.error(err);
            res.status(500).send('Server error');
        } else {
            if(results.length === 0){
                res.status(401).send('login fail: username is wrong');
            } else {
                const hash = results[0].password;
                const fullname = results[0].fullname; 
                bcrypt.compare(raw_password, hash, function(err, same){
                    if(err){
                        res.status(500).send('Server error');
                    } else if(same){
                        req.session.userID = results[0].id;
                        req.session.username = username;
                        req.session.role = results[0].role;
                        req.session.fullname = fullname;
                        // res.redirect('/View/Booklist-staff/index.html')

                        // let redirectPath;
                        switch(results[0].role){
                            // staff
                            case 1: 
                                res.status(200).send('/welcome-staff');
                                break;
                            case 2:
                                res.status(200).send('/welcome-lecture');
                                break;
                            case 3:
                                res.status(200).send('/welcome-user');
                                break;
                        }
                    } else {
                        res.status(401).send('login fail: wrong password');
                    }
                });
            }
        }
    });
});


// register
app.post("/register", function(req, res) {
    // get studentid, username, password, fullname, email
    const { studentid, username, password, fullname, email } = req.body;

    // Hash the password
    bcrypt.hash(password, 10, function(err, hashedPassword) {
        if (err) {
            console.error(err);
            return res.status(500).send('Server error: ' + err.message);
        }

        const sql = "INSERT INTO `user` (`id`, `username`, `password`, `fullname`, `email`, `role`) VALUES (?, ?, ?, ?, ?, '3');";

        con.query(sql, [studentid, username, hashedPassword, fullname, email], function(err, results) {
            if (err) {
                console.error(err);
                return res.status(500).send('Server error: ' + err.message);
            } else {
                if (results.affectedRows > 0) {
                    res.status(200).send('/login');
                } else {
                    res.status(401).send('Registration failed: No rows affected');
                }
            }
        });
    });
});

// check the request status
app.post("/requeststatus",function(req, res){
   // const userid = req.body.userid;
   const sql = "SELECT request.no, booklist.name, booklist.img, request.borrowing_date, request.returned_date, request.status FROM request JOIN booklist ON request.book_id = booklist.book_id WHERE request.student_id = ? AND (request.status = 1 OR request.status = 2);";
   // con.query(sql, [userid], function(err, results){
   con.query(sql, [req.session.userID], function(err, results){
       if(err){
           console.error(err);
           res.status(500).send('Server error:'+ err.message);
       }else{
           if(results.length === 0){
               // no request list
            //    res.status(200).send('You do not have any request');
            res.status(200).json([]);
           }else{
               //have request lists
               // send the data from database
               res.status(200).json(results);
               console.log(results);
            }
           }
       });
});

// ============= dashboard ==============
app.post("/dashboardstaff", function (req, res) {

    const sql = "SELECT `book_id`, `status` FROM `project`.`booklist`";

    con.query(sql, [req.session.userID], function (err, results) {
        if (err) {
            console.error(err);
            res.status(500).send('Server error:' + err.message);
        } else {
            if (results.length === 0) {

                res.status(200).json([]);
            } else {
                // send the data from database
                res.status(200).json(results);
                console.log(results);
            }
        }
    });
});

app.post("/dashboardlect", function (req, res) {

    const sql = "SELECT `book_id`, `status` FROM `project`.`booklist`";

    con.query(sql, [req.session.userID], function (err, results) {
        if (err) {
            console.error(err);
            res.status(500).send('Server error:' + err.message);
        } else {
            if (results.length === 0) {

                res.status(200).json([]);
            } else {
                // send the data from database
                res.status(200).json(results);
                console.log(results);
            }
        }
    });
});

// ---------------------------show html page-------------------------------------
// login page
// localhost:3333/login
app.get('/login', (req, res) =>{
    if(req.session.userID){
        res.redirect('/welcome');
    }else{
        res.sendFile(path.join(__dirname, '/View/login-logout-register/login.html'));
    }
});

// register page
app.get('/register', (_req, res) =>{
    res.sendFile(path.join(__dirname, '/View/login-logout-register/register.html'));
});

//get user info
app.get('/user', function(req,res){
    res.json({"userID":req.session.userID,"username":req.session.username,"role":req.session.role,"fullname":req.session.fullname});
});

// logout
app.get('/logout', function(req,res){
    req.session.destroy(function(err){
        if(err){
            console.error(err.message);
            res.status(500).send('Cannot clear session');
        }else{
            // redirect to login page
            res.redirect('/login');
        }
    })
});

// booklist-staff
app.get('/Booklist-staff', (_req, res) =>{
    res.sendFile(path.join(__dirname, '/View/Booklist-staff/index.html'));
});
// booklist-lecturer
app.get('/Booklist-lecturer', (_req, res) =>{
    res.sendFile(path.join(__dirname, '/View/Booklist-lecturer/index.html'));
});
// booklist-student
app.get('/Booklist-student', (_req, res) =>{
    res.sendFile(path.join(__dirname, '/View/Booklist-user/index.html'));
});

// request user status page
app.get('/requeststatus', (_req, res) =>{
    res.sendFile(path.join(__dirname, '/View/Request status/RQSTUSER.html'));
});
// welcome-lecture
app.get('/welcome-lecture', (_req, res) =>{
    res.sendFile(path.join(__dirname, '/View/welcome/welcome-lecture.html'));
});
// welcome-staff
app.get('/welcome-staff', (_req, res) =>{
    res.sendFile(path.join(__dirname, '/View/welcome/welcome-staff.html'));
});
// welcome-user
app.get('/welcome-user', (_req, res) =>{
    res.sendFile(path.join(__dirname, '/View/welcome/welcome-user.html'));
});


app.post("/requestlect", function (req, res) {
    const lecturer_id = req.session.userID; // เรียกใช้ ID ของ lecturer จาก session

    const sql = "SELECT request.no, booklist.name, booklist.img, request.borrowing_date, request.returned_date, request.status FROM request JOIN booklist ON request.book_id = booklist.book_id WHERE request.status = 1;";

    con.query(sql, [lecturer_id], function(err, results) {
        if (err) {
            console.error(err);
            res.status(500).send('Server error:' + err.message);
        } else {
            res.status(200).json(results); // ส่งผลลัพธ์ที่ได้กลับเป็น JSON ให้กับ client
        }
    });
});

app.post("/updateRequest", function (req, res) {
    const { requestNo, action } = req.body; // รับ requestNo และ action จาก body ของ request
    const lecturerID = req.session.userID; // เรียกใช้ ID ของผู้ใช้จาก session ที่ล็อคอินเข้ามา

    let status;
    let bookListStatus;

    if (action === 'approve') {
        status = 2; // กำหนดเป็นสถานะที่ต้องการเปลี่ยนเป็น 'approve' (เช่น 2)
        bookListStatus = 3; // กำหนดเป็นสถานะใหม่ใน booklist เมื่อคำขอถูกอนุมัติ
    } else if (action === 'disapprove') {
        status = 4; // กำหนดเป็นสถานะที่ต้องการเปลี่ยนเป็น 'disapprove' (เช่น 4)
        bookListStatus = 1; // กำหนดเป็นสถานะใหม่ใน booklist เมื่อคำขอไม่ได้รับการอนุมัติ
    }

    const updateRequestSQL = "UPDATE request SET status = ?, lecturer_id = ? WHERE no = ?;"; // SQL query สำหรับอับเดตข้อมูลในตาราง request
    con.query(updateRequestSQL, [status, lecturerID, requestNo], function(err, result) { // ส่งค่า status, lecturerID, และ requestNo เพื่ออับเดตข้อมูล
        if (err) {
            console.error(err);
            res.status(500).send('Server error:' + err.message);
        } else {
            // เมื่ออัปเดต request เสร็จสิ้น ตรวจสอบสถานะเพื่ออัปเดตข้อมูลในตาราง booklist
            if (status === 2) {
                // ถ้าสถานะของคำขอเป็น 2 (approve) อัปเดตสถานะในตาราง booklist เป็น 3
                const updateBookListSQL = "UPDATE booklist b JOIN request r ON b.book_id = r.book_id SET b.status = ? WHERE r.no = ?;";
                con.query(updateBookListSQL, [bookListStatus, requestNo], function(err, bookListResult) {
                    if (err) {
                        console.error(err);
                        res.status(500).send('Server error:' + err.message);
                    } else {
                        res.status(200).send('Request updated successfully');
                    }
                });
            } else if (status === 4) {
                // ถ้าสถานะของคำขอเป็น 4 (disapprove) อัปเดตสถานะในตาราง booklist เป็น 1
                const updateBookListSQL = "UPDATE booklist b JOIN request r ON b.book_id = r.book_id SET b.status = ? WHERE r.no = ?;";
                con.query(updateBookListSQL, [bookListStatus, requestNo], function(err, bookListResult) {
                    if (err) {
                        console.error(err);
                        res.status(500).send('Server error:' + err.message);
                    } else {
                        res.status(200).send('Request updated successfully');
                    }
                });
            } else {
                res.status(200).send('Request updated successfully');
            }
        }
    });
});


// History user
app.post("/historyuser", function (req, res) {
    const userID = req.session.userID; // รับ userID จาก session
    const sql = "SELECT booklist.name, request.borrowing_date, request.returned_date, request.status , request.lecturer_id , request.staff_id FROM request JOIN booklist ON request.book_id = booklist.book_id WHERE request.student_id = ? AND (request.status = 3 or request.status = 4);";
    con.query(sql, [userID], function (err, results) {
        if (err) {
            console.error(err);
            res.status(500).send('Server error:' + err.message);
        } else {
            if (results.length === 0) {
                res.status(200).json([]); // ไม่มีรายการร้องขอ
            } else {
                res.status(200).json(results); // มีรายการร้องขอ
                console.log(results);
            }
        }
    });
});
app.post("/historylender", function (req, res) {
    const userID = req.session.userID; // รับ userID จาก session
    const sql = "SELECT request.book_id, booklist.name,request.staff_id, request.borrowing_date, request.returned_date, request.status, request.student_id, request.lecturer_id FROM request JOIN booklist ON request.book_id = booklist.book_id WHERE (request.status = 3 OR request.status = 4);";
    con.query(sql, function (err, results) {
        if (err) {
            console.error(err);
            res.status(500).send('Server error:' + err.message);
        } else {
            if (results.length === 0) {
                res.status(200).json([]); // ไม่มีรายการร้องขอ
            } else {
                res.status(200).json(results); // มีรายการร้องขอ
                console.log(results);
            }
        }
    });
});

app.post("/historystaff", function (req, res) {
    const userID = req.session.userID; // รับ userID จาก session
    const sql = "SELECT request.book_id,booklist.name,request.staff_id,request.borrowing_date,request.returned_date, request.status ,request.student_id ,request.lecturer_id FROM request JOIN booklist ON request.book_id = booklist.book_id WHERE (request.status = 3 or request.status = 4);";
    con.query(sql, [userID], function (err, results) {
        if (err) {
            console.error(err);
            res.status(500).send('Server error:' + err.message);
        } else {
            if (results.length === 0) {
                res.status(200).json([]); // ไม่มีรายการร้องขอ
            } else {
                res.status(200).json(results); // มีรายการร้องขอ
                console.log(results);
            }
        }
    });
});

// request lecturer status page
app.get('/requestlect', (_req, res) => {
    res.sendFile(path.join(__dirname, '/View/Request status/RQSTLEC.html'));
});

// welcome page
app.get('/welcome', (_req, res) => {
    res.sendFile(path.join(__dirname, '/View/welcome.html'));
});
// History-user page
app.get('/historyuser', (_req, res) => {
    res.sendFile(path.join(__dirname, '/View/History/historyuser.html'));
});
// History-lectere page
app.get('/historylender', (_req, res) => {
    res.sendFile(path.join(__dirname, '/View/History/historylender.html'));
});
// History-staff page
app.get('/historystaff', (_req, res) => {
    res.sendFile(path.join(__dirname, '/View/History/historystaff.html'));
});

// ============= Root ==============
// localhost:3333/dashboard
// request user status page
app.get('/dashboardstaff', (_req, res) => {
    res.sendFile(path.join(__dirname, '/View/Dashbord/Dashboardstaff.html'));
});
app.get('/dashboardlect', (_req, res) => {
    res.sendFile(path.join(__dirname, '/View/Dashbord/Dashboardlecturer.html'));
});


// booklist page
app.get("/booklist", (req, res) => {
    con.query("SELECT * FROM booklist", (err, results, fields) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Can't get booklist in database!");
        }
        res.status(200).json(results);
    });
});

// Staff
// staff add btn
app.post("/booklist/staff/add", async (req, res) => {
    let {name, image, bookid, type, publisher, date } = req.body;
    if (type === 'Finance'){
        type = 1;
    } else if (type === 'English'){
        type = 2;
    } else if (type === 'Engineer'){
        type = 3;
    } else if (type === 'Science'){
        type = 4;
    } else if (type === 'Marketing'){
        type = 5;
    }

    try {

        con.query(
            "INSERT INTO booklist(name, img, status, book_id, type, publisher, date) VALUES(?, ?, ?, ?, ?, ?, ?)",
            [name, "image100.jpg", 1, bookid, type, publisher, date],
            (err, results, fields) => {
                if (err) {
                    console.log('Error while inserting a user into the database', err);
                    return res.status(401).send();
                }
                return res.status(200).json({message: "New book succesfully created!"})
            }
        )
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    } 
});

// staff edit btn
app.post("/booklist/staff/edit", async (req, res) => {
    let {name, image, bookid, type, publisher, date } = req.body;
    if (type === 'Finance'){
        type = 1;
    } else if (type === 'English'){
        type = 2;
    } else if (type === 'Engineer'){
        type = 3;
    } else if (type === 'Science'){
        type = 4;
    } else if (type === 'Marketing'){
        type = 4;
    } 

    try {

        con.query(
            "UPDATE booklist SET name=?, type=?, publisher=?, date=? WHERE book_id=?",
            [name, type, publisher, date, bookid],
            (err, results, fields) => {
                if (err) {
                    console.log('Error while updating book in the database', err);
                    return res.status(401).send();
                }
                return res.status(200).json({message: "Book updated successfully!"})
            }
        )
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    } 
});

// staff avaliable
app.post("/booklist/staff/avaliable", async (req, res) => {

    let { bookid } = req.body;
    try {

        con.query(
            "UPDATE booklist SET status=? WHERE book_id=?",
            [1, bookid],
            (err, results, fields) => {
                if (err) {
                    console.log('Error while updating status to avaliable', err);
                    return res.status(401).send();
                }
                return res.status(200).json({message: "Updated status to avaliable successfully!"})
            }
        )
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    } 
});

// staff disable btn
app.post("/booklist/staff/disable", async (req, res) => {

    let { bookid } = req.body;
    try {

        con.query(
            "UPDATE booklist SET status=? WHERE book_id=?",
            [4, bookid],
            (err, results, fields) => {
                if (err) {
                    console.log('Error while updating status to disable', err);
                    return res.status(401).send();
                }
                return res.status(200).json({message: "Updated status to disable successfully!"})
            }
        )
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    } 
});

// staff return btn chagne status book
app.post("/booklist/staff/bookreturn", async (req, res) => {

    let { bookid } = req.body;
    try {

        con.query(
            "UPDATE booklist SET status=? WHERE book_id=?",
            [1, bookid],
            (err, results, fields) => {
                if (err) {
                    console.log('Error while updating status to disable', err);
                    return res.status(401).send();
                }
                return res.status(200).json({message: "Updated status to disable successfully!"})
            }
        )
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    } 
});

// staff return btn chagne request
app.post("/booklist/staff/questreturn", async (req, res) => {

    let { bookid, staffid } = req.body;
    try {

        con.query(
            "UPDATE request SET status=?, staff_id=? WHERE book_id=?",
            [3, staffid, bookid],
            (err, results, fields) => {
                if (err) {
                    uconsole.log('Error while updating status to returned', err);
                    return res.status(401).send();
                }
                return res.status(200).json({message: "Updated status to returned successfully!"})
            }
        )
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    } 
});

// get book
app.post("/form_request/:book_id", (req, res) => {
    const book_id = req.params.book_id;
    con.query("SELECT * FROM booklist WHERE book_id = ?", [book_id], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Can't get book information from the database!");
        }
        if (results.length === 0) {
            return res.status(401).send("Book not found!");
        }
        res.status(200).json(results);
        console.log(results);
    });
});

app.get('/form_request/:book_id', (_req, res) =>{
    res.sendFile(path.join(__dirname, '/View/formrequest/index.html'));
});

// app.post("/dashboardlect", function (req, res) {

//     const sql = "SELECT `book_id`, `status` FROM `project`.`booklist`";

//     con.query(sql, [req.session.userID], function (err, results) {
//         if (err) {
//             console.error(err);
//             res.status(500).send('Server error:' + err.message);
//         } else {
//             if (results.length === 0) {

//                 res.status(200).json([]);
//             } else {
//                 // send the data from database
//                 res.status(200).json(results);
//                 console.log(results);
//             }
//         }
//     });
// });

// submit
app.post("/checkRequestStatus", function (req, res) {
    const userID = req.session.userID; // รับ userID จาก session
    const sql = "SELECT status FROM request WHERE student_id = ?";
    con.query(sql, [userID], function (err, results) {
        if (err) {
            console.error(err);
            res.status(500).send('Server error:' + err.message);
        } else {
            // ตรวจสอบว่ามีการร้องขอที่ผู้ใช้ระบุหรือไม่
            if (results.length === 0) {
                // ถ้าไม่มีรายการร้องขอสำหรับผู้ใช้ระบุ
                res.status(200).json(0); // ส่งค่า 0 ให้แสดงว่าไม่มีรายการร้องขอ
            } else {
                // ถ้ามีรายการร้องขอสำหรับผู้ใช้ระบุ
                // ตรวจสอบสถานะของคำขอล่าสุด
                const latestRequestStatus = results[results.length - 1].status;
                res.status(200).json(latestRequestStatus); // ส่งค่าสถานะของคำขอล่าสุดกลับไป
                console.log("Latest request status:", latestRequestStatus);
            }
        }
    });
});


app.post("/form_request/ok/submit", async (req, res) => {
    let { studentID, bookID, returndate, Borrowdate } = req.body;

    // เพิ่มส่วนเงื่อนไขเพื่อตรวจสอบว่าผู้ใช้งานนี้มีคำขอที่มีสถานะเป็น 1 อยู่แล้วหรือไม่
    const checkRequestSQL = "SELECT * FROM request WHERE student_id = ? AND status = 1;";
    con.query(checkRequestSQL, [studentID], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Server error:' + err.message);
        } else {
            // ถ้ามีคำขอที่มีสถานะเป็น 1 อยู่แล้ว
            if (results.length > 0) {
                return res.status(401).send('Cannot borrow book. There is a pending request.');
            } else {
                // ถ้าไม่มีคำขอที่มีสถานะเป็น 1 อยู่
                try {
                    con.query(
                        "INSERT INTO request(book_id, student_id, returned_date, borrowing_date, lecturer_id, status) VALUES(?, ?, ?, ?, ?, ?)",
                        [bookID, studentID, returndate, Borrowdate, 2222056789, 1],
                        (err, results, fields) => {
                            if (err) {
                                console.log('Error while inserting a request into the database', err);
                                return res.status(401).send();
                            }
                            return res.status(200).json({message: "New request succesfully created!"})
                        }
                    )
                } catch(err) {
                    console.log(err);
                    return res.status(500).send();
                } 
            }
        }
    });
});



// pending
app.post("/booklist/pending", async (req, res) => {

    let { bookID } = req.body;
    try {

        con.query(
            "UPDATE booklist SET status=? WHERE book_id=?",
            [2, bookID],
            (err, results, fields) => {
                if (err) {
                    console.log('Error while updating status to pending', err);
                    return res.status(401).send();
                }
                return res.status(200).json({message: "Updated status to pending successfully!"})
            }
        )
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    } 
});

// start server must be the lastest code
const PORT = 3333;
app.listen(PORT, function() {
    console.log('Server is running at port ' + PORT);
}); 
// 3000 famous to use to test the web
