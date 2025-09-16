// onLoad
window.onload = async () => {

async function getBooklist() {

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
                    book.status = 'Borrowing'
                } else if (book.status === 4){
                    book.status = 'Disable'
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

                    const button = document.createElement('button');
                    button.classList.add('borrow-btn');
                    button.textContent = 'Borrow';
                    info.appendChild(btn_con);
                    btn_con.appendChild(button);

                    button.addEventListener('click', function() {
                        window.location.href = `/form_request/${book.book_id}`;
                    });
                } 
                
                if(book.status == 'Pending'){
                    status.style.color = 'yellow';
                } else if(book.status == 'Borrowing'){
                    status.style.color = 'black';
                } else if(book.status == 'Disable'){
                    status.style.color = 'red';
                }
                
        });
    } catch (error) {
        console.error('Error fetching book list:', error);
    }
};
getBooklist();
}
