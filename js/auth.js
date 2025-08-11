
$(() => {


    $("#loginBtn").click(async (e) => {
        e.preventDefault();
        const email = $("#login_email").val();
        const password = $("#login_pswd").val();

        if (!email || !password) {
            set_ERROR_Message("❌ Please fill in all fields.");
            return;
        }

        const { data, error } = await supabaseConn.auth.signInWithPassword({
            email: email,
            password: password
        });


        if (error) {
            set_ERROR_Message("❌ " + error.message);
        } else {
            localStorage.setItem('isLogin', true);
            window.location.href = './index.html';
        }
    });

    $("#signupBtn").click(async (e) => {
        e.preventDefault();
        let username = $("#signup_username").val();
        let email = $("#signup_email").val();
        let password = $("#signup_pswd").val();
        let confirmPassword = $("#signup_cpswd").val();
        $("#error_container").text("");


        if (password !== confirmPassword) {
            set_ERROR_Message("❌ Passwords do not match!");
            return;
        }

        if (!email || !password) {
            set_ERROR_Message("❌ Please fill in all fields.");
            return;
        }

        const { data, error } = await supabaseConn.auth.signUp({
            email: email,
            password: password
        });

        if (error) {
            set_ERROR_Message("Signup failed: " + error.message);
        } else {
            localStorage.setItem('isLogin', true);
            window.location.href = './index.html';
        }
    });
});


const set_ERROR_Message = (message) => {
    console.log(message);
    $("#error_container").removeClass("hidden");
    $("#error_container").text(message);

    setTimeout(() => {
        $("#error_container").addClass("hidden");
    }, 5000);
}

