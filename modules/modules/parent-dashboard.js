window.ParentDashboard = (function() {
    return {
        show: function() {
            alert("Parent Dashboard - Default PIN: 1234");
        },
        verifyPIN: function() {
            console.log("Verifying PIN...");
        }
    };
})();
