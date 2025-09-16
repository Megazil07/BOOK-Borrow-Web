// onLoad
window.onload = async () => {

    async function getUsername() {
        const response = await fetch('/user');
        const message = await response.json();
        document.querySelector('h3').textContent = message.username;
    }
    getUsername();

    try {

        const path = window.location.pathname;
        const parts = path.split('/');
        const book_id = parts[parts.length - 1];

        const response = await fetch(`/form_request/${book_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const books = await response.json();

        const responseuser = await fetch('/user');
        const user = await responseuser.json();

        const Container = document.querySelector(".container");
        books.forEach(book => {

            if (book.type === 1) {
                book.type = 'Finance';
            } else if (book.type === 2) {
                book.type = 'English';
            } else if (book.type === 3) {
                book.type = 'Engineer';
            } else if (book.type === 4) {
                book.type = 'Science';
            } else if (book.type === 5) {
                book.type = 'Marketing';
            }

            const itemCon = document.createElement('div');
            itemCon.classList.add('item-con');

            const item = document.createElement('div');
            item.classList.add('item');

            const image = document.createElement('div');
            image.classList.add('image');

            const img = document.createElement('img');
            img.src = "/Public/IMG/" + book.img;
            image.appendChild(img);

            const info = document.createElement('div');
            info.classList.add('info');

            const bookname = document.createElement('div');
            bookname.classList.add('bookname');

            const bookname2 = document.createElement('h1');
            bookname2.id = 'bookname';
            bookname2.textContent = book.name;
            bookname.appendChild(bookname2);

            const bookID_con = document.createElement('div');
            bookID_con.classList.add('bookID-con');

            const bookID_text = document.createElement('h4');
            bookID_text.textContent = 'BOOK ID :';

            const bookID = document.createElement('h4');
            bookID.id = 'bookID';
            bookID.textContent = book.book_id;
            bookID_con.appendChild(bookID_text);
            bookID_con.appendChild(bookID);

            const type_con = document.createElement('div');
            type_con.classList.add('type');

            const type_text = document.createElement('h4');
            type_text.textContent = 'Type :';

            const type = document.createElement('h4');
            type.id = 'type';
            type.textContent = book.type;
            type_con.appendChild(type_text);
            type_con.appendChild(type);

            const Publisher_con = document.createElement('div');
            Publisher_con.classList.add('Publisher');

            const Publisher_text = document.createElement('h4');
            Publisher_text.textContent = 'Publisher :';

            const Publisher = document.createElement('h4');
            Publisher.id = 'Publisher';
            Publisher.textContent = book.publisher;
            Publisher_con.appendChild(Publisher_text);
            Publisher_con.appendChild(Publisher);

            const printdate_con = document.createElement('div');
            printdate_con.classList.add('printdate');

            const printdate_text = document.createElement('h4');
            printdate_text.textContent = 'Printdate :';

            const printdate = document.createElement('h4');
            const printDateUTC = new Date(book.date);
            printdate.textContent = printDateUTC.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            printdate_con.appendChild(printdate_text);
            printdate_con.appendChild(printdate);

            itemCon.appendChild(item);
            item.appendChild(image);
            item.appendChild(info);
            info.appendChild(bookname);
            info.appendChild(bookID_con);
            info.appendChild(type_con);
            info.appendChild(Publisher_con);
            info.appendChild(printdate_con);

            const requast_form = document.createElement('div');
            requast_form.classList.add('request-form');

            const date_form = document.createElement('div');
            date_form.classList.add('form-date');

            const name_id = document.createElement('div');
            name_id.classList.add('name-id');

            const nameuser = document.createElement('p');
            nameuser.textContent = user.fullname;

            const user_id = document.createElement('p');
            user_id.textContent = user.userID;
            name_id.appendChild(nameuser);
            name_id.appendChild(user_id);

            const date_con = document.createElement('div');
            date_con.classList.add('date');

            const day_borrow = document.createElement('p');
            day_borrow.textContent = 'DAY BORROWING';

            const date_today = document.createElement('h1');
            date_today.id = 'date-today';

            const dat = document.createElement('p');
            dat.textContent = '-';

            const date_returned = document.createElement('h1');
            date_returned.id = 'date-returned';

            const day_return = document.createElement('p');
            day_return.textContent = 'DAY RETURN';
            date_con.appendChild(day_borrow);
            date_con.appendChild(date_today);
            date_con.appendChild(dat);
            date_con.appendChild(date_returned);
            date_con.appendChild(day_return);
            date_form.appendChild(name_id);
            date_form.appendChild(date_con);

            const btn_con = document.createElement('div');
            btn_con.classList.add('btn-con');

            const button_submit = document.createElement('button');
            button_submit.id = 'submit-btn';
            button_submit.textContent = 'SUBMIT';

            const button_back = document.createElement('button');
            button_back.id = 'back-btn';

            const button_back_a = document.createElement('a');
            button_back_a.href = 'http://localhost:3333/Booklist-student';
            button_back_a.textContent = 'GO TO BOOKLIST';
            button_back.appendChild(button_back_a);
            btn_con.appendChild(button_submit);
            btn_con.appendChild(button_back);
            requast_form.appendChild(date_form);
            requast_form.appendChild(btn_con);
            Container.appendChild(itemCon);
            Container.appendChild(requast_form);

            let dateToday = document.getElementById("date-today");
            let today = new Date();
            let day = today.getDate() + 1 < 10 ? "0" + today.getDate() : today.getDate();
            // month are counted from 0
            let month = (today.getMonth() + 1 < 10 ? "0" : "") + (today.getMonth() + 1);
            let year = today.getFullYear();
            dateToday.textContent = `${day}/${month}/${year}`;

            let dateReturned = document.getElementById("date-returned");
            let returnedDate = new Date(year, month - 1, day);
            returnedDate.setDate(returnedDate.getDate() + 1); 
            let formattedDate = returnedDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
            dateReturned.textContent = formattedDate;


            button_submit.addEventListener('click', async () => {
                try {
                    // เพิ่มการเรียก API เพื่อตรวจสอบสถานะคำขอ
                    const response = await fetch('/checkRequestStatus', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ userID: user.userID })
                    });
            
                    const requestData = await response.json();
            
                    // ตรวจสอบว่ามีคำขอที่มีสถานะเป็น 1 อยู่แล้วหรือไม่
                    if (requestData == 1 || requestData == 2) {
                        // หากมีคำขอที่มีสถานะเป็น 1 อยู่แล้ว แสดงข้อความแจ้งเตือน
                        Swal.fire({
                            title: 'Sorry!',
                            text: 'The operation cannot be completed because you already have an item.',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    } else {
                        // หากไม่มีคำขอที่มีสถานะเป็น 1 อยู่แล้ว ดำเนินการยืมหนังสือต่อไป
                        let studentID = user.userID;
                        let bookID = book.book_id;
                        let dateToday = new Date();
                        let dateReturned = new Date(dateToday);
                        dateReturned.setDate(dateReturned.getDate() + 1);
            
                        // Format dates as ISO strings
                        let Borrowdate = dateToday.toISOString().split('T')[0]; // Format: YYYY-MM-DD
                        let returndate = dateReturned.toISOString().split('T')[0];
            
                        const response1 = await fetch('/form_request/ok/submit', {
                            method: 'POST', // POST method
                            // Send JSON through HTTP for database
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ studentID, bookID, returndate, Borrowdate })
                        });
            
                        const response2 = await fetch('/booklist/pending', {
                            method: 'POST', // POST method
                            // Send JSON through HTTP for database
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ bookID })
                        });
            
                        await Promise.all([response1, response2]);
                        if (response1.ok && response2.ok) {
                            // If response is ok, show Swal2
                            Swal.fire({
                                html: `
                        <div class="SwalContainer">
                            <h1 class="title">Well Done</h1>
                            <h3>${book.name}</h3>
                            <h5>${user.fullname}  ${user.userID}</h5>
                            <div class="Swaldate-con">
                                <h5>${Borrowdate}</h5>
                                <h5>-</h5>
                                <h5>${returndate}</h5>
                            </div>
                            <h5>Please check your request status</h5>
                        </div>
                        `,
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    window.location.href = 'http://localhost:3333/Booklist-student';
                                }
                            });
                        } else {
                            console.error('Error:', 'One or both requests failed');
                        }
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            });
        });
    } catch (error) {
        console.error('Error fetching book list:', error);
    }
};
