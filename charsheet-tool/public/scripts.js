//Depends on having JQuery loaded

function goToAuthPage() {
    window.location.href = 'auth.js';
}

function checkAuth() {
    $(document).ready(function() {
        var storedKey = localStorage.getItem('authToken');

    });
}

function getAuthTimes() {
    $(document).ready(function() {
        var objToSend = {};
        $.ajax({
            url: 'http://localhost:8080/get-auth-times',
            type: 'GET',
            data: objToSend,
            success: function(data) {
                alert(data);
            }
        });
    });
}
