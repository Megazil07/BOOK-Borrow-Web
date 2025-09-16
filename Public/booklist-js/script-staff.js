// onLoad
window.onload = async () => {

    async function getUsername() {
        const response = await fetch('/user');
        const message = await response.json();
        document.querySelector('h3').textContent = message.username;
    }
    getUsername();
    
    try {
        const response = await fetch('/booklist');
        const books = await response.json();

        const booklistContainer = document.querySelector("#book-list");
        books.forEach(book => {

                if (book.status === 1){
                    book.status = 'Avaliable'
                } else if (book.status === 2){
                    book.status = 'Pending'
                } else if (book.status === 3){
                    book.status = 'Borrowed'
                } else if (book.status === 4){
                    book.status = 'Disabled'
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

                const title = document.createElement('h3');
                title.textContent = book.name;

                const status_con = document.createElement('div');
                status_con.classList.add('status-con');

                const status_text = document.createElement('h4');
                status_text.textContent = 'status :';

                const status = document.createElement('h4');
                status.id = 'status';
                status.textContent = book.status;
                status_con.appendChild(status_text);
                status_con.appendChild(status);

                booklistContainer.appendChild(itemCon);
                itemCon.appendChild(item);
                item.appendChild(image);
                item.appendChild(info);
                info.appendChild(title);
                info.appendChild(status_con);

                const btn_con = document.createElement('div');
                btn_con.classList.add('btn-con');

                if(book.status == 'Avaliable'){

                    const disable_button = document.createElement('button');
                    disable_button.classList.add('Disable-btn');
                    disable_button.textContent = 'Disable';
                    info.appendChild(btn_con);
                    btn_con.appendChild(disable_button);

                    const edit_button = document.createElement('button');
                    edit_button.classList.add('Edit-btn');
                    edit_button.textContent = 'Edit';
                    btn_con.appendChild(edit_button);



                    // Disable btn
                        disable_button.addEventListener('click', function () {
                                Swal.fire({
                                    html: `
                                    <div class="addSwalcon">
                                    <h1>Are you sure?</h1> 
                                    </div>
                                    `,
                                    confirmButtonColor: "#2ed404",
                                    cancelButtonColor: "#d33",
                                    confirmButtonText: 'Yes',
                                    cancelButtonText: 'No',
                                    showCancelButton: true,
                                }).then(async (result) => {
                                    if (result.isConfirmed) {
        
                                        let bookid = book.book_id;
        
                                        try {
                                            const response = await fetch('/booklist/staff/disable', {
                                                method: 'POST', // POST method
                                                // Send JSON through HTTP for database
                                                headers: {
                                                    'Content-Type': 'application/json'
                                                },
                                                body: JSON.stringify({ bookid })
                                            });
                                
                                            if (response.ok) {
                                                Swal.fire({
                                                    icon: 'success',
                                                    title: 'Updated status to disable successfully!',
                                                }).then((result) => {
                                                    if (result.isConfirmed) {
                                                        // Reload the page
                                                        window.location.reload();
                                                    }
                                                });
                                            } else {
                                                console.error('Edit failed:', response.statusText);
                                            }
                                        } catch (error) {
                                            console.error('Error:', error);
                                        }
                                    }
                                });
                           });


                    // Edittn
                    edit_button.addEventListener('click', () => {
                        Swal.fire({
                            html: `
                            <div class="addSwalcon">
                            <h1>Edit</h1>
                                <div class="nameCon">
                                    <h3>Name :</h3>
                                    <input type="text" name="name" id="name" value="${book.name}">
                                </div>
                                <div class="imagecon">
                                    <h3>Image :</h3>
                                    <input type="file" name="image" id="image">
                                </div>
                                <div class="bookidcon">
                                    <h3>BookID :</h3>
                                    <h3 class="bookid" name="bookid">${book.book_id}</h3>
                                </div>
                                <div class="typecon">
                                    <h3>Type :</h3>
                                    <select id="type" name="type">
                                        <option ${book.type === 1 ? 'selected' : ''}>Finance</option>
                                        <option ${book.type === 2 ? 'selected' : ''}>English</option>
                                        <option ${book.type === 3 ? 'selected' : ''}>Engineer</option>
                                        <option ${book.type === 4 ? 'selected' : ''}>Science</option>
                                        <option ${book.type === 5 ? 'selected' : ''}>Marketing</option>
                                    </select>
                                </div>
                                <div class="publishcon">
                                    <h3>Publisher :</h3>
                                    <input type="text" id="publisher" name="publisher" value="${book.publisher}">
                                </div>
                                <div class="datecon">
                                    <h3>Print Date :</h3>
                                    <input type="date" id="date" name="date">
                                </div>
                            </div>
                            `,
                            confirmButtonColor: "#2ed404",
                            cancelButtonColor: "#d33",
                            confirmButtonText: 'Edit',
                            showCancelButton: true,
                        }).then(async (result) => {
                            if (result.isConfirmed) {
                                let name = document.querySelector('#name').value;
                                let image = document.querySelector('#image').files[0];
                                let bookid = document.querySelector('.bookid').textContent;
                                let type = document.querySelector('#type').value;
                                let publisher = document.querySelector('#publisher').value;
                                let date = document.querySelector('#date').value;

                                try {
                                    const response = await fetch('/booklist/staff/edit', {
                                        method: 'POST', // POST method
                                        // Send JSON through HTTP for database
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({ name, image, bookid, type, publisher, date })
                                    });
                        
                                    if (response.ok) {
                                        Swal.fire({
                                            icon: 'success',
                                            title: 'Edit Successful!',
                                        }).then((result) => {
                                            if (result.isConfirmed) {
                                                // Reload the page
                                                window.location.reload();
                                            }
                                        });
                                    } else {
                                        console.error('Edit failed:', response.statusText);
                                    }
                                } catch (error) {
                                    console.error('Error:', error);
                                }
                            }
                        });
                    });
                } else if (book.status == 'Pending') {
                    status.style.color = 'yellow';

                    const edit_button = document.createElement('button');
                    edit_button.classList.add('Edit-btn');
                    edit_button.textContent = 'Edit';
                    info.appendChild(btn_con);
                    btn_con.appendChild(edit_button);



                    // Edittn
                    edit_button.addEventListener('click', () => {
                        Swal.fire({
                            html: `
                            <div class="addSwalcon">
                            <h1>Edit</h1>
                                <div class="nameCon">
                                    <h3>Name :</h3>
                                    <input type="text" name="name" id="name" value="${book.name}">
                                </div>
                                <div class="imagecon">
                                    <h3>Image :</h3>
                                    <input type="file" name="image" id="image">
                                </div>
                                <div class="bookidcon">
                                    <h3>BookID :</h3>
                                    <h3 class="bookid" name="bookid">${book.book_id}</h3>
                                </div>
                                <div class="typecon">
                                    <h3>Type :</h3>
                                    <select id="type" name="type">
                                        <option ${book.type === 1 ? 'selected' : ''}>Finance</option>
                                        <option ${book.type === 2 ? 'selected' : ''}>English</option>
                                        <option ${book.type === 3 ? 'selected' : ''}>Engineer</option>
                                        <option ${book.type === 4 ? 'selected' : ''}>Science</option>
                                        <option ${book.type === 5 ? 'selected' : ''}>Marketing</option>
                                    </select>
                                </div>
                                <div class="publishcon">
                                    <h3>Publisher :</h3>
                                    <input type="text" id="publisher" name="publisher" value="${book.publisher}">
                                </div>
                                <div class="datecon">
                                    <h3>Print Date :</h3>
                                    <input type="date" id="date" name="date">
                                </div>
                            </div>
                            `,
                            confirmButtonColor: "#2ed404",
                            cancelButtonColor: "#d33",
                            confirmButtonText: 'Edit',
                            showCancelButton: true,
                        }).then(async (result) => {
                            if (result.isConfirmed) {
                                let name = document.querySelector('#name').value;
                                let image = document.querySelector('#image').files[0];
                                let bookid = document.querySelector('.bookid').textContent;
                                let type = document.querySelector('#type').value;
                                let publisher = document.querySelector('#publisher').value;
                                let date = document.querySelector('#date').value;

                                try {
                                    const response = await fetch('/booklist/staff/edit', {
                                        method: 'POST', // POST method
                                        // Send JSON through HTTP for database
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({ name, image, bookid, type, publisher, date })
                                    });
                        
                                    if (response.ok) {
                                        Swal.fire({
                                            icon: 'success',
                                            title: 'Edit Successful!',
                                        }).then((result) => {
                                            if (result.isConfirmed) {
                                                // Reload the page
                                                window.location.reload();
                                            }
                                        });
                                    } else {
                                        console.error('Edit failed:', response.statusText);
                                    }
                                } catch (error) {
                                    console.error('Error:', error);
                                }
                            }
                        });
                    });
                } else if (book.status == 'Borrowed') {
                    status.style.color = 'black';

                    const return_button = document.createElement('button');
                    return_button.classList.add('Return-btn');
                    return_button.textContent = 'Return';
                    info.appendChild(btn_con);
                    btn_con.appendChild(return_button);

                    // return btn
                    return_button.addEventListener('click', function () {
                        Swal.fire({
                            html: `
                            <div class="addSwalcon">
                            <h1>Are you sure?</h1> 
                            </div>
                            `,
                            confirmButtonColor: "#2ed404",
                            cancelButtonColor: "#d33",
                            confirmButtonText: 'Yes',
                            cancelButtonText: 'No',
                            showCancelButton: true,
                        }).then(async (result) => {
                            if (result.isConfirmed) {

                                const responseuser = await fetch('/user');
                                const user = await responseuser.json();

                                let bookid = book.book_id;
                                let staffid = user.userID;

                                try {
                                    const response1 = await fetch('/booklist/staff/bookreturn', {
                                        method: 'POST', // POST method
                                        // Send JSON through HTTP for database
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({ bookid })
                                    });
                        
                                    const response2 = await fetch('/booklist/staff/questreturn', {
                                        method: 'POST', // POST method
                                        // Send JSON through HTTP for database
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({ bookid, staffid })
                                    });

                                    await Promise.all([response1, response2]);
                                    if (response1.ok && response2.ok) {
                                        Swal.fire({
                                            icon: 'success',
                                            title: 'Updated status to avaliable and returned successfully!',
                                        }).then((result) => {
                                            if (result.isConfirmed) {
                                                // Reload the page
                                                window.location.reload();
                                            }
                                        });
                                    } else {
                                        console.error('Edit failed:', response.statusText);
                                    }
                                } catch (error) {
                                    console.error('Error:', error);
                                }
                            }
                        });
                   });

                    const edit_button = document.createElement('button');
                    edit_button.classList.add('Edit-btn');
                    edit_button.textContent = 'Edit';
                    info.appendChild(btn_con);
                    btn_con.appendChild(edit_button);



                    // Edittn
                    edit_button.addEventListener('click', () => {
                        Swal.fire({
                            html: `
                            <div class="addSwalcon">
                            <h1>Edit</h1>
                                <div class="nameCon">
                                    <h3>Name :</h3>
                                    <input type="text" name="name" id="name" value="${book.name}">
                                </div>
                                <div class="imagecon">
                                    <h3>Image :</h3>
                                    <input type="file" name="image" id="image">
                                </div>
                                <div class="bookidcon">
                                    <h3>BookID :</h3>
                                    <h3 class="bookid" name="bookid">${book.book_id}</h3>
                                </div>
                                <div class="typecon">
                                    <h3>Type :</h3>
                                    <select id="type" name="type">
                                        <option ${book.type === 1 ? 'selected' : ''}>Finance</option>
                                        <option ${book.type === 2 ? 'selected' : ''}>English</option>
                                        <option ${book.type === 3 ? 'selected' : ''}>Engineer</option>
                                        <option ${book.type === 4 ? 'selected' : ''}>Science</option>
                                        <option ${book.type === 5 ? 'selected' : ''}>Marketing</option>
                                    </select>
                                </div>
                                <div class="publishcon">
                                    <h3>Publisher :</h3>
                                    <input type="text" id="publisher" name="publisher" value="${book.publisher}">
                                </div>
                                <div class="datecon">
                                    <h3>Print Date :</h3>
                                    <input type="date" id="date" name="date">
                                </div>
                            </div>
                            `,
                            confirmButtonColor: "#2ed404",
                            cancelButtonColor: "#d33",
                            confirmButtonText: 'Edit',
                            showCancelButton: true,
                        }).then(async (result) => {
                            if (result.isConfirmed) {
                                let name = document.querySelector('#name').value;
                                let image = document.querySelector('#image').files[0];
                                let bookid = document.querySelector('.bookid').textContent;
                                let type = document.querySelector('#type').value;
                                let publisher = document.querySelector('#publisher').value;
                                let date = document.querySelector('#date').value;

                                try {
                                    const response = await fetch('/booklist/staff/edit', {
                                        method: 'POST', // POST method
                                        // Send JSON through HTTP for database
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({ name, image, bookid, type, publisher, date })
                                    });
                        
                                    if (response.ok) {
                                        Swal.fire({
                                            icon: 'success',
                                            title: 'Edit Successful!',
                                        }).then((result) => {
                                            if (result.isConfirmed) {
                                                // Reload the page
                                                window.location.reload();
                                            }
                                        });
                                    } else {
                                        console.error('Edit failed:', response.statusText);
                                    }
                                } catch (error) {
                                    console.error('Error:', error);
                                }
                            }
                        });
                    });
                } else if (book.status == 'Disabled') {
                    status.style.color = 'red';

                    const avali_button = document.createElement('button');
                    avali_button.classList.add('Avali-btn');
                    avali_button.textContent = 'Avaliable';
                    info.appendChild(btn_con);
                    btn_con.appendChild(avali_button);

                    const edit_button = document.createElement('button');
                    edit_button.classList.add('Edit-btn');
                    edit_button.textContent = 'Edit';
                    btn_con.appendChild(edit_button);





                    // Avaliable btn
                    avali_button.addEventListener('click', function () {
                        Swal.fire({
                            html: `
                            <div class="addSwalcon">
                            <h1>Are you sure?</h1> 
                            </div>
                            `,
                            confirmButtonColor: "#2ed404",
                            cancelButtonColor: "#d33",
                            confirmButtonText: 'Yes',
                            cancelButtonText: 'No',
                            showCancelButton: true,
                        }).then(async (result) => {
                            if (result.isConfirmed) {

                                let bookid = book.book_id;

                                try {
                                    const response = await fetch('/booklist/staff/avaliable', {
                                        method: 'POST', // POST method
                                        // Send JSON through HTTP for database
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({ bookid })
                                    });
                        
                                    if (response.ok) {
                                        Swal.fire({
                                            icon: 'success',
                                            title: 'Updated status to avaliable successfully!',
                                        }).then((result) => {
                                            if (result.isConfirmed) {
                                                // Reload the page
                                                window.location.reload();
                                            }
                                        });
                                    } else {
                                        console.error('Edit failed:', response.statusText);
                                    }
                                } catch (error) {
                                    console.error('Error:', error);
                                }
                            }
                        });
                    });



                    // Edittn
                    edit_button.addEventListener('click', () => {
                        Swal.fire({
                            html: `
                            <div class="addSwalcon">
                            <h1>Edit</h1>
                                <div class="nameCon">
                                    <h3>Name :</h3>
                                    <input type="text" name="name" id="name" value="${book.name}">
                                </div>
                                <div class="imagecon">
                                    <h3>Image :</h3>
                                    <input type="file" name="image" id="image">
                                </div>
                                <div class="bookidcon">
                                    <h3>BookID :</h3>
                                    <h3 class="bookid" name="bookid">${book.book_id}</h3>
                                </div>
                                <div class="typecon">
                                    <h3>Type :</h3>
                                    <select id="type" name="type">
                                        <option ${book.type === 1 ? 'selected' : ''}>Finance</option>
                                        <option ${book.type === 2 ? 'selected' : ''}>English</option>
                                        <option ${book.type === 3 ? 'selected' : ''}>Engineer</option>
                                        <option ${book.type === 4 ? 'selected' : ''}>Science</option>
                                        <option ${book.type === 5 ? 'selected' : ''}>Marketing</option>
                                    </select>
                                </div>
                                <div class="publishcon">
                                    <h3>Publisher :</h3>
                                    <input type="text" id="publisher" name="publisher" value="${book.publisher}">
                                </div>
                                <div class="datecon">
                                    <h3>Print Date :</h3>
                                    <input type="date" id="date" name="date">
                                </div>
                            </div>
                            `,
                            confirmButtonColor: "#2ed404",
                            cancelButtonColor: "#d33",
                            confirmButtonText: 'Edit',
                            showCancelButton: true,
                        }).then(async (result) => {
                            if (result.isConfirmed) {
                                let name = document.querySelector('#name').value;
                                let image = document.querySelector('#image').files[0];
                                let bookid = document.querySelector('.bookid').textContent;
                                let type = document.querySelector('#type').value;
                                let publisher = document.querySelector('#publisher').value;
                                let date = document.querySelector('#date').value;

                                try {
                                    const response = await fetch('/booklist/staff/edit', {
                                        method: 'POST', // POST method
                                        // Send JSON through HTTP for database
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({ name, image, bookid, type, publisher, date })
                                    });
                        
                                    if (response.ok) {
                                        Swal.fire({
                                            icon: 'success',
                                            title: 'Edit Successful!',
                                        }).then((result) => {
                                            if (result.isConfirmed) {
                                                // Reload the page
                                                window.location.reload();
                                            }
                                        });
                                    } else {
                                        console.error('Edit failed:', response.statusText);
                                    }
                                } catch (error) {
                                    console.error('Error:', error);
                                }
                            }
                        });
                    });
                } 
        });
    } catch (error) {
        console.error('Error fetching book list:', error);
    }
};



// Addbtn
document.querySelector('.add').addEventListener('click', () => {

    let mathrandom = Math.floor(Math.random() * (90000000 + 2000) +1);

    Swal.fire({
        html: `
        <div class="addSwalcon">
        <h1>Add</h1>
            <div class="nameCon">
                <h3>Name :</h3>
                <input type="text" name="name" id="name"">
            </div>
            <div class="imagecon">
                <h3>Image :</h3>
                <input type="file" name="image" id="image">
            </div>
            <div class="bookidcon">
                <h3>BookID :</h3>
                <h3 class="bookid" name="bookid">${mathrandom}</h3>
            </div>
            <div class="typecon">
                <h3>Type :</h3>
                <select id="type" name="type">
                    <option>Finance</option>
                    <option>English</option>
                    <option>Engineer</option>
                    <option>Science</option>
                    <option>Marketing</option>
                </select>
            </div>
            <div class="publishcon">
                <h3>Publisher :</h3>
                <input type="text" id="publisher" name="publisher">
            </div>
            <div class="datecon">
                <h3>Print Date :</h3>
                <input type="date" id="date" name="date">
            </div>
        </div>
        `,
        confirmButtonColor: "#2ed404",
        cancelButtonColor: "#d33",
        confirmButtonText: 'Add',
        showCancelButton: true,
    }).then(async (result) => {
        if (result.isConfirmed) {
            
            let name = document.querySelector('#name').value;
            let image = document.querySelector('#image').files[0];
            let bookid = document.querySelector('.bookid').textContent;
            let type = document.querySelector('#type').value;
            let publisher = document.querySelector('#publisher').value;
            let date = document.querySelector('#date').value;

            try {
                const response = await fetch('/booklist/staff/add', {
                    method: 'POST', // POST method
                    // Send JSON through HTTP for database
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, image, bookid, type, publisher, date })
                });
    
                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Add Successful!',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // Reload the page
                            window.location.reload();
                        }
                    });
                } else {
                    console.error('Add failed:', response.statusText);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    });
});