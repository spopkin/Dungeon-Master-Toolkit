//Depends on having JQuery loaded

function goToAuthPage() {
    window.location.href = 'auth.js';
}

function checkAuth() {
    $(document).ready(function(){
        var storedKey = localStorage.getItem('authToken');

    }); 
}
