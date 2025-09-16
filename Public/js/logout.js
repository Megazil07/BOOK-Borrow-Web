// Logout click
document.querySelector('#logout').onclick = function () {
    event.preventDefault();

    Swal.fire({
            customClass: {
            confirmButton: "custom-button-confirm", // Define your custom class name
            cancelButton: "custom-button-cancel", // Apply the same class to the cancel button
        },
        buttonsStyling: false,
            title: "<h5 style='color: black'>Are you sure?</h5>",
            text: "TO LOGOUT THIS ID ACCOUNT?",
            icon: "question",
            imageUrl: "../../public/img/book.png",
            imageWidth: 150,
            showCancelButton: true,
            confirmButtonColor: "#4d9f9f",
            cancelButtonColor: "#f1eee5",
            confirmButtonText: "Yes!",
            cancelButtonText: "No"
        }).then((result) => {
            if (result.isConfirmed) {
                // Swal.fire({
                //     title: "<h5 style='color: black'>Confirm lockout</h5>",
                //     text: "Lockout is successful.",
                //     icon: "success",
                //     confirmButtonColor: "#4d9f9f",
                //     imageUrl: "/public/img/book.png",
                //     imageWidth: 150,
                // }).then((result)=>{
                    localStorage.clear();
                    sessionStorage.clear();
                    window.location.replace('http://localhost:3333/logout');
                // });
            }
        });
}